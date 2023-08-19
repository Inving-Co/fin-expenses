import { LogSnag } from 'logsnag';

const logsnag = new LogSnag({
    token: useRuntimeConfig().public.LOGSNAG_TOKEN,
    project: useRuntimeConfig().public.APP_ID,
})

export async function eventUserRegister(uid: string, email: string) {
    await logsnag.publish({
        channel: "user-register",
        event: "User Registered",
        description: `email: ${email}`,
        icon: "🔥",
        notify: true,
        tags: {
            email: email,
            uid: uid,
        }
    })
}

export async function eventFirstTrxCreated(uid: string, email: string, trxId: string) {
    await logsnag.publish({
        channel: "first-transactions",
        event: "First Transactions",
        description: `email: ${email}`,
        icon: "🔥",
        notify: true,
        tags: {
            uid: uid,
            trxId: trxId,
        }
    })
}
