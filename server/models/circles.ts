import {prisma} from "~/server/models/prisma";

export async function createCircle(name: string, userId: string | undefined) {
    return prisma.circles.create({
        data: {
            name, userId
        }
    });
}

export async function getCircle(circleId: string | undefined) {
    return prisma.circles.findUnique({
        where: {
            id: circleId
        },
        include: {
            circleUsers: {
                include: {
                    user: true
                }
            }
        }
    })
}

export async function getCircles(key: string, userId: string | undefined) {
    return prisma.circles.findMany({
        where: {
            AND: {
                name: {
                    contains: key?.toLowerCase()
                },
                userId: {
                    equals: userId ?? null,
                }
            }
        },
    })
}

export async function createCircleUser(userId: string, circleId: string) {
    return prisma.circleUsers.create({
        data: {
            userId, circleId
        }
    })
}
