import {createCircleUser} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const {circleId} = await readBody(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    return createCircleUser(userId, circleId)
})
