import {prisma} from './prisma'

export async function createRecord(date: string, description: string, amount: number, currency: string, categoryId: string, userId: string | undefined, circleId: string | undefined, assetId: string | undefined) {
    return prisma.records.create({
        data: {
            amount,
            date,
            currency,
            description: description.toLowerCase(),
            categoryId,
            userId,
            circleId,
            assetId
        },
        include: {
            user: true
        }
    });
}

export async function updateRecord(trxId: string, description: string, amount: number, date: string, categoryId: string) {
    return prisma.records.update({where: {id: trxId}, data: {description, amount, date, categoryId}})
}

export async function deleteRecord(trxId: string, userId: string | undefined) {
    return prisma.records.delete({where: {id: trxId, userId}})
}

export async function getRecords(key: string, dateFilter: { start: string, end: string } | undefined, circleId: string | undefined, categoryIds: string[] | undefined) {
    return prisma.records.findMany({
        where: {
            description: {
                contains: key?.toLowerCase()
            },
            date: dateFilter ? {
                gte: new Date(dateFilter.start),
                lte: new Date(dateFilter.end),
            } : undefined,
            circleId: circleId ?? null,
            categoryId: {
                in: categoryIds
            }
        },
        orderBy: {
            date: 'desc'
        },
        include: {
            category: true
        }
    })
}


export async function createBulkRecord(assetHistoryId: string, recordId: string) {
    return prisma.bulkRecords.create({
        data: {
            assetHistoryId, recordId
        }
    });
}
