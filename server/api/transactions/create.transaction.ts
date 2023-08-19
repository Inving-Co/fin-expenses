import {createTransaction, getTransactions} from "~/server/models/transactions";
import {eventFirstTrxCreated} from "~/utils/logsnag";

export default defineEventHandler(async (event) => {
    const {date, description, amount, categoryId} = await readBody(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    let result = await createTransaction(date, description, Number(amount), categoryId, userId, circle?.id)
    let transactions = await getTransactions('', undefined, circle?.id, undefined)

    if(transactions.length === 1 && result.user) {
        await eventFirstTrxCreated(result.user!.id, result.user!.email, result.id, result.description)
    }

    return result
})
