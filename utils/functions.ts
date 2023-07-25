import {createClient} from "@supabase/supabase-js";
import {toast, ToastOptions} from "vue3-toastify";

/// https://github.com/prisma/studio/issues/614#issuecomment-1374116622
declare global {
    interface BigInt {
        toJSON(): string;
    }
}

BigInt.prototype.toJSON = function (): string {
    return this.toString();
};

export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export const currencyIDRFormatter = Intl.NumberFormat('ID', {
    style:'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
})

export const supabase = createClient('***REMOVED***', '***REMOVED***')

export function toastSuccess(str: string) {
    toast(str, {
        autoClose: 1000,
        type: 'success',
        position: toast.POSITION.TOP_RIGHT,
    } as ToastOptions)
}

export function toastError(str: string) {
    toast(str, {
        autoClose: 3000,
        type: 'error',
        position: toast.POSITION.TOP_RIGHT,
    } as ToastOptions)
}