import {transferAmountAsset} from "../../models/assets";

export default defineEventHandler(async (event) => {
    const { originAssetId, destinationAssetId, amount, charge } = await readBody(event)

    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    try {

        const result = await transferAmountAsset(userId, String(originAssetId), String(destinationAssetId), Number(amount), charge ? Number(charge) : undefined)

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
