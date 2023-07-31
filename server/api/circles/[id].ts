import {getCircle} from "~/server/models/circles";

export default defineEventHandler((event) => {
    const circleId = event.context.params?.id

    return getCircle(circleId)
})
