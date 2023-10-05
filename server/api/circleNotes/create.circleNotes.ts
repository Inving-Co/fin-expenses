import {getCircleUser} from "~/server/models/circles";
import {createCircleNotes} from "~/server/models/notes";

export default defineEventHandler(async (event) => {
    const {title, circleUserId} = await readBody(event);

    try {
        const cookies = parseCookies(event)
        const userId = cookies['user-id']
        const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

        const circleUser = await getCircleUser(userId, circleUserId)
        const result = await createCircleNotes(title, circleUser?.notes, userId, circle?.id)

        return {
            status: 200,
            message: 'Success to save notes',
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
