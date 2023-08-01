import {getCircleUsers} from "~/server/models/circles";

export default defineEventHandler((event) => {
    const {key} = getQuery(event)

    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    return getCircleUsers(key as string, userId)
})
