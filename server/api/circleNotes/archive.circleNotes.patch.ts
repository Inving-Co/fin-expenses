import {getCircleUser} from "~/server/models/circles";
import {archiveNotes, createCircleNotes} from "~/server/models/notes";

export default defineEventHandler(async (event) => {
    const {circleNoteId} = getQuery(event)

    try {
        const cookies = parseCookies(event)
        const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

        const result = await archiveNotes(circleNoteId as string, circle.id)

        return {
            status: 200,
            message: 'Success to archive notes',
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
