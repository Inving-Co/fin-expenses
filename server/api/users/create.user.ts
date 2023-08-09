import {createUser} from "~/server/models/users";

export default defineEventHandler(async (event) => {
    const {id, email} = await readBody(event);

    return createUser(id, email)
})
