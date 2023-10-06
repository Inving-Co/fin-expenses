import {getCircleUser} from "~/server/models/circles";
import {createCircleNotes, updateCircleNotes} from "~/server/models/notes";

export default defineEventHandler(async (event) => {
    const {title, circleUserId} = await readBody(event);

    try {
        const cookies = parseCookies(event)
        const userId = cookies['user-id']
        const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

        const circleUser = await getCircleUser(userId, circleUserId)


        const result = circleUser?.activeNoteId ?
            await updateCircleNotes(circleUser?.activeNoteId, circle?.id, circleUser?.activeNote ?? '') :
            await createCircleNotes(title, circleUser?.activeNote, userId, circle?.id)

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
