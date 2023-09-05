import { refreshAsset } from "~/server/models/assets";

export default defineEventHandler(async (event) => {
    const { id } = getQuery(event)

    try {
        const assetId = id as string;

        const result = await refreshAsset(assetId)

        return {
            status: 200,
            message: 'Success to refresh asset',
            data: result
        }
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Something went wrong',
            data: e,
        })
    } 
})
