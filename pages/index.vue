<template>
  <div>
    <h1>Welcome</h1>
    <h3>Redirect....</h3>
  </div>
</template>

<script setup lang="ts">
onMounted(() => {
  setTimeout(() => navigateTo('transactions', {replace: true}), 10)
})
</script>
