import { getAssets } from "../../models/assets";

export default defineEventHandler(async (event) => {
    const { key, selectedCircleId } = getQuery(event)

    return getAssets(key as string, selectedCircleId as string | undefined)
})
