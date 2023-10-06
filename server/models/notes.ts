import {prisma} from "~/server/models/prisma";

export async function createCircleNotes(title: string, notes: string | null | undefined, userId: string | undefined, circleId: string) {
    return prisma.circleNotes.create({
        data: {
            userId, circleId, title, notes
        }
    })
}

export async function getNotes(key: string, circleId: string | undefined) {
    return prisma.circleNotes.findMany({
        where: {
            AND: {
                title: {
                    contains: key?.toLowerCase()
                },
                circleId: {
                    equals: circleId ?? null
                },
                archivedAt: null
            }
        },
    })
}

export async function archiveNotes(circleNoteId: string, circleId: string) {
    return prisma.circleNotes.update({
        where: { id: circleNoteId, circleId: circleId },
        data: { archivedAt: new Date() }
    })
}
