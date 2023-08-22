<template>
  <div>
    <div class="mb-5">
      <label for="secret-pin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Name</label>
      <input v-model="name" ref="inputRef" name="category-name" id="category-name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        type="text" placeholder="Example: Food" required v-on:keydown.enter="onSave" />
    </div>

    <label for="secret-pin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select type</label>
    <div v-for="definedType in definedTypes" class="relative h-10 inline-flex items-center mb-4 mx-3">
      <input v-model="type" :id="`radio-${definedType}`" type="radio" :value="definedType"
        class="w-4 h-4 hidden peer text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        :name="`radio-${definedType}`" required @keyup.enter="onSave">
      <label :for="`radio-${definedType}`"
        class="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div class="text-lg font-semibold">
          {{ capitalizeFirstLetter(definedType) }}
        </div>
      </label>
    </div>

    <button type="button"
      class="w-full mt-3 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      @click="onSave">
      <span v-if="isLoadingSubmit">
        <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
        Loading...
      </span>
      <span v-else>Save</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { useCurrencyInput } from 'vue-currency-input'
import { watchDebounced } from "@vueuse/shared";
import { supabase } from "~/utils/functions";
import { navigateTo } from "#app";
import { useCategories } from "~/composables/categories";
import { Category } from "~/utils/types";

const definedTypes = ['debt', 'income']
const name = ref<string>('')
const type = ref<string>('')
const isLoadingSubmit = ref<boolean>(false)
const $categories = useCategories()

const emit = defineEmits(['category-created'])

async function onSave() {
  isLoadingSubmit.value = true

  if (name.value) {
    const { data: result, status } = await useFetch('/api/categories/create.category', {
      method: 'POST',
      body: JSON.stringify({
        name: name.value.toLowerCase(),
        type: type.value.toLowerCase()
      })
    })

    if (status.value === 'success') {
      name.value = ''
      type.value = ''

      const newCategory = result.value as Category
      newCategory.checked = true

      $categories.value.data.push(newCategory)
      emit('category-created', result)
    }

    isLoadingSubmit.value = false
  }

}

</script>

<style scoped></style>
