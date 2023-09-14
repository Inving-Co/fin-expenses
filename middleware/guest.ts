import {useCookie, navigateTo} from "#app";
import {useAuth} from "~/composables/auth";
import {useLoading} from "~/composables/loading";
import {onSignOut, registerWhenNotExist} from "~/utils/functions";
import {toast} from "vue3-toastify";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const hash = from.hash.substring(1)
    const parsed = hash.split('&')
    const loading = useLoading()

    if(loading.value) return

    if (hash) {
        loading.value = true

        /// parsed hash to map params
        let params: any = {}
        for (let i = 0; i < parsed.length; i++) {
            const kv = parsed[i].split('=')
            params[kv[0]] = kv[1]
        }
        
        if (params && params.access_token && params.refresh_token) {
            const auth = useAuth()
            const maxAge = 100 * 365 * 24 * 60 * 60
            document.cookie = `my-access-token=${params.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
            document.cookie = `my-refresh-token=${params.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`

            // Check if the password reset is required
            if (params.type === 'recovery') {
                return navigateTo('/transactions')
            } else {
                await checkAuth()
            }

            await registerWhenNotExist(auth.value?.userId, auth.value?.email)

            document.cookie = `user-id=${auth.value?.userId}; path=/; max-age=${maxAge}; SameSite=Lax; secure`

            loading.value = false
            return navigateTo('/transactions')
        }
    } else {
        const refreshToken = useCookie('my-refresh-token')
        const accessToken = useCookie('my-access-token')

        if (refreshToken.value && accessToken.value) {
            return navigateTo('/transactions')
        }
    }

    loading.value = false
})
