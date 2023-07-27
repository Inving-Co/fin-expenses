import {getCircles} from "~/server/models/circles";
import {supabase} from "~/utils/functions";
import {getDetailUser} from "~/server/models/users";

export default defineEventHandler(async (event) => {
    const {id, email} = await getQuery(event)

    return getDetailUser(id as number | undefined, email as string | undefined)
})
