import {createCircle} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const {name, currency} = await readBody(event);

    try {
        const cookies = parseCookies(event)
        const userId = cookies['user-id']

        const result = await createCircle(name, currency, userId)

        return {
            status: 200,
            message: 'Success to create circle',
            data: result
        }
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Something went wrong',
            data: e,
        })
    } 
})
