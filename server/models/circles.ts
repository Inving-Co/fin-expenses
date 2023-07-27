import {prisma} from "~/server/models/prisma";

export async function getCircles(key: string, userId: number | undefined) {
    return prisma.circles.findMany({
        where: {
            name: {
                contains: key?.toLowerCase()
            },
            userId: {
                equals: userId
            }
        },
    })
}
