<template>
  <div>
    <div>
      <label for="secret-pin" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Name</label>
      <input v-model="name" ref="inputRef" name="category-name" id="category-name"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
             type="text"
             placeholder="Example: Food" required v-on:keydown.enter="onSave"/>
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
import {useCurrencyInput} from 'vue-currency-input'
import {watchDebounced} from "@vueuse/shared";
import {supabase} from "~/utils/functions";
import {navigateTo} from "#app";
import {useCategories} from "~/composables/categories";
import {Category} from "~/utils/types";

const name = ref<string>('')
const isLoadingSubmit = ref<boolean>(false)
const $categories = useCategories()

const emit = defineEmits(['category-created'])

async function onSave() {
  isLoadingSubmit.value = true

  if (name.value) {
    const {data: result, status} = await useFetch('/api/categories/create.category', {
      method: 'POST',
      body: JSON.stringify({
        name: name.value.toLowerCase()
      })
    })

    if (status.value === 'success') {
      name.value = ''

      const newCategory = result.value as Category
      newCategory.checked = true

      $categories.value.data.push(newCategory)
      emit('category-created', result)
    }

    isLoadingSubmit.value = false
  }

}

</script>

<style scoped>

</style>
