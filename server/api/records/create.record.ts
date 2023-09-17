import { getAssetDetail, refreshAsset } from "~/server/models/assets";
import {createRecord, getCountRecords} from "../../models/records";
import {eventFirstTrxCreated} from "~/utils/logsnag";

export default defineEventHandler(async (event) => {
    const {date, description, amount, currency, categoryId, assetId} = await readBody(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    let result = await createRecord(date, description, Number(amount), currency, categoryId, userId, circle?.id, assetId)
    let countRecords = await getCountRecords(circle?.id)

    if (assetId) {
        let asset = await getAssetDetail(assetId)

        if (asset?.isAutoRefresh) {
            refreshAsset(assetId)
        }
    }

    if (countRecords === 1 && result.user) {
        await eventFirstTrxCreated(result.user!.id, result.user!.email, result.id, result.description)
    }

    return result
})
