import {createAsset, createAssetHistory} from "~/server/models/assets";
import {predefinedColors} from "~/utils/functions";

export default defineEventHandler(async (event) => {
    const {name, amount, estimatedReturnAmount, estimatedReturnDate, platform, type} = await readBody(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    const randColor = predefinedColors[Math.floor(Math.random() * predefinedColors.length)]

    try {
        const resultAsset = await createAsset(String(name).toLowerCase(), Number(amount), Number(estimatedReturnAmount), estimatedReturnDate, randColor, type, platform !== undefined ? String(platform).toLowerCase():undefined, userId, circle?.id);
        
        await createAssetHistory(resultAsset.id, 'CREATE', String(name).toLowerCase(), Number(amount), Number(estimatedReturnAmount), estimatedReturnDate, randColor, type, String(platform).toLowerCase(), userId, circle?.id)

        return {
            status: 200,
            message: 'Success to add asset',
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
