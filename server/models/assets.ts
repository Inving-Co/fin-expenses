import { prisma } from "~/server/models/prisma";

export async function createAsset(name: string, amount: number, estimatedReturnAmount: number | undefined, estimatedReturnDate: string | undefined, color: string | undefined, type: string | undefined, platform: string | undefined, userId: string | undefined, circleId: string | undefined) {
    return prisma.assets.create({
        data: {
            name,
            amount,
            estimatedReturnAmount,
            estimatedReturnDate,
            type,
            platform,
            color,
            circleId,
            userId,
        }
    });
}

export async function updateAsset(assetId: string, name: string, amount: number, estimatedReturnAmount: number | undefined, estimatedReturnDate: string | undefined, color: string | undefined, type: string | undefined, platform: string | undefined) {
    return prisma.assets.update({
        where: { id: assetId }, data: {
            name,
            amount,
            estimatedReturnAmount,
            estimatedReturnDate,
            type,
            platform,
            color,
        }
    })
}

export async function deleteAsset(assetId: string, userId: string | undefined) {
    return prisma.assets.delete({ where: { id: assetId, userId } })
}

export async function getAssets(key: string, circleId: string | undefined) {
    return await prisma.assets.findMany({
        where: {
            name: {
                contains: key?.toLowerCase(),
            },
            circleId: circleId,
            
        },
    })
}
