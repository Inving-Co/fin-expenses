export default defineEventHandler(async (event) => {
    const { query } = getQuery(event)

    try {
        const response = await fetch(
            `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${useRuntimeConfig().ALPHA_VANTAGE_API_KEY}`
        )
        
        const data = await response.json()
        
        return (data.bestMatches || []).map(match => ({
            symbol: match['1. symbol'],
            name: match['2. name'],
            type: match['3. type'],
            region: match['4. region'],
            marketOpen: match['5. marketOpen'],
            marketClose: match['6. marketClose'],
            timezone: match['7. timezone'],
            currency: match['8. currency'],
            matchScore: match['9. matchScore']
        }))
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Failed to search stocks',
            data: e,
        })
    }
})
