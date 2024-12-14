import { $fetch } from 'ofetch'

let cachedRates: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default defineEventHandler(async (event) => {
    const currentTime = Date.now();
    
    if (cachedRates && (currentTime - cacheTimestamp < CACHE_DURATION)) {
        return cachedRates;
    }
    try {
        const response = await $fetch('https://api.vatcomply.com/rates');
        cachedRates = response; 
        cacheTimestamp = currentTime; 
        return response;
    } catch (error) {
        throw createError({
            statusCode: 500,
            message: 'Failed to fetch currency rates'
        });
    }
})
