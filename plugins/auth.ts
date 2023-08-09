import {defineNuxtPlugin, useCookie, useRequestHeaders} from '#app';
import {supabase} from "~/utils/functions";
import {useAuth} from "~/composables/auth";

export default defineNuxtPlugin(async () => {

    const accessToken = useCookie('my-access-token')

    if (accessToken) {
        const result = await supabase.auth.getUser(accessToken.value!)

        const auth = useAuth()
        auth.value = {
            userId: result.data.user?.id,
            email: result.data.user?.email,
        }
    }
})
