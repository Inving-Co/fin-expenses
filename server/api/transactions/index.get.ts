import {getTransactions} from "~/server/models/transactions";

export default defineEventHandler(async (event) => {
    const {key, startDate, endDate, categoryIds} = await getQuery(event)
    const cookies = parseCookies(event)
    const userId = Number(cookies['user-id'])
    let proceedCategoryIds: number[] | undefined = []

    if (Array.isArray(categoryIds)) {
        proceedCategoryIds = (categoryIds as string[] | undefined)?.map((val: string) => Number(val)) as number[] || undefined
    } else {
        proceedCategoryIds = categoryIds ? [Number(categoryIds)] : undefined
    }

    return getTransactions(key as string, {
        start: startDate as string,
        end: endDate as string
    }, userId, proceedCategoryIds)
})
