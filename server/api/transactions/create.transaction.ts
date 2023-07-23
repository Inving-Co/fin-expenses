import {createTransaction} from "~/server/models/transactions";

export default defineEventHandler(async (event) => {
    const {date, description, amount, categoryId, secretPin} = await readBody(event);

    if(secretPin != useRuntimeConfig().APP_SECRET_PIN) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized secret PIN is not valid',
        })
    }

    return createTransaction(date, description, amount, categoryId)
})
