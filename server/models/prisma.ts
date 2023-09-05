import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


export function dbTransactionsPrisma(callbackTransaction: (tx: any) => Promise<void>) {
    return prisma.$transaction(
        async (tx) => {
            await callbackTransaction(tx)
        },
        {
            maxWait: 5000,
            timeout: 10000,
        }
    )
}
