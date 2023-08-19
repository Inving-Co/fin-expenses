import {createTransaction, getTransactions} from "~/server/models/transactions";
import {eventFirstTrxCreated} from "~/utils/logsnag";

export default defineEventHandler(async (event) => {
    const {date, description, amount, categoryId} = await readBody(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    return createTransaction(date, description, Number(amount), categoryId, userId, circle?.id)
})
