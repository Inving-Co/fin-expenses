import {getCategories} from "~/server/models/categories";

export default defineEventHandler(async (event) => {
    const { key } = await getQuery(event)

    return getCategories(key as string)
})
