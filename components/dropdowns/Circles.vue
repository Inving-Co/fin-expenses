<template>

  <general-modal id="modal-form-circle" label="Create Circle" @on-mounted="modalFormCircle = $event">
    <template #body>
      <form-circle @on-success="modalFormCircle?.hide(); onCircleChange($event); refreshCircles(); "/>
    </template>
  </general-modal>

  <general-dropdown id="dropdownCircles" class="mt-2">
    <template #trigger="{activator}">
      <button class="h-[38px] inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button" @click="activator">
        <span class="sr-only">Circles button</span>
        Circles
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 4 4 4-4"/>
        </svg>
      </button>
    </template>
    <template #content="{activator}">
      <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
        <li v-for="circle in circles">
          <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <div class="flex items-center h-5">
              <input :id="circle?.id + `-radio`" :name="circle?.id + `-radio`"
                     type="radio" :value="circle?.id"
                     :checked="selected === circle?.id"
                     class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                     @change="onCircleChange(circle);"/>
            </div>
            <div class="ml-2 text-sm">
              <label :for="circle?.id + `-radio`" class="font-medium text-gray-900 dark:text-gray-300">
                <div>{{ capitalizeFirstLetter(circle?.name) }}</div>
              </label>
            </div>
          </div>
        </li>
      </ul>
    </template>
  </general-dropdown>
</template>

<script setup lang="ts">
import {capitalizeFirstLetter} from "~/utils/functions";
import {useCookie} from "#app";
import {ElementEvent} from "~/utils/types";

const emit = defineEmits(['on-mounted', 'on-changed'])
let modalFormCircle: ElementEvent | null = null
let selected = ref<number | null>(null)

onMounted(() => {
  emit('on-mounted', circles)
})

const {data: circles, refresh: refreshCircles} = await useFetch('/api/circles', {
  server: false,
  onResponse: ({ response }) => {

    if(response.status === 200) {
      const data = response._data

      if(data && data.length > 0) {
        onCircleChange(data[0])
      }
    }
  }
})

function onCircleChange(value: any) {
  useCookie('selected-circle', {
    secure: true,
    sameSite: 'lax',
  }).value = JSON.stringify(value)

  selected.value = value.id

  emit('on-changed')
}
</script>

<style scoped>

</style>