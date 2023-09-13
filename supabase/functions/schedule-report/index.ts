// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { Pool } from 'https://deno.land/x/postgres@v0.17.0/mod.ts'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const pool = new Pool(Deno.env.get('DATABASE_URL'), 1)

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const handler = async (_request: Request): Promise<Response> => {
    let circleUsers;
    try {
        // Grab a connection from the pool
        const connection = await pool.connect()

        try {

            // Run a query
            const result = await connection.queryObject`
            SELECT
                cu.id,
                cu."latestReportReceivedAt",
                cu."receiveReport",
                u.id as "userId",
                u.name as "userName",
                u.email as "userEmail",
                cu.id as "circleUserId",
                c.id as "circleId",
                c.name as "circleName",
                SUM(
                    case
                        when t."categoryId" = 'ed424618-eb48-45af-a99f-a118ce0846a1' then t."amount"
                        else 0
                    end
                ) as "incomeAmount",
                SUM(
                    case
                        when t."categoryId" <> 'ed424618-eb48-45af-a99f-a118ce0846a1' then t."amount"
                        else 0
                    end
                ) as "expenseAmount"
            FROM
                "CircleUsers" as cu
                LEFT JOIN "Circles" as c ON c."id" = cu."circleId"
                LEFT JOIN "Users" as u ON u."id" = cu."userId"
                LEFT JOIN "Records" as t on c."id" = t."circleId"
            WHERE
                "receiveReport" = TRUE
                AND (
                    t."circleId" = c."id"
                    AND (
                        t."createdAt" BETWEEN NOW() :: DATE - EXTRACT(
                            DOW
                            FROM
                                NOW()
                        ) :: INTEGER - 7
                        AND NOW() :: DATE - EXTRACT(
                            DOW
                            from
                                NOW()
                        ) :: INTEGER
                    )
                )
            GROUP BY
                cu.id,
                u.id,
                c.id
            `

            circleUsers = result.rows

        } finally {
            // Release the connection back into the pool
            connection.release()
        }


        const statusSent = []

        for (let i = 0; i < circleUsers.length; i++) {
            const res = await fetch('https://qstash.upstash.io/v1/publish/***REMOVED***/functions/v1/send-email', {
                method: 'POST',
                headers: {
                    'Upstash-Forward-Authorization': `Bearer ${Deno.env.get('SUP_ANON_KEY')}`,
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Deno.env.get('QSTASH_TOKEN')}`,
                },
                body: JSON.stringify({
                        subject: 'Weekly Email Report',
                        recipient_email: circleUsers[i].userEmail,
                        recipient_name: circleUsers[i].userName,
                        from: 'report@inving.co',
                        content: {
                            circleUserId: circleUsers[i].circleUserId,
                            report: {
                                type: 'Weekly',
                                    message_1: 'Here\'s your weekly financial report, plan your next move for a better week.',
                                    message_2: `Last week\'s activity on circle <strong>${circleUsers[i].circleName}</strong>`,
                                    expense_amount: circleUsers[i].expenseAmount,
                                    income_amount: circleUsers[i].incomeAmount
                            }
                    }
                }, (_, v) => typeof v === 'bigint' ? +v.toString() : v),
            })

            statusSent.push({
                index: i,
                email: circleUsers[i].userEmail,
                status: res.status,
            })
        }


        // Encode the result as pretty printed JSON
        const body = JSON.stringify(statusSent, (_, v) => typeof v === 'bigint' ? +v.toString() : v)


        // Return the response with the correct content type header
        return new Response(body, {
            status: 200,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        })
    } catch (err) {
        console.error(err)
        return new Response(String(err?.message ?? err), { status: 500 })
    }
}

serve(handler)
