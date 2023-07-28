import {prisma} from "~/server/models/prisma";

export async function getCategories(key: string) {
    const result = await prisma.categories.findMany({
        where: {
            name: {
                contains: key?.toLowerCase()
            }
        },
    })

    for(let i = 0; i < result.length; i++) {
        // need for initial load data is checked
        // @ts-ignore
        result[i].checked = true;
    }

    return result
}
