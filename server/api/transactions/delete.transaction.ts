import {deleteTransaction} from "~/server/models/transactions";

export default defineEventHandler((event) => {
    const {id, secretPin} = getQuery(event);

    //
    // if (!userId && secretPin != useRuntimeConfig().APP_SECRET_PIN) {
    //     throw createError({
    //         statusCode: 401,
    //         statusMessage: 'Unauthorized secret PIN is not valid',
    //     })
    // }

    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    // @ts-ignore getQuery convert the params to be string
    return deleteTransaction(id, userId)
})
