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
                cu.id, cu."latestReportReceivedAt", cu."receiveReport", u.id as "userId", u.email as "userEmail", u.name as "userName", cu.id as "circleId"
            FROM
                "CircleUsers" as cu
                LEFT JOIN "Circles" as c ON c."id" = cu."circleId"
                LEFT JOIN "Users" as u ON u."id" = cu."userId"
            WHERE
                "receiveReport" = TRUE
                AND (
                    (
                        "latestReportReceivedAt" BETWEEN NOW() :: DATE - EXTRACT(
                            DOW
                            FROM
                                NOW()
                        ) :: INTEGER -7
                        AND NOW() :: DATE - EXTRACT(
                            DOW
                            from
                                NOW()
                        ) :: INTEGER
                    )
                    OR "latestReportReceivedAt" IS NULL
                )
            `

            circleUsers = result.rows

        } finally {
            // Release the connection back into the pool
            connection.release()
        }


        const statusSent = []

        for (let i = 0; i < circleUsers.length; i++) {
            await timeout(10000)
            statusSent.push({
                index: i,
                email: circleUsers[i].userEmail,
                status: 'ok'
            })
        }


        // Encode the result as pretty printed JSON
        const body = JSON.stringify(statusSent)

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
