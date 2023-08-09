<template>
  <button
      class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      type="button" @click="() => { onSignOut(); emit('on-signout') }">
    <span class="sr-only">{{ isLoggedIn ? 'Sign Out' : 'Back to Login' }}</span>
    {{ isLoggedIn ? 'Sign Out' : 'Back to Login' }}
  </button>
</template>

<script setup lang="ts">
import {onSignOut, supabase} from "~/utils/functions";
import {navigateTo, useCookie} from "#app";
import {initDropdowns} from "flowbite";

const isLoggedIn = ref<boolean>(false)
const emit = defineEmits(['on-signout'])

onMounted(() => {
  isLoggedIn.value = useCookie('access-token').value !== undefined
})

</script>

<style scoped>

</style>
