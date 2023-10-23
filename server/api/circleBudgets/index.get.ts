import {getLatestBudget} from "~/server/models/bugets";

export default defineEventHandler(async (event) => {
    try {
        const cookies = parseCookies(event)
        const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

        return await getLatestBudget(circle?.id)
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Something went wrong',
            data: e,
        })
    }
})
