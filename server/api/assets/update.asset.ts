import {createAssetHistory, updateAsset, } from "~/server/models/assets";

export default defineEventHandler(async (event) => {
    const {id, name, amount, estimatedReturnAmount, estimatedReturnDate, color, type, platform, isAutoRefresh} = await readBody(event);

    try {
        const resultAsset = await updateAsset(id, String(name).toLowerCase(), Number(amount), Number(estimatedReturnAmount), estimatedReturnDate, color, type, String(platform).toLowerCase(), isAutoRefresh);

        await createAssetHistory(resultAsset.id, 'UPDATE', String(name).toLowerCase(), Number(amount), Number(estimatedReturnAmount), estimatedReturnDate, color, type, String(platform).toLowerCase(), resultAsset.userId!, resultAsset.circleId!)

        return {
            status: 200,
            message: 'Success to update asset',
            data: resultAsset
        }
    } catch (e) {
        throw createError({
            status: 400,
            message: 'Something went wrong',
            data: e,
        })
    } 
})
