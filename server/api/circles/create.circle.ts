import {createCircle} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const {name} = await readBody(event);


    const cookies = parseCookies(event)
    const userId =  cookies['user-id']

    return createCircle(name, +userId as number | undefined)
})
