export function capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


export const currencyIDRFormatter = Intl.NumberFormat('ID', {
    style:'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
})

