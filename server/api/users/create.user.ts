import {createUser} from "~/server/models/users";

export default defineEventHandler(async (event) => {
    const {email} = await readBody(event);

    return createUser(email)
})
