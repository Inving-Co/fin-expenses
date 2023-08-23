import { prisma } from "~/server/models/prisma";

export function createAsset(name: string, amount: number, estimatedReturnAmount: number | undefined, estimatedReturnDate: string | undefined, color: string | undefined, type: string | undefined, platform: string | undefined, userId: string | undefined, circleId: string | undefined) {
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
        },
        include: {
            assetHistory: true,
        }
    });
}

export function updateAsset(assetId: string, name: string, amount: number, estimatedReturnAmount: number | undefined, estimatedReturnDate: string | undefined, color: string | undefined, type: string | undefined, platform: string | undefined) {
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

export function deleteAsset(assetId: string, userId: string | undefined) {
    return prisma.assets.delete({ where: { id: assetId, userId } })
}

export function getAssets(key: string, circleId: string | undefined) {
    return prisma.assets.findMany({
        where: {
            name: {
                contains: key?.toLowerCase(),
            },
            circleId: circleId,
        },
        include: {
            assetHistory: true,
        }
    })
}

export function createAssetHistory(assetId: string, name: string, amount: number, estimatedReturnAmount: number | undefined, estimatedReturnDate: string | undefined, color: string | undefined, type: string | undefined, platform: string | undefined, userId: string | undefined, circleId: string | undefined) {
    return prisma.assetHistory.create({
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
            assetId,
        }
    });
}

export function updateAssetHistory(assetHistoryId: string, name: string, amount: number, estimatedReturnAmount: number | undefined, estimatedReturnDate: string | undefined, color: string | undefined, type: string | undefined, platform: string | undefined) {
    return prisma.assets.update({
        where: { id: assetHistoryId }, data: {
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

export function deleteAssetHistory(assetId: string, userId: string | undefined) {
    return prisma.assetHistory.deleteMany({
        where: {
            assetId: assetId,
            userId,
        }
    })
}