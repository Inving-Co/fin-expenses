import { getAssets } from "../../models/assets";

export default defineEventHandler(async (event) => {
    const { key } = getQuery(event)
    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    return getAssets(key as string,  circle?.id as string | undefined)
})
