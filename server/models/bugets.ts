import {prisma} from "~/server/models/prisma";

export async function createBudget(amount: number, userId: string | undefined, circleId: string, windowTime: {start: string, end: string}) {
    return prisma.circleBudgets.create({
        data: {
            userId, circleId, amount,
            startedAt: windowTime.start,
            endedAt: windowTime.end
        }
    })
}
export async function createOrUpdateBudget(amount: number, userId: string | undefined, circleId: string, windowTime: {start: string, end: string}) {
    const today = new Date();
    const startDate = new Date(windowTime.start);
    const endDate = new Date(windowTime.end);

    // Check if today is within the windowTime
    if (today >= startDate && today <= endDate) {
        const existingBudget = await prisma.circleBudgets.findFirst({
            where: {
                circleId: circleId,
                endedAt: endDate
            }
        });

        if (existingBudget) {
            return prisma.circleBudgets.update({
                where: {
                    id: existingBudget.id
                },
                data: {
                    amount: amount,
                    startedAt: startDate,
                    endedAt: endDate
                }
            });
        }
        else {
            return prisma.circleBudgets.create({
                data: {
                    userId,
                    circleId,
                    amount,
                    startedAt: startDate,
                    endedAt: endDate
                }
            });
        }
    } else {
        throw new Error("Today's date is not within the window time. Operation not allowed.");
    }
}

export function getLatestBudget(circleId: string | undefined) {
    return prisma.circleBudgets.findFirst({
        where: {
            circleId: circleId,
            archivedAt: null
        },
        orderBy: {
            createdAt: 'desc'
        },
    })
}
