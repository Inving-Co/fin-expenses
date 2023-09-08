import {getRecords} from "../../models/records";

export default defineEventHandler((event) => {
    const {key, startDate, endDate} = getQuery(event)
    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined
    const categoryIds = cookies[`${circle?.id}-current-filtered-categories-selected`] ? cookies[`${circle?.id}-current-filtered-categories-selected`].split(',') : undefined
    
    let proceedCategoryIds: string[] | undefined = []

    if (Array.isArray(categoryIds)) {
        proceedCategoryIds = categoryIds as string[] | undefined
    } else {
        proceedCategoryIds = categoryIds ? [categoryIds as string] : []
    }

    return getRecords(key as string, {
        start: startDate as string,
        end: endDate as string
    }, circle?.id, proceedCategoryIds, undefined)
})
