<template>
  <div>
    <div class="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-500 from-lime-600">{{
        capitalizeFirstLetter(circle?.name)
      }}</div>


    <label class="my-2 mt-4 relative inline-flex items-center cursor-pointer">
      <input type="checkbox" value="" class="sr-only peer">
      <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ml-3 text-sm font-semibold  text-gray-900 dark:text-gray-300">Receive email report</span>
    </label>


    <div class="flex block my-2">
      <input :value="copiedLink"
             ref="elink"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
             type="text"
             readonly/>

      <button
          class="ml-2 rounded-md text-center text-gray-500 bg-white border-none focus:ring-transparent hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          type="button" @click="copyText">
        <span class="sr-only"><icons-user-group-add/></span>
        <icons-copy/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Circle} from "~/utils/types";
import {toast} from "vue3-toastify";

const circle = ref<Circle | null>(null)
const copiedLink = ref<string | null>(null)
const elink = ref<string | null>(null)

const props = defineProps({
  circleId: {
    type: String,
  }
})

watch(() => props.circleId, async (value) => {
  if (value) {
    await activatorLoad(value)
    copiedLink.value = `${window.location.origin}/circles/${circle.value?.id}`
  }
})


const activatorLoad = async (value: string) => {
  const {data} = await useFetch(`/api/circles/${value}`, {
    server: false,
  })

  circle.value = data.value as any
}

function copyText() {
  const element = elink.value as any;
  element.select();
  element.setSelectionRange(0, 99999);
  document.execCommand('copy');

  toast.success('Copied to clipboard!')
}

</script>
