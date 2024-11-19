import { updateSubscription } from "~/server/models/subscription";

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
        
    const { name, cost, billingCycle, nextPaymentDate, category, currency } = await readBody(event);

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'Subscription ID is required'
        });
    }

    return updateSubscription(
        id,
        name,
        cost,
        billingCycle,
        nextPaymentDate,
        category,
        currency
    );
});
