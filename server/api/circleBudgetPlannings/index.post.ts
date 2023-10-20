import {createBudgetPlannings, createOrUpdateBudgetPlannings} from "~/server/models/bugetPlannings";

export default defineEventHandler(async (event) => {
    const {amount, categoryId, circleBudgetId} = await readBody(event);

    try {
        const cookies = parseCookies(event)
        const userId = cookies['user-id']

        const result = await createOrUpdateBudgetPlannings(amount as number, userId, circleBudgetId, categoryId)

        return {
            status: 200,
            message: 'Success to create budget plan',
            data: result
        }
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Something went wrong',
            data: e,
        })
    }
})
