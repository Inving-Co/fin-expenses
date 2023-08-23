import {createAsset} from "~/server/models/assets";
import {predefinedColors} from "~/utils/functions";

export default defineEventHandler(async (event) => {
    const {name, amount, estimatedReturnAmount, estimatedReturnDate, platform, type} = await readBody(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    const randColor = predefinedColors[Math.floor(Math.random() * predefinedColors.length)]

    const result = await createAsset(String(name).toLowerCase(), Number(amount), Number(estimatedReturnAmount), estimatedReturnDate, randColor, type, String(platform).toLowerCase(), userId, circle?.id);

    return result;

})
