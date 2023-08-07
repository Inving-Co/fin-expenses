import {updateCircleUser} from "~/server/models/circles";

export default defineEventHandler(async (event) => {
    const {id, receiveReport } = await readBody(event);

    return updateCircleUser(id, receiveReport)
})
