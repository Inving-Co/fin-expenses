import {prisma} from './prisma'

export async function createTransaction(date: string, description: string, amount: number, categoryId: number) {
    return prisma.transactions.create({
        data: {
            amount,
            date,
            description: description.toLowerCase(),
            categoryId
        }
    });
}

export async function updateTransaction(trxId: number, description: string, amount: number, date: string, categoryId: number) {
    return prisma.transactions.update({where: {id: trxId}, data: { description, amount, date, categoryId }})
}

export async function deleteTransaction(trxId: number) {
    return prisma.transactions.delete({where: {id: trxId}})
}

export async function getTransactions(key: string, dateFilter: { start: string, end: string }) {
    return prisma.transactions.findMany({
        where: {
            description: {
                contains: key?.toLowerCase()
            },
            date: {
                gte: new Date(dateFilter.start),
                lte: new Date(dateFilter.end),
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
