import {prisma} from "~/server/models/prisma";

export function createAsset(name: string, amount: number, estimatedReturnAmount: number | undefined, estimatedReturnDate: string | undefined, color: string | undefined, type: string | undefined, platform: string | undefined, userId: string | undefined, circleId: string | undefined, isAutoRefresh: boolean | undefined) {
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
            isAutoRefresh
        },
        include: {
            assetHistory: true,
        }
    });
}

export function updateAsset(assetId: string, name: string, amount: number, estimatedReturnAmount: number | undefined, estimatedReturnDate: string | undefined, color: string | undefined, type: string | undefined, platform: string | undefined, isAutoRefresh: boolean | undefined) {
    return prisma.assets.update({
        where: {id: assetId}, data: {
            name,
            amount,
            estimatedReturnAmount,
            estimatedReturnDate,
            type,
            platform,
            color,
            isAutoRefresh
        }
    })
}

export function deleteAsset(assetId: string, userId: string | undefined) {
    return prisma.assets.delete({where: {id: assetId, userId}})
}

export function archiveAsset(assetId: string) {
    return prisma.assets.update({
        where: {id: assetId}, data: {
            archivedAt: new Date()
        }
    })
}

export function getAssets(key: string, circleId: string | undefined) {
    return prisma.assets.findMany({
        where: {
            name: {
                contains: key?.toLowerCase(),
            },
            circleId: circleId,
            archivedAt: null
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

export async function summaryOfAssets(circleId: string | undefined) {
    const value = await prisma.assets.aggregate({
        where: {
            circleId: circleId,
        },
        _sum: {
            amount: true,
        }
    })

    const results = await prisma.assets.findMany({
        where: {
            circleId: circleId,
        },
    })

    let estimatedReturnAmount = 0

    for (const result of results) {
        if (!result.estimatedReturnAmount) {
            estimatedReturnAmount += result.amount;
        } else {
            estimatedReturnAmount += result.estimatedReturnAmount;
        }
    }

    return {
        _sum: {
            amount: value._sum.amount,
            estimatedReturnAmount: estimatedReturnAmount
        }
    }
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

export function getAssetHistory(assetId: string, circleId: string | undefined) {
    return prisma.assetHistory.findMany({
        where: {
            assetId,
            circleId
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

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
                if (record.category.type === 'income' || record.category.type === 'receive') increasedAmount += record.amount
                else decreasedAmount += record.amount

                await tx.bulkRecords.create({
                    data: {
                        assetHistoryId: resultAssetHistory?.id,
                        recordId: record.id
                    }
                })

            }

            await prisma.assets.update({
                where: {id: assetId},
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

export async function transferAmountAsset(userId: string, originAssetId: string, destinationAssetId: string, amount: number, charge: number | undefined) {
    return prisma.$transaction(
        async (tx) => {
            const originAsset = await tx.assets.findUnique({
                where: {
                    id: originAssetId,
                },
            });

            if (!originAsset) throw new Error("Origin asset not found");

            const destinationAsset = await tx.assets.findUnique({
                where: {
                    id: destinationAssetId,
                },
            });

            if (!destinationAsset) throw new Error("Destination asset not found");

            const transferAmount = amount;

            if (transferAmount > originAsset.amount) throw new Error("Insufficient funds in origin asset");

            const transferCategory = await tx.categories.findFirst({
                where: {
                    name: 'transfer'
                },
                select: {
                    id: true
                }
            });

            const receiveCategory = await tx.categories.findFirst({
                where: {
                    name: 'receive'
                },
                select: {
                    id: true
                }
            });


            await tx.records.create({
                data: {
                    assetId: originAssetId,
                    description: `Transfer from ${originAsset.name} to ${destinationAsset.name}`,
                    amount: transferAmount,
                    categoryId: transferCategory!.id,
                    date: new Date(),
                    userId: userId,
                    circleId: originAsset.circleId,
                }
            });


            await tx.records.create({
                data: {
                    assetId: destinationAssetId,
                    description: `Receive from ${destinationAsset.name} to ${originAsset.name}`,
                    amount: transferAmount,
                    categoryId: receiveCategory!.id,
                    date: new Date(),
                    userId: userId,
                    circleId: destinationAsset.circleId,
                }
            });

            if (charge)
                await tx.records.create({
                    data: {
                        assetId: originAssetId,
                        description: `Charge transfer from ${originAsset.name} to ${destinationAsset.name}`,
                        amount: charge,
                        categoryId: '5b4075ec-7af5-4bb1-9bd4-fc3f899c180a',
                        date: new Date(),
                        userId: userId,
                        circleId: originAsset.circleId,
                    }
                });

            await tx.assetHistory.create({
                data: {
                    assetId: originAssetId,
                    actionName: 'TRANSFER',
                    name: originAsset.name,
                    amount: transferAmount,
                    estimatedReturnAmount: originAsset.estimatedReturnAmount,
                    estimatedReturnDate: originAsset.estimatedReturnDate,
                    type: originAsset.type,
                    platform: originAsset.platform,
                    color: originAsset.color,
                    circleId: originAsset.circleId,
                    userId: originAsset.userId,
                }
            });

            await tx.assetHistory.create({
                data: {
                    assetId: destinationAssetId,
                    actionName: 'RECEIVE',
                    name: destinationAsset.name,
                    amount: transferAmount,
                    estimatedReturnAmount: destinationAsset.estimatedReturnAmount,
                    estimatedReturnDate: destinationAsset.estimatedReturnDate,
                    type: destinationAsset.type,
                    platform: destinationAsset.platform,
                    color: destinationAsset.color,
                    circleId: destinationAsset.circleId,
                    userId: destinationAsset.userId,
                }
            });
        }
    )
}
