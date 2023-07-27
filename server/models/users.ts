import {prisma} from "~/server/models/prisma";

export async function createUser(email: string) {
    return prisma.users.create({
        data: {
            email
        }
    });
}
