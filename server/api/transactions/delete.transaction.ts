import {deleteTransaction} from "~/server/models/transactions";

export default defineEventHandler(async (event) => {
    const {id, secretPin} = await getQuery(event);

    if (secretPin != useRuntimeConfig().APP_SECRET_PIN) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized secret PIN is not valid',
        })
    }

    // @ts-ignore getQuery convert the params to be string
    return deleteTransaction(+id)
})