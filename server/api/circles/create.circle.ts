import {createCircle} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const {name} = await readBody(event);

    const cookies = parseCookies(event)
    const userId =  +cookies['user-id'] as number | undefined

    return createCircle(name, userId)
})
