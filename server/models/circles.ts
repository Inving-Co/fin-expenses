import {prisma} from "~/server/models/prisma";

export async function createCircle(name: string, currency: string, userId: string | undefined) {
    return prisma.$transaction(
        async (tx) => {
            const resultCircleSettings = await tx.circleSettings.create({})

            const resultCircle = await tx.circles.create({
                data: {
                    name, currency, userId, circleSettingId: resultCircleSettings.id
                },
            });

            if (!resultCircle) throw new Error("Result circle not found");

            await tx.circleUsers.create({
                data: {
                    userId, circleId: resultCircle.id, receiveReport: userId !== undefined
                }
            })
        },
        {
            maxWait: 5000,
            timeout: 10000,
        },
    )
}

export async function getCircle(circleId: string | undefined) {
    return prisma.circles.findUnique({
        where: {
            id: circleId
        },
        include: {
            circleUsers: {
                include: {
                    user: true
                }
            },
            assets: true,
            circleSettings: true
        }
    })
}

export async function getCircles(key: string, userId: string | undefined) {
    return prisma.circles.findMany({
        where: {
            AND: {
                name: {
                    contains: key?.toLowerCase()
                },
                userId: {
                    equals: userId ?? null,
                },
            }
        },
        include: {
            circleUsers: true
        }
    })
}

export async function getCircleUsers(key: string, userId: string | undefined) {
    return prisma.circleUsers.findMany({
        where: {
            AND: {
                circle: {
                    name: {
                        contains: key?.toLowerCase()
                    },
                },
                userId: {
                    equals: userId ?? null,
                },
            }
        },
        include: {
            circle: true
        }
    })
}

export async function createCircleUser(userId: string | undefined, circleId: string) {
    return prisma.circleUsers.create({
        data: {
            userId, circleId, receiveReport: userId !== undefined
        }
    })
}


export async function updateCircleUser(circleUserId: string, receiveReport: boolean) {
    return prisma.circleUsers.update({where: {id: circleUserId}, data: { receiveReport }})
}

export async function updateCircleSettings(circleSettingId: string, defaultAssetId: string | undefined) {
    return prisma.circleSettings.update({where: {id: circleSettingId}, data: { defaultAssetId }})
}
