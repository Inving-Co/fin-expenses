import {updateAsset} from "~/server/models/assets";

export default defineEventHandler(async (event) => {
    const {id, name, amount, estimatedReturnAmount, estimatedReturnDate, color, type, platform} = await readBody(event);

    return updateAsset(id, name, amount, estimatedReturnAmount, estimatedReturnDate, color, type, platform);
})
