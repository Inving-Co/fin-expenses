import { prisma } from "~/server/models/prisma"

export async function getFavoriteStocks(userId: string) {
    return prisma.stockFavorites.findMany({
        where: {
            userId
        }
    })
}

export async function addFavoriteStock(userId: string, symbol: string) {
    return prisma.stockFavorites.create({
        data: {
            userId,
            symbol
        }
    })
}

export async function removeFavoriteStock(userId: string, symbol: string) {
    return prisma.stockFavorites.delete({
        where: {
            userId_symbol: {
                userId,
                symbol
            }
        }
    })
}

export async function isFavoriteStock(userId: string, symbol: string) {
    const favorite = await prisma.stockFavorites.findUnique({
        where: {
            userId_symbol: {
                userId,
                symbol
            }
        }
    })
    return !!favorite
}
