import {getCategories} from "~/server/models/categories";
import { supabase } from "../../../utils/functions";

export default defineEventHandler(async (event) => {
    const { key } = getQuery(event)

    // const cookies = parseCookies(event)
    // const accessToken = cookies['my-access-tokena']
    // const result = await supabase.auth.getUser(accessToken)
    //
    // if(result.error) {
    //     throw new TypeError('Unauthenticated')
    // }

    return getCategories(key as string)
})
