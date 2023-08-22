import {deleteAsset} from "~/server/models/assets";

export default defineEventHandler((event) => {
    const {id} = getQuery(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    // @ts-ignore getQuery convert the params to be string
    return deleteAsset(id, userId)
})
