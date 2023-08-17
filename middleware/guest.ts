import {useCookie, navigateTo} from "#app";
import {useAuth} from "~/composables/auth";
import {useLoading} from "~/composables/loading";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const hash = from.hash.substring(1)
    const parsed = hash.split('&')

    if(hash) {
        useLoading().value = true

        let query: any = {}
        for(let i = 0; i < parsed.length; i++) {
            const kv = parsed[i].split('=')
            query[kv[0]] = kv[1]
        }
        if(query) {
            const maxAge = 100 * 365 * 24 * 60 * 60
            document.cookie = `my-access-token=${query.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
            document.cookie = `my-refresh-token=${query.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`

            await checkAuth()

            document.cookie = `user-id=${useAuth().value?.userId}; path=/; max-age=${maxAge}; SameSite=Lax; secure`

            useLoading().value = false
            return navigateTo('/transactions')
        }
    } else {
        const refreshToken = useCookie('my-refresh-token')
        const accessToken = useCookie('my-access-token')

        if (refreshToken.value && accessToken.value) {
            // return navigateTo('/transactions')
        }
    }
})
