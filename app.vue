<template>
  <VitePwaManifest />
  <div :class="$colorMode.preference !== 'system' ? '' : 'no-flash'">
    <div class="bg-gray-50 dark:bg-gray-900 h-full m-0">
      <NuxtLayout>
        <NuxtLoadingIndicator color="orange" />
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'vue3-toastify/dist/index.css';
import { onMounted } from "@vue/runtime-core";
import { AuthChangeEvent, Session } from "@supabase/gotrue-js/src/lib/types";

onMounted(() => {
  if (localStorage.getItem('dark-mode') === 'true') {
    document.documentElement.classList.add('dark');
    document.documentElement.style.backgroundColor = '#101827';
    useDarkMode().value = true
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.backgroundColor = '#f9fafb';
    useDarkMode().value = false
  }

  if (localStorage.getItem('is-amount-visible')) {
    useAmountVisibility().value = localStorage.getItem('is-amount-visible') === 'true'
  } else {
    localStorage.setItem('is-amount-visible', 'true')
    useAmountVisibility().value = true
  }


  supabase().auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    if (event === 'SIGNED_OUT') {
      // delete cookies on sign out
      const expires = new Date(0).toUTCString()
      document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`
      document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`

      useCookie('user-id').value = undefined
      useCookie('selected-circle').value = undefined

      useAuth().value = undefined
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
      document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
      document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
    }
  })
})
</script>


<style>
.dp__theme_light {
  --dp-primary-color: #E1914D !important;
}

.dp__theme_dark {
  --dp-hover-color: rgb(55 65 81);
  --dp-background-color: #394150;
  --dp-primary-color: #E1914D !important;
}
</style>
