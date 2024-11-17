export default defineEventHandler(async (event) => {
    try {
        const response = await fetch(
            `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${useRuntimeConfig().ALPHA_VANTAGE_API_KEY}`
        )

        const data = await response.json()

        console.log(data)
        
        return [...(data.top_gainers || []), ...(data.top_losers || [])]
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Failed to fetch stock data',
            data: e,
        })
    }
})
