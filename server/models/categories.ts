import {prisma} from "~/server/models/prisma";

export async function createCategory(name: string, color: string | undefined, type: string | undefined, userId: string | undefined, circleId: string | undefined) {
    return prisma.categories.create({
        data: {
            name,
            color,
            type,
            circleId,
            userId
        }
    });
}

export async function updateCategory(categoryId: string, name: string) {
    return prisma.categories.update({where: {id: categoryId}, data: { name }})
}

export async function deleteCategory(categoryId: string, userId: string | undefined) {
    return prisma.categories.delete({where: {id: categoryId, userId}})
}

export async function getCategories(key: string, circleId: string | undefined) {
    const result = await prisma.categories.findMany({
        where: {
            AND: [
                {
                    name: {
                        contains: key?.toLowerCase()
                    },
                },
                {
                    OR: [
                        {
                            type: null,
                        },
                        {
                            NOT: [
                                { type: 'transfer' },
                                { type: 'receive' }
                            ]
                        }
                    ],
                },
                {
                    OR: [
                        {
                            circleId: circleId,
                        },
                        {
                            circleId: null,
                        }
                    ]
                }
            ]
        },
    })

    for (let i = 0; i < result.length; i++) {
        // need for initial load data is checked
        // @ts-ignore
        result[i].checked = false;
    }

    return result
}
