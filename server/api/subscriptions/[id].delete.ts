import { deleteSubscription } from "~/server/models/subscription";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const cookies = parseCookies(event);
    const userId = cookies['user-id'];

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Subscription ID is required'
        });
    }

    if (!userId) {
        throw createError({
            statusCode: 401,
            message: 'User ID is required'
        });
    }

    const result = await deleteSubscription(id, userId);
    
    if (!result) {
        throw createError({
            statusCode: 403,
            message: 'You do not have permission to delete this subscription'
        });
    }

    return result;
});
