import { getUpcomingPayments } from '~/server/models/subscription'

export default defineEventHandler(async (event) => {
    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    const query = getQuery(event)
    const { daysAhead } = query

    return getUpcomingPayments(
        circle?.id,
        daysAhead ? parseInt(daysAhead as string) : undefined
    )
})
