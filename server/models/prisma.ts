import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate';

type ExtendedPrismaClient = PrismaClient | any;

const globalForPrisma = globalThis as unknown as {
    prisma: ExtendedPrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? (new PrismaClient() as ExtendedPrismaClient).$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma