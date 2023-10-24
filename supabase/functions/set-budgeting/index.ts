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
  try {
    // Grab a connection from the pool
    const connection = await pool.connect()

    let counter = 0

    try {

      // Run a query
      const result = await connection.queryObject`
            SELECT
                cb."id", cb."userId", cb."circleId", cb."amount", cb."archivedAt", cb."startedAt", cb."endedAt"
            FROM
                "CircleBudgets" as cb
            WHERE
                cb."endedAt" < NOW()
            `
      for (const row of result.rows) {
        // Calculate the difference between startedAt and endedAt
        const differenceInMilliseconds = new Date(row.endedAt).getTime() - new Date(row.startedAt).getTime();

        // Calculate the new startedAt and endedAt dates for the next period
        const newStartedAt = new Date(new Date(row.endedAt).getTime() + 1); // Start the day after the previous endedAt
        const newEndedAt = new Date(newStartedAt.getTime() + differenceInMilliseconds);

        const newBudget = await connection.queryObject`
            INSERT INTO "CircleBudgets" ("userId", "circleId", "amount", "archivedAt", "startedAt", "endedAt")
            VALUES (${row.userId}, ${row.circleId}, ${row.amount}, ${row.archivedAt}, ${newStartedAt.toISOString()}, ${newEndedAt.toISOString()})
            RETURNING id
        `;

        const newBudgetId = newBudget.rows[0].id;

        const plannings = await connection.queryObject`
            SELECT
                cbp."id", cbp."userId", cbp."amount", cbp."categoryId", cbp."archivedAt"
            FROM
                "CircleBudgetPlannings" as cbp
            WHERE
                cbp."circleBudgetId" = ${row.id}
        `;

        for (const planning of plannings.rows) {
          await connection.queryObject`
            INSERT INTO "CircleBudgetPlannings" ("circleBudgetId", "userId", "amount", "categoryId", "archivedAt")
            VALUES (${newBudgetId}, ${planning.userId}, ${planning.amount}, ${planning.categoryId}, ${planning.archivedAt})
        `;
        }

        counter++
      }
    } finally {
      // Release the connection back into the pool
      connection.release()
    }

    // Encode the result as pretty printed JSON
    const body = JSON.stringify({
      messages: `Founded ${counter} circle budget`
    }, (_, v) => typeof v === 'bigint' ? +v.toString() : v)


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
