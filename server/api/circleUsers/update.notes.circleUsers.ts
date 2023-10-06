import {updateNotesCircleUser} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const {id, activeNote, activeNoteId} = await readBody(event);

    return updateNotesCircleUser(id, activeNote, activeNoteId)
})
