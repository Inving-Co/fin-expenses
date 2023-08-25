<template>
  <client-only>
    <button
      class="mt-4 sm:mt-0 text-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      type="button" @click="() => { onSignOut(); emit('on-signout') }">
      <span class="sr-only">{{ isLoggedIn ? 'Sign Out' : 'Back to Login' }}</span>
      {{ isLoggedIn ? 'Sign Out' : 'Back to Login' }}
    </button>
  </client-only>
</template>

<script setup lang="ts">
import { onSignOut } from "~/utils/functions";
import { useAuth } from "~/composables/auth";

const emit = defineEmits(['on-signout'])

const isLoggedIn = computed(() => useAuth().value?.userId !== undefined)


</script>

<style scoped></style>
