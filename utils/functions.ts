import {createClient} from "@supabase/supabase-js";
import {toast, ToastOptions} from "vue3-toastify";
import {navigateTo, useCookie} from "#app";

/// https://github.com/prisma/studio/issues/614#issuecomment-1374116622
declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function (): string {
    return this.toString();
};

export function base64url_decode(value: string): Uint8Array {
    const m = value.length % 4;
    return Uint8Array.from(atob(
        value.replace(/-/g, '+')
            .replace(/_/g, '/')
            .padEnd(value.length + (m === 0 ? 0 : 4 - m), '=')
    ), c => c.charCodeAt(0))
}

export function capitalizeFirstLetter(str: string | null | undefined): string {
    if (str === null || str === undefined) return ''
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export const currencyIDRFormatter = Intl.NumberFormat('ID', {
    style:'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
})

export const supabase = createClient('', '')

export async function onSignOut() {
    localStorage.clear()

    await supabase.auth.signOut()

    useCookie('user-id').value = undefined
    useCookie('selected-circle').value = undefined

    return navigateTo('/login')
}
