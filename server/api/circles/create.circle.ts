import {createCircle, createCircleUser} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const {name} = await readBody(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    const result = await createCircle(name, userId)

    await createCircleUser(userId, result.id)

    return result;

})
