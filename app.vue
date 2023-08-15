<template>
  <div class="bg-gray-50 m-0">
    <NuxtLayout>
      <NuxtLoadingIndicator color="orange" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import 'vue3-toastify/dist/index.css';
import {onMounted} from "@vue/runtime-core";
import {AuthChangeEvent, Session} from "@supabase/gotrue-js/src/lib/types";

onMounted(() => {
  supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
    if (event === 'SIGNED_OUT') {
      // delete cookies on sign out
      const expires = new Date(0).toUTCString()
      document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`
      document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`
    } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
      document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
      document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
    }
  })
})
</script>
