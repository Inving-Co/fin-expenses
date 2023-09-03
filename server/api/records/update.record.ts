import {updateRecord} from "../../models/records";

export default defineEventHandler(async (event) => {
    const {id, description, amount, date, categoryId, secretPin } = await readBody(event);

    // if(secretPin != useRuntimeConfig().APP_SECRET_PIN) {
    //     throw createError({
    //         statusCode: 401,
    //         statusMessage: 'Unauthorized secret PIN is not valid',
    //     })
    // }

    return updateRecord(id, description, amount, date, categoryId)
})
