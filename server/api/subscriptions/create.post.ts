import { createSubscription } from '~/server/models/subscription'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { name, cost, billingCycle, nextPaymentDate, category, currency } = body

    const cookies = parseCookies(event)
    const userId = cookies['user-id']
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    if (!name || !cost || !billingCycle || !nextPaymentDate || !category) {
        throw createError({
            statusCode: 400,
            message: 'Missing required fields'
        })
    }

    return createSubscription(
        name,
        cost,
        billingCycle,
        nextPaymentDate,
        category,
        userId,
        circle?.id,
        currency
    )
})
