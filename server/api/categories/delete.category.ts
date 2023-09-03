import {deleteCategory} from "~/server/models/categories";

export default defineEventHandler((event) => {
    const {id, secretPin} = getQuery(event);

    const cookies = parseCookies(event)
    const userId = cookies['user-id']

    // @ts-ignore getQuery convert the params to be string
    return deleteCategory(id, userId)
})
