import { getFavoriteStocks, addFavoriteStock } from "~/server/models/stocks"

export default defineEventHandler(async (event) => {
    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    if (event.method === 'GET') {
        return getFavoriteStocks(userId)
    }

    if (event.method === 'POST') {
        const { symbol } = await readBody(event)
        
        try {
            const result = await addFavoriteStock(userId, symbol)
            return {
                status: 200,
                message: 'Success to add favorite stock',
                data: result
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
