import { createBudget } from "~/server/models/bugets";

export default defineEventHandler(async (event) => {
    const {amount} = await readBody(event);

    try {
        const cookies = parseCookies(event)
        const userId = cookies['user-id']
        const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

        const result = await createBudget(amount as number, userId, circle?.id)

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
