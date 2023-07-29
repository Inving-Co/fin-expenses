import {getCategories} from "~/server/models/categories";

export default defineEventHandler((event) => {
    const { key } = getQuery(event)

    return getCategories(key as string)
})
