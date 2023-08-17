import {getCircles} from "~/server/models/circles";

export default defineEventHandler((event) => {
    const {key} = getQuery(event)

    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    console.log(userId)

    return getCircles(key as string, userId)
})
