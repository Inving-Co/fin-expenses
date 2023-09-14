import {useCookie, navigateTo} from "#app";
import {useAuth} from "~/composables/auth";
import {useLoading} from "~/composables/loading";
import {onSignOut, registerWhenNotExist} from "~/utils/functions";
import {toast} from "vue3-toastify";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const hash = from.hash.substring(1)
    const parsed = hash.split('&')
    const loading = useLoading()

    if (parsed.find((e) => e.includes('401'))) {
        const errorDescription = parsed.find(param => param.startsWith('error_description='))
        toast.error(errorDescription?.replace('error_description=', '')?.replaceAll('+', ' ')?? '')

        return
    }

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

            await checkAuth()

            if (params.type === 'recovery') {
                loading.value = false

                document.cookie = `user-id=${auth.value?.userId}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
        
                return navigateTo('/change-password')
            }

            await registerWhenNotExist(auth.value?.userId, auth.value?.email)
            
            document.cookie = `user-id=${auth.value?.userId}; path=/; max-age=${maxAge}; SameSite=Lax; secure`

            loading.value = false
            return navigateTo('/transactions')
        }
    } else {
        const result = await supabase.auth.getSession()

        if (result.data.session) {
            await checkAuth()

            return navigateTo('/transactions')
        }
    }
    
    loading.value = false
})
