import {supabase} from "~/utils/functions";
import {useCookie, navigateTo} from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    // const auth = useState('auth')
    // if (!auth.value.authenticated) {
    //     return navigateTo('/login')
    // }

    const refreshToken = useCookie('my-refresh-token')
    const accessToken = useCookie('my-access-token')

    if (refreshToken.value && accessToken.value) {
        await supabase.auth.setSession({
            access_token: accessToken.value,
            refresh_token: refreshToken.value
        })
    } else {
        // make sure you handle this case!
        return navigateTo('/login')
    }
// // returns user information
//     await supabase.auth.getUser()
})