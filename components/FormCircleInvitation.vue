<template>
  <div>
    <span class="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-500 from-lime-600">{{ capitalizeFirstLetter(circle?.name) }}<small class="ml-2 font-light text-sm text-gray-500 dark:text-gray-400">Link Invitation</small></span>
    <blockquote class="p-4 my-4 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
      <p class="text-sm italic font-medium leading-relaxed text-gray-900 dark:text-white">{{ copiedLink }}</p>
    </blockquote>
  </div>
</template>

<script setup lang="ts">
import {Circle} from "~/utils/types";
const circle = ref<Circle | null>(null)
const copiedLink = ref<string | null>(null)

const props = defineProps({
  circleId: {
    type: String,
  }
})

watch(() => props.circleId, async (value) => {
  if(value)  {
    await activatorLoad(value)
    copiedLink.value = `${window.location.origin}/circles/${circle.value?.id}`
  }
})


const activatorLoad = async (value: string) => {
  const {data} = await useFetch( `/api/circles/${value}` , {
    server: false,
  })

  circle.value = data.value as any
}

</script>
