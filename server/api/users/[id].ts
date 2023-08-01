import {getDetailUser} from "~/server/models/users";

export default defineEventHandler((event) => {
    const {id, email} = getQuery(event)

    return getDetailUser(id as string | undefined, email as string | undefined)
})
