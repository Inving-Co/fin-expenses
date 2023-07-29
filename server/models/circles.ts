import {prisma} from "~/server/models/prisma";

export async function createCircle(name: string, userId: string | undefined) {
    return prisma.circles.create({
        data: {
            name, userId
        }
    });
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
