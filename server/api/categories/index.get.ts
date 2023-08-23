import {getCategories} from "~/server/models/categories";

export default defineEventHandler(async (event) => {
    const { key } = getQuery(event)
    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    return getCategories(key as string, circle?.id as string | undefined)
})
