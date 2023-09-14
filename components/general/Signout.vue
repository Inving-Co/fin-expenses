<template>
  <client-only>
    <button
      class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
