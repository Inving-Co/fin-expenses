import { prisma } from './prisma'

export type SubscriptionCategory = 'streaming' | 'software' | 'utilities' | 'other'

export async function createSubscription(
    name: string,
    cost: number,
    billingCycle: 'monthly' | 'yearly',
    nextPaymentDate: string,
    category: SubscriptionCategory,
    userId: string,
    circleId?: string
) {
    return prisma.subscriptions.create({
        data: {
            name: name,
            cost,
            billingCycle,
            nextPaymentDate,
            category,
            userId,
            circleId
        },
        include: {
            user: true
        }
    });
}

export async function updateSubscription(
    id: string,
    name: string,
    cost: number,
    billingCycle: 'monthly' | 'yearly',
    nextPaymentDate: string,
    category: SubscriptionCategory
) {
    return prisma.subscriptions.update({
        where: { id },
        data: { name, cost, billingCycle, nextPaymentDate, category }
    });
}

export async function deleteSubscription(id: string, userId: string) {
    const subscription = await prisma.subscriptions.findFirst({ where: { id } });

    if (subscription && subscription.circleId) {
        const circleUser = await prisma.circleUsers.findFirst({
            where: { circleId: subscription.circleId, userId }
        });

        if (!circleUser) {
            return null;
        }
    }

    return prisma.subscriptions.delete({ where: { id } });
}

export async function getSubscriptions(
    circleId?: string,
    category?: SubscriptionCategory,
    sortBy?: 'cost' | 'name' | 'nextPaymentDate',
    sortOrder: 'asc' | 'desc' = 'asc'
) {
    return prisma.subscriptions.findMany({
        where: {
            circleId: circleId ?? null,
            ...(category && { category })
        },
        orderBy: sortBy ? { [sortBy]: sortOrder } : undefined,
        include: {
            user: true
        }
    });
}

export async function getUpcomingPayments(circleId?: string, daysAhead: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    return prisma.subscriptions.findMany({
        where: {
            circleId: circleId ?? null,
            nextPaymentDate: {
                lte: futureDate.toISOString()
            }
        },
        orderBy: {
            nextPaymentDate: 'asc'
        },
        include: {
            user: true
        }
    });
}

export async function getTotalSpending(circleId: string, period: 'monthly' | 'yearly') {
    const subscriptions = await prisma.subscriptions.findMany({
        where: { circleId }
    });

    return subscriptions.reduce((total, sub) => {
        const cost = sub.billingCycle === period ? 
            sub.cost : 
            (period === 'monthly' ? sub.cost / 12 : sub.cost * 12);
        return total + cost;
    }, 0);
}