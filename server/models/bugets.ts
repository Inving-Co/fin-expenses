import {prisma} from "~/server/models/prisma";

export async function createBudget(amount: number, userId: string | undefined, circleId: string) {
    return prisma.circleBudgets.create({
        data: {
            userId, circleId, amount
        }
    })
}

export function getBudgets(circleId: string | undefined) {
    return prisma.circleBudgets.findMany({
        where: {
            circleId: circleId,
            archivedAt: null
        },
        orderBy: {
            createdAt: 'desc'
        },
    })
}
