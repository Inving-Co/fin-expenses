import {prisma} from "~/server/models/prisma";

export async function getCategories(key: string) {
    return prisma.categories.findMany({
        where: {
            name: {
                contains: key?.toLowerCase()
            }
        },
    })
}
