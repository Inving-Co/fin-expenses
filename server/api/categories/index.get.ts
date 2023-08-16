import {getCategories} from "~/server/models/categories";

export default defineEventHandler(async (event) => {
    const { key, selectedCircleId } = getQuery(event)

    return getCategories(key as string, selectedCircleId as string | undefined)
})
