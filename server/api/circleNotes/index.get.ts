import {getNotes} from "~/server/models/notes";

export default defineEventHandler((event) => {
    const {key} = getQuery(event)

    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    return getNotes(key as string, circle?.id)
})
