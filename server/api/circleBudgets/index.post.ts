import {createBudget, createOrUpdateBudget} from "~/server/models/bugets";

export default defineEventHandler(async (event) => {
    const {amount, windowTime} = await readBody(event);

    try {
        const cookies = parseCookies(event)
        const userId = cookies['user-id']
        const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

        const result = await createOrUpdateBudget(amount as number, userId, circle?.id, windowTime)

        return {
            status: 200,
            message: 'Success to save budget',
            data: result
        }
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Something went wrong',
            data: e,
        })
    }
})
