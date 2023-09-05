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
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            assetHistory: true,
        }
    })
}

export function getAssetDetail(assetId: string) {
    return prisma.assets.findUnique({
        where: {
            id: assetId,
        },
        include: {
            assetHistory: true,
        },
    });
}

export function summaryOfAssets(circleId: string | undefined) {
    return prisma.assets.aggregate({
        where: {
            circleId: circleId,
        },
        _sum: {
            amount: true,
            estimatedReturnAmount: true,
        }
    })
}

export function createAssetHistory(assetId: string, actionName: string, name: string, amount: number, estimatedReturnAmount: number | undefined, estimatedReturnDate: string | undefined, color: string | undefined, type: string | undefined, platform: string | undefined, userId: string | undefined, circleId: string | undefined) {
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
            actionName
        }
    });
}

export function deleteAssetHistory(assetId: string, userId: string | undefined) {
    return prisma.assetHistory.deleteMany({
        where: {
            assetId: assetId,
            userId,
        }
    })
}


export async function refreshAsset(assetId: string) {
    return prisma.$transaction(
        async (tx) => {
            const resultAsset = await tx.assets.findUnique({
                where: {
                    id: assetId,
                },
                include: {
                    assetHistory: true,
                },
            });

            if (!resultAsset) throw new Error("Result asset not found");

            const resultRecords = await tx.records.findMany({
                where: {
                    assetId,
                    createdAt: {
                        gte: resultAsset?.recordedAt
                    }
                },
                orderBy: {
                    date: 'desc'
                },
                include: {
                    category: true
                }
            })

            if (resultRecords.length === 0) throw new Error("Result record not found");
        
            const resultAssetHistory = await tx.assetHistory.create({
                data: {
                    assetId: assetId,
                    actionName: 'REFRESH',
                    name: resultAsset!.name,
                    amount: resultAsset!.amount,
                    estimatedReturnAmount: resultAsset?.estimatedReturnAmount,
                    estimatedReturnDate: resultAsset?.estimatedReturnDate,
                    type: resultAsset?.type,
                    platform: resultAsset?.platform,
                    color: resultAsset!.color,
                    circleId: resultAsset!.circleId,
                    userId: resultAsset!.userId,
                }
            })

            let decreasedAmount = 0
            let increasedAmount = 0
        
            for (const record of resultRecords) {
                if (record.category.type === 'income') increasedAmount += record.amount
                else decreasedAmount += record.amount

                await tx.bulkRecords.create({
                    data: {
                        assetHistoryId: resultAssetHistory?.id,
                        recordId: record.id
                    }
                })
                
            }

            await prisma.assets.update({
                where: { id: assetId },
                data: {
                    amount: resultAsset!.amount - decreasedAmount + increasedAmount,
                    recordedAt: new Date(),                    
                },
            });
            
        },
        {
            maxWait: 5000,
            timeout: 10000,
        }
    )
}