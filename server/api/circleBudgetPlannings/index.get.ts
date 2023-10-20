import { getBudgetPlannings } from "~/server/models/bugetPlannings";

export default defineEventHandler(async (event) => {
    const {circleBudgetId} = getQuery(event)
    try {

        return await getBudgetPlannings(circleBudgetId as string)
    } catch (e) {
        throw createError({
            status: 400,
            message: e?.message ?? 'Something went wrong',
            data: e,
        })
    }
})
