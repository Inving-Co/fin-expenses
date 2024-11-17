import { removeFavoriteStock } from "~/server/models/stocks"

export default defineEventHandler(async (event) => {
    const symbol = event.context.params?.symbol
    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    if (event.method === 'DELETE') {
        try {
            await removeFavoriteStock(userId, symbol)
            return {
                status: 200,
                message: 'Success to remove favorite stock',
                data: { success: true }
            }
        } catch (e) {
            throw createError({
                status: 400,
                message: e?.message ?? 'Something went wrong',
                data: e,
            })
        }
    }

    throw createError({
        status: 405,
        message: 'Method not allowed',
    })
})
