import {transferAmountAsset} from "../../models/assets";

export default defineEventHandler(async (event) => {
    const { originAssetId, destinationAssetId, amount } = await readBody(event)


    try {

        const result = await transferAmountAsset(String(originAssetId), String(destinationAssetId), Number(amount))

        return {
            status: 200,
            message: 'Success to transfer asset',
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
