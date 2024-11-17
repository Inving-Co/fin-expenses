<template>
  <button @click="$emit('click')"
    class="fixed bottom-4 right-4 z-50 md:hidden bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg">
    <slot>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </slot>
  </button>
</template>

<script setup lang="ts">
defineEmits(['click'])
</script>
