import {updateCategory} from "~/server/models/categories";

export default defineEventHandler(async (event) => {
    const {id, name } = await readBody(event);

    return updateCategory(id, name)
})
