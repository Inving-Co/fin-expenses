import {getTransactions} from "~/server/models/transactions";

export default defineEventHandler((event) => {
    const {key, startDate, endDate, categoryIds} = getQuery(event)
    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined
    let proceedCategoryIds: string[] | undefined = []

    if (Array.isArray(categoryIds)) {
        proceedCategoryIds = categoryIds as string[] | undefined
    } else {
        proceedCategoryIds = categoryIds ? [categoryIds as string] : undefined
    }
console.log(circle)
    return getTransactions(key as string, {
        start: startDate as string,
        end: endDate as string
    }, circle?.id, proceedCategoryIds)
})
