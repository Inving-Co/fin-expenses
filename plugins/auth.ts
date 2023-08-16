import {defineNuxtPlugin, useCookie, useRequestHeaders} from '#app';
import {supabase} from "~/utils/functions";
import {useAuth} from "~/composables/auth";

export default defineNuxtPlugin(async () => {

    const accessToken = useCookie('my-access-token')

    if (accessToken) {
        const result = await supabase.auth.getSession()

        if(result.data.session) {
            const auth = useAuth()
            auth.value = {
                userId: result.data.session.user?.id,
                email: result.data.session.user?.email,
            }
        }
    }
})
