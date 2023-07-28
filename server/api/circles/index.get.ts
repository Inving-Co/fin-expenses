import {getCircles} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const {key} = await getQuery(event)

    const cookies = parseCookies(event)
    const userId =  +cookies['user-id'] as number | undefined

    return getCircles(key as string, userId)
})
