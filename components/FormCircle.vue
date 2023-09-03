<template>
  <div>
    <label for="circle-name" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Circle Name</label>
    <input v-model="name" ref="inputRef" name="circle-name" id="circle-name"
           class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
           type="text" placeholder="Fill the circle name" required v-on:keydown.enter="onSave"/>
    <label for="dropdownFilterCurrencyButton" class="block mt-4 mb-1 text-sm font-medium text-gray-900 dark:text-white">Currency</label>
    <general-dropdown id="dropdownFilterCurrencyButton">
      <template #trigger="{ activator }">
        <button
            class="h-[38px] flex w-full justify-between items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            type="button" @click="activator">
          <span class="sr-only">{{ selectedCurrency ?? 'Currency' }}</span>
          {{ selectedCurrency ?? 'Currency' }}
          <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 1 4 4 4-4"/>
          </svg>
        </button>
      </template>
      <template #content="{ activator }">
        <ul class="py-1 w-full text-sm text-gray-700 dark:text-gray-200">
          <li v-for="(currency, index) of listCurrency" class="mx-3 my-2">
            <div class="flex items-center pl-3">
              <input v-model="selectedCurrency" :id="`${index}-currency-radio`" type="radio" :value="currency"
                     name="list-currency-radio"
                     class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                     >
              <label :for="`${index}-currency-radio`"
                     class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                  currency.toUpperCase()
                }}</label>
            </div>
          </li>
        </ul>
      </template>
    </general-dropdown>

    <button type="button"
            class="w-full mt-4 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            @click="onSave">
      <span v-if="isLoadingSubmit">
        <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin"/>
        Loading...
      </span>
      <span v-else>Save</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import {Circle} from "~/utils/types";
import {capitalizeFirstLetter} from "~/utils/functions";
import {useCircleUsers} from "~/composables/circles";

const auth = useAuth()

const name = ref<string>('Personal Circle\'s')
const selectedCurrency = ref<string>('IDR')

const listCurrency = ref<string[]>(['IDR', 'SGD', 'VND', 'MYR', 'PHP', 'THB', 'USD', 'EUR'])

const isLoadingSubmit = ref<boolean>(false)
const $circleUsers = useCircleUsers()

onMounted(() => {
  const firstEmail = auth.value?.email?.split('@')[0] ?? 'Personal'
  const personalName = firstEmail.replace('.', ' ')

  name.value = `${capitalizeFirstLetter(personalName)} Circle\'s`
})

const emit = defineEmits(['setted', 'on-success'])

async function onSave() {
  isLoadingSubmit.value = true

  if (name.value) {
    const {data: result, status} = await useFetch('/api/circles/create.circle', {
      method: 'POST',
      body: JSON.stringify({
        name: name.value,
        currency: selectedCurrency.value
      })
    })

    if (status.value === 'success') {
      name.value = ''
      selectedCurrency.value = 'IDR'

      $circleUsers.value.selected = result.value as Circle | null

      emit('on-success', result.value)
    }
  }
}
</script>

<style scoped></style>
