import {createUser} from "~/server/models/users";
import {eventUserRegister} from "~/utils/logsnag";

export default defineEventHandler(async (event) => {
    const {id, email} = await readBody(event);

    let result = await createUser(id, email)

    await eventUserRegister(result.id, result.email)

    return result;
})
