import {prisma} from "~/server/models/prisma";

export async function createBudgetPlannings(amount: number, userId: string | undefined, circleBudgetId: string, categoryId: string) {
    return prisma.circleBudgetPlannings.create({
        data: {
            userId, circleBudgetId, amount, categoryId
        }
    })
}

export async function createOrUpdateBudgetPlannings(amount: number, userId: string | undefined, circleBudgetId: string, categoryId: string) {
    const existingBudgetPlanning = await prisma.circleBudgetPlannings.findFirst({
        where: {
            circleBudgetId: circleBudgetId,
            categoryId: categoryId
        }
    });

    if (existingBudgetPlanning) {
        return prisma.circleBudgetPlannings.update({
            where: {
                id: existingBudgetPlanning.id
            },
            data: {
                amount: amount
            }
        });
    }
    else {
        return prisma.circleBudgetPlannings.create({
            data: {
                userId,
                circleBudgetId,
                amount,
                categoryId
            }
        });
    }
}

export function getBudgetPlannings(circleBudgetId: string | undefined) {
    return prisma.circleBudgetPlannings.findMany({
        where: {
            circleBudgetId: circleBudgetId ?? null,
            archivedAt: null
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: 'desc'
        },
    })
}
