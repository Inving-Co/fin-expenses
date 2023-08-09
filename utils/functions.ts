import {createClient} from "@supabase/supabase-js";
import {toast, ToastOptions} from "vue3-toastify";
import {navigateTo, useCookie} from "#app";
import {Payload} from "~/supabase/functions/send-email";

/// https://github.com/prisma/studio/issues/614#issuecomment-1374116622
declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function (): string {
    return this.toString();
};


export const checkToken = async (jwt: string) => {

    const jwtParts = jwt.split(".");

    if (jwtParts.length !== 3) return;

    const textEncoder = (d: string) => new TextEncoder().encode(d)
    const textDecoder = (d: Uint8Array) => new TextDecoder().decode(d);

    const data = textEncoder(jwtParts[0] + '.' + jwtParts[1])
    const secretKey = useRuntimeConfig().public.APP_SECRET_KEY;

    const key = await crypto.subtle.importKey("raw", textEncoder(secretKey), {
        name: "HMAC",
        hash: "SHA-256"
    }, false, ["sign", "verify"]);


    if (await crypto.subtle.verify({name: "HMAC"}, key, base64url_decode(jwtParts[2]), data)) {
        return JSON.parse(textDecoder(base64url_decode(jwtParts[1])));
    }

    return
}

export const generateToken = async (data: any) => {
    const textEncoder=(d:string)=>new TextEncoder().encode(d)

    const secretKey = useRuntimeConfig().public.APP_SECRET_KEY
    const header={alg:'HS256', typ: 'JWT'}

    const encodedHeader=base64url_encode(textEncoder(JSON.stringify(header)));
    const encodedPayload=base64url_encode(textEncoder(JSON.stringify(data)));
    const oTkn=`${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey("raw", textEncoder(secretKey), {name:"HMAC", hash:"SHA-256"}, false, ["sign", "verify"]);
    const signature = base64url_encode(new Uint8Array(await crypto.subtle.sign({name:"HMAC"}, key, textEncoder(oTkn))))
    return `${oTkn}.${signature}`
}

function base64url_encode(buffer: ArrayBuffer): string {
    return btoa(Array.from(new Uint8Array(buffer), b => String.fromCharCode(b)).join(''))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

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

export const supabase = createClient('***REMOVED***', '***REMOVED***')

export async function onSignOut() {
    localStorage.clear()

    await supabase.auth.signOut()

    useCookie('user-id').value = undefined
    useCookie('selected-circle').value = undefined
    useCookie('access-token').value = undefined

    return navigateTo('/login')
}
