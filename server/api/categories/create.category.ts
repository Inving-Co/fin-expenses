import {createCircleUser} from "~/server/models/circles";
import {createCategory} from "~/server/models/categories";
import {predefinedColors} from "~/utils/functions";

export default defineEventHandler(async (event) => {
    const {name, type} = await readBody(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']
    const circle = cookies['selected-circle'] ? JSON.parse(cookies['selected-circle']) : undefined

    const randColor = predefinedColors[Math.floor(Math.random() * predefinedColors.length)]

    const result = await createCategory(name, randColor, type, userId, circle?.id)

    return result;

})
