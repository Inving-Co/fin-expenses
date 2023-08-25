import {deleteAsset, deleteAssetHistory} from "~/server/models/assets";

export default defineEventHandler(async (event) => {
    const {id} = getQuery(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    try {

        // @ts-ignore getQuery convert the params to be string
        await deleteAssetHistory(id, userId)

        // @ts-ignore getQuery convert the params to be string
        const result = await deleteAsset(id, userId)
        return  {
            status: 200,
            message: 'Success to delete asset',
            data: result
        }
    } catch (e) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Something went wrong',
            data: e,
            
        })
    } 
})
