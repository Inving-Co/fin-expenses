import {onSignOut, supabase} from "~/utils/functions";
import {useCookie, navigateTo} from "#app";
import {useAuth} from "~/composables/auth.ts";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const refreshToken = useCookie('my-refresh-token')
    const accessToken = useCookie('my-access-token')

    if (refreshToken.value && accessToken.value) {
        const result = await supabase.auth.setSession({
            access_token: accessToken.value,
            refresh_token: refreshToken.value
        })

        if(result.data.session) {
            const auth = useAuth()
            auth.value = {
                userId: result.data.session.user?.id,
                email: result.data.session.user?.email,
            }
        }
    } else {
        return navigateTo('/')
    }
})
