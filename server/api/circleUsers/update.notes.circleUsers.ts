import {updateNotesCircleUser} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const {id, notes } = await readBody(event);

    return updateNotesCircleUser(id, notes)
})
