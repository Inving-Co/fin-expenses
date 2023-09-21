import {archiveAsset} from "../../models/assets";

export default defineEventHandler(async (event) => {
    const { id } = getQuery(event)

    return archiveAsset(id as string)
})
