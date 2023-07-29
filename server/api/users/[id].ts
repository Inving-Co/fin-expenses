import {getCircles} from "~/server/models/circles";
import {supabase} from "~/utils/functions";
import {getDetailUser} from "~/server/models/users";

export default defineEventHandler((event) => {
    const {id, email} = getQuery(event)

    return getDetailUser(id as string | undefined, email as string | undefined)
})
