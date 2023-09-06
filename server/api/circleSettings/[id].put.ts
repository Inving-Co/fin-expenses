import {updateCircleSettings} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const circleSettingId = event.context.params?.id
    const {defaultAssetId} = await readBody(event);

    return updateCircleSettings(circleSettingId as string, defaultAssetId)
})
