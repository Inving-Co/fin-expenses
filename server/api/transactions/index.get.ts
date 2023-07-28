import {getTransactions} from "~/server/models/transactions";

export default defineEventHandler(async (event) => {
    const {key, startDate, endDate, secretPin} = await getQuery(event)

    // if(secretPin != useRuntimeConfig().APP_SECRET_PIN) {
    //     throw createError({
    //         statusCode: 401,
    //         statusMessage: 'Unauthorized secret PIN is not valid',
    //     })
    // }

    const cookies = parseCookies(event)
    const userId =  +cookies['user-id'] as number | undefined

    return getTransactions(key as string, {start: startDate as string, end: endDate as string}, userId)
})
