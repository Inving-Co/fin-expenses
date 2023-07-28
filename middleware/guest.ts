import {useCookie, navigateTo} from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const refreshToken = useCookie('my-refresh-token')
    const accessToken = useCookie('my-access-token')

    if (refreshToken.value && accessToken.value) {
        return navigateTo('/transactions')
    }
})
