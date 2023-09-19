<template>
  <div>
    <div class="mb-5">
      <label for="category-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category Name</label>
      <input v-model="name" ref="inputRef" name="category-name" id="category-name"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
             type="text" placeholder="Example: Food" required v-on:keydown.enter="onSave"/>
    </div>

    <label for="type-category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select type</label>
    <div v-for="definedType in definedTypes" class="inline-flex h-10 items-center mb-4 mx-3">
      <div :data-tooltip-target="`tooltip-default-${definedType.name}`" class="w-full">
        <input v-model="type" :id="`radio-${definedType.name}`" type="radio" :value="definedType.name"
               class="w-4 h-4 hidden peer text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
               :name="`radio-${definedType.name}`" required>
        <label :for="`radio-${definedType.name}`"
               class="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
          <div class="text-lg font-semibold">
            {{ capitalizeFirstLetter(definedType.name) }}
          </div>
        </label>
        <div :id="`tooltip-default-${definedType.name}`" role="tooltip"
             class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
          {{ definedType.description }}
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
    </div>

    <button type="button"
            class="w-full mt-3 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
import '@vuepic/vue-datepicker/dist/main.css'
import {useCategories} from "~/composables/categories";
import {Category} from "~/utils/types";
import {initTooltips} from "flowbite";

onMounted(() => {
  initTooltips()
})

const definedTypes = [{
  name: 'debt',
  description: 'Debt are used to calculate the percentage of your debt based on income'
}, {
  name: 'income',
  description: 'Income are used to calculate cash flow'
}]


const name = ref<string>('')
const type = ref<string>('')
const isLoadingSubmit = ref<boolean>(false)
const $categories = useCategories()

const emit = defineEmits(['category-created'])

async function onSave() {
  isLoadingSubmit.value = true

  if (name.value) {
    const {data: result, status} = await useFetch('/api/categories/create.category', {
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
