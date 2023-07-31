<template>
{{circle}}
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const {data:circle} = await useFetch( `/api/circles/${route.params.id}` , {
  server: false,
})
</script>
