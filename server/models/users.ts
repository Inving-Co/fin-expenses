import {prisma} from "~/server/models/prisma";

export async function createUser(email: string) {
    return prisma.users.create({
        data: {
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