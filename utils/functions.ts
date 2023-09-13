import {createClient} from "@supabase/supabase-js";
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

export const predefinedColors = [
    'F9844A',
    'F3722C',
    '4D908E',
    'FFBF69',
    '90BE6D',
    'F8961E',
    '43AA8B',
    '277DA1',
    '457b9d',
    'FF9770',
    'F9C74F',
    'F94144',
    '233d4d',
    '577590'
]

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
    const textEncoder = (d: string) => new TextEncoder().encode(d)

    const secretKey = useRuntimeConfig().public.APP_SECRET_KEY
    const header = {alg: 'HS256', typ: 'JWT'}

    const encodedHeader = base64url_encode(textEncoder(JSON.stringify(header)));
    const encodedPayload = base64url_encode(textEncoder(JSON.stringify(data)));
    const oTkn = `${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey("raw", textEncoder(secretKey), {name: "HMAC", hash: "SHA-256"}, false, ["sign", "verify"]);
    const signature = base64url_encode(new Uint8Array(await crypto.subtle.sign({name: "HMAC"}, key, textEncoder(oTkn))))
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

export const getTimezone = () => {
    const timezone = new Date().getTimezoneOffset() / 60;
    return timezone;
};

export const currencyIDRFormatter = (currency: string | undefined | null, value:number) => {
    const formatted = Intl.NumberFormat('ID', {
        style: 'currency',
        currency: currency ?? 'IDR',
        maximumFractionDigits: currency == 'IDR' ? 0 : undefined
    }).format(value);

    const isAmountVisible = useAmountVisibility().value
    if(isAmountVisible) {
        return formatted
    } else {
        const replaced = formatted.replace(/\d/g, '*');
        return replaced;        
    }
}

export const supabase = createClient('', '')

export async function onSignOut() {
    localStorage.clear()

    await supabase.auth.signOut()

    useCookie('user-id').value = undefined
    useCookie('selected-circle').value = undefined
    useCookie('my-access-token').value = undefined
    useCookie('my-refresh-token').value = undefined

    useAuth().value = null

    return navigateTo('/')
}

export async function checkAuth() {
    const result = await supabase.auth.getSession()
    const auth = useAuth()

    if (result.data.session) {
        auth.value = {
            userId: result.data.session.user?.id,
            email: result.data.session.user?.email,
        }
    } else {
        auth.value = undefined
    }
}

export async function registerWhenNotExist(userId: string | undefined, email: string | undefined): Promise<{ status: boolean, message: string, error: any }> {
    if (!userId || !email) return {
        status: false,
        message: 'Unable to check user',
        error: undefined
    }

    const {data: resultUser, status: statusGet} = await useFetch(`/api/users/${userId}`, {
        query: {
            id: userId, email: email
        }
    })

    if (statusGet.value === 'success') {

        if (resultUser.value?.id) {
            return {
                status: true,
                message: 'User already registered with this email',
                error: undefined
            }
        }


        const {data: resultCreate, status: statusCreate, error: errorCreate} = await useFetch('/api/users/create.user', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                id: userId
            })
        })

        if (statusCreate.value !== 'success') {
            return {
                status: false,
                message: 'Failed to create user',
                error: errorCreate.value
            }
        }

        return {
            status: true,
            message: 'Success to create user',
            error: undefined
        }
    }

    return {
        status: false,
        message: 'Failed to get user',
        error: undefined
    }
}
