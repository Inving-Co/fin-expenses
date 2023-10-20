import {prisma} from "~/server/models/prisma";

export async function createBudget(amount: number, userId: string | undefined, circleId: string) {
    return prisma.circleBudgets.create({
        data: {
            userId, circleId, amount
        }
    })
}

export async function createOrUpdateBudget(amount: number, userId: string | undefined, circleId: string) {
    const existingBudget = await prisma.circleBudgets.findFirst({
        where: {
            userId: userId,
            circleId: circleId
        }
    });

    if (existingBudget) {
        return prisma.circleBudgets.update({
            where: {
                id: existingBudget.id
            },
            data: {
                amount: amount
            }
        });
    }
    else {
        return prisma.circleBudgets.create({
            data: {
                userId,
                circleId,
                amount
            }
        });
    }
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
