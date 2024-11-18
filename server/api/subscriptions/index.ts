import { getSubscriptions, getTotalSpending } from '~/server/models/subscription'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const { category, sortBy, sortOrder, period } = query
    
    
    const cookies = parseCookies(event)
    const userId = cookies['user-id']
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    if (period) {
        return getTotalSpending(circle?.id, period as 'monthly' | 'yearly')
    }

    return getSubscriptions(
        circle?.id,
        category as any,
        sortBy as any,
        sortOrder as any
    )
})
