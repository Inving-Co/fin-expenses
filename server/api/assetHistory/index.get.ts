import { getAssetHistory } from '~/server/models/assets';

export default defineEventHandler(async (event) => {
    const { assetId } = getQuery(event)
    const cookies = parseCookies(event)
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    return getAssetHistory(assetId as string,  circle?.id as string | undefined)
})
