export default defineEventHandler(async (event) => {
    const { symbols } = getQuery(event)

    try {
        const response = await fetch(
            `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${symbols}&apikey=${useRuntimeConfig().ALPHA_VANTAGE_API_KEY}`
        )

        const data = await response.json()
        
        return data
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Failed to fetch stock quotes',
            data: e,
        })
    }
})
