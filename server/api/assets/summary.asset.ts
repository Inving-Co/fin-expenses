import {summaryOfAssets} from "../../models/assets";

export default defineEventHandler(async (event) => {
    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    return summaryOfAssets(circle?.id as string | undefined)
})
