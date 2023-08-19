import {prisma} from './prisma'

export async function createTransaction(date: string, description: string, amount: number, categoryId: string, userId: string | undefined, circleId: string | undefined) {
    return prisma.transactions.create({
        data: {
            amount,
            date,
            description: description.toLowerCase(),
            categoryId,
            userId,
            circleId
        },
        include: {
            user: true
        }
    });
}

export async function updateTransaction(trxId: string, description: string, amount: number, date: string, categoryId: string) {
    return prisma.transactions.update({where: {id: trxId}, data: { description, amount, date, categoryId }})
}

export async function deleteTransaction(trxId: string, userId: string | undefined) {
    return prisma.transactions.delete({where: {id: trxId, userId}})
}

export async function getTransactions(key: string, dateFilter: { start: string, end: string }, circleId: string | undefined, categoryIds: string[] | undefined) {
    return prisma.transactions.findMany({
        where: {
            description: {
                contains: key?.toLowerCase()
            },
            date: {
                gte: new Date(dateFilter.start),
                lte: new Date(dateFilter.end),
            },
            circleId: circleId ?? null,
            categoryId: {
                in: categoryIds ?? []
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
