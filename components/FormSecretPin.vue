<template>
  <div>
    <div>
      <label for="secret-pin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Secret PIN</label>
      <input v-model="secretPin" ref="inputRef" name="secret-pin" id="secret-pin"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
             type="password"
             placeholder="Don't know the PIN? ask the owner." required v-on:keydown.enter="onSave"/>
    </div>

    <button type="button"
            class="w-full mt-3 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            @click="onSave">
      Save
    </button>
    <button type="button"
            class="w-full mt-3 text-primary-300 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            @click="onSignOut">
      Sign Out
    </button>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {useCurrencyInput} from 'vue-currency-input'
import {watchDebounced} from "@vueuse/shared";
import {supabase} from "~/utils/functions";
import {navigateTo} from "#app";

const secretPin = ref<string>('')
const emit = defineEmits(['setted'])

async function onSave() {
  localStorage.setItem('secretPin', secretPin.value)
  emit('setted', secretPin.value);
}

async function onSignOut() {
  localStorage.clear()

  await supabase.auth.signOut()

  useCookie('user-id').value = undefined

  return navigateTo('/')
}
</script>

<style scoped>

</style>
