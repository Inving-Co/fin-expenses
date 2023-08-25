<template>
  <div v-show="props.isLoading"
    class="fixed flex text-2xl justify-center items-center align-center top-0 left-0 right-0 bottom-0 z-50 font-semibold bg-black bg-opacity-20 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full">
    <vue3-lottie :animationData="LoadingJSON" :height="400" :width="400" />
  </div>
</template>

<script setup lang="ts">
import { Vue3Lottie } from "vue3-lottie";
import LoadingJSON from '~/assets/lottie/loading.json'


const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true
  }
})

onMounted(() => {

})

</script>

<style scoped></style>
