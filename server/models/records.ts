import { format } from 'date-fns';
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

    let trx = await prisma.records.findFirst({where: {id: trxId}})

    if (trx && trx.circleId && userId) {

        let circleUser = await prisma.circleUsers.findFirst({where: {circleId: trx.circleId!, userId}})

        if(!circleUser) {
            return null
        }
    }

    return prisma.records.delete({where: {id: trxId}})
}

export async function getCountRecords(circleId: string | undefined) {
    return prisma.records.count({
        where: {
            circleId: circleId ?? null
        }
    })
}

export async function getRecords(key: string, dateFilter: { start: string, end: string } | undefined, circleId: string | undefined, categoryIds: string[] | undefined, assetId: string | undefined) {
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
            },
            assetId
        },
        orderBy: {
            date: 'desc'
        },
        include: {
            category: true
        }
    })
}

export async function getRecordsForExport(circleId: string | undefined) {
    const result = await prisma.records.findMany({
        select: {
            description: true,
            amount: true,
            date: true,
            category: {
                select: {
                    name: true
                },
            }
        },
        where: {
            circleId: circleId ?? null,
        },
        orderBy: {
            date: 'desc'
        }
    })

    const flatResult = result.map(record => ({
        categoryName: record.category.name,
        description: record.description,
        amount: record.amount,
        date: format(new Date(record.date), 'dd/MM/yyyy'),
    }));
    
    return flatResult;

}

export async function getRecordsForChat(key: string, dateFilter: { start: string, end: string } | undefined, circleId: string | undefined) {
    let result = await prisma.records.findMany({
        select: {
            description: true, amount: true, date: true, category: true, createdAt: true, currency: true
        },
        where: {
            description: {
                contains: key?.toLowerCase()
            },
            date: dateFilter ? {
                gte: new Date(dateFilter.start),
                lte: new Date(dateFilter.end),
            } : undefined,
            circleId: circleId ?? null,
        },
        orderBy: {
            date: 'desc'
        },
    })

    return result
}

export async function createBulkRecord(assetHistoryId: string, recordId: string) {
    return prisma.bulkRecords.create({
        data: {
            assetHistoryId, recordId
        }
    });
}
