import {prisma} from "~/server/models/prisma";

export async function createUser(id: string, email: string) {
    return prisma.users.create({
        data: {
            id,
            email
        }
    });
}

export async function getDetailUser(id: string | undefined, email: string | undefined) {
    return prisma.users.findFirst({
        where: {
            id: {
                equals: id
            },
            email: {
                equals: email
            }
        },
        include: {
            circles: true
        }
    });
}
