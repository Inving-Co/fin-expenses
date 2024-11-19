import { $fetch } from 'ofetch'

export default defineEventHandler(async (event) => {
    try {
        const response = await $fetch('https://api.vatcomply.com/rates')
        return response
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch currency rates'
        })
    }
})
