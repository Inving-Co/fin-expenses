import { archiveCircle } from '~/server/models/circles'

export default defineEventHandler(async (event) => {
    const circleId = event.context.params?.id

    try {
        const cookies = parseCookies(event)
        const userId = cookies['user-id']
        
        if (!circleId) {
            throw new Error('Circle ID is required')
        }

        await archiveCircle(userId, circleId)

        return {
            status: 200,
            message: 'Success to delete circle',
        }
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Something went wrong',
            data: e,
        })
    } 
})
