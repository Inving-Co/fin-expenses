<template>
  <general-dropdown id="dropdownFilterCategoryButton">
    <template #trigger="{ activator }">
      <button
        class="h-[38px] inline-flex items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        type="button" @click="activator">
        <span class="sr-only">Category</span>
        Category
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
    </template>
    <template #content="{ activator }">
      <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
        <li
          v-for="(category, index) of categories.filter((cat: any) => cat.type !== 'receive' && cat.type !== 'transfer')">
          <div class="flex items-center px-2 py-1">
            <input :id="`${category.id}-category-checkbox`" type="checkbox" :value="category.id"
              :checked="category.checked"
              class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
              @click="category.checked = $event.target.checked; setCategoriesFilter();">
            <label :for="`${category.id}-category-checkbox`"
              class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                capitalizeFirstLetter(category.name)
              }}</label>
          </div>
        </li>
        <li>
          <button
            class="w-full mt-2 text-center text-gray-500 bg-white border-none focus:ring-transparent hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button" @click="onClearSelectedCategories">
            <span class="sr-only">{{ isHasChecked ? 'Clear' : 'Select All' }}</span>
            {{ isHasChecked ? 'Clear' : 'Select All' }}
          </button>
        </li>
      </ul>
    </template>
  </general-dropdown>
</template>

<script setup lang="ts">
import { capitalizeFirstLetter } from "~/utils/functions";
import { Category } from "~/utils/types";
import { useCategories } from "~/composables/categories";
import { useCircleUsers } from "~/composables/circles";

const $categories = useCategories()
const $circleUsers = useCircleUsers()

const emit = defineEmits(['on-filter-changed', 'on-mounted'])

const categories = computed(() => $categories.value.data)
const selectedCircle = computed(() => $circleUsers.value.selected)
const isHasChecked = computed(() => categories.value?.filter((cat: Category) => cat.checked).length > 0);

const { error }: any = await useFetch('/api/categories', {
  onRequest({ request, response }) {
    $categories.value.isLoading = true
  },
  onResponse({ request, response, options }) {
    $categories.value.isLoading = false

    if (response.ok) {
      $categories.value.data = response._data

      reloadState();
      setCategoriesFilter()
    }

  },
  watch: [selectedCircle]
})

onMounted(() => {
  emit('on-mounted')
})


function reloadState() {
  const cats = useCookie<string | undefined>(`${selectedCircle.value?.id}-current-filtered-categories-selected`)

  if (cats.value) {
    const arrCats = cats.value.split(',');

    for (let i = 0; i < arrCats.length; i++) {
      let foundIndex = -1

      for (let j = 0; j < categories.value.length; j++) {
        const isFound = categories.value[j].id === arrCats[i]

        if (isFound) {
          foundIndex = j;
          break;
        }

      }

      if (foundIndex !== -1) {
        categories.value[foundIndex].checked = true
      }

    }
  } else {
    for (let j = 0; j < categories.value.length; j++) {
      if (categories.value[j].type === 'transfer' || categories.value[j].type === 'receive') {
        categories.value[j].checked = false
      } else {
        categories.value[j].checked = true
      }
    }
  }
}

function setCategoriesFilter() {
  const values = categories.value.filter((cat: Category) => cat.checked).map((cat: Category) => cat.id)
  emit('on-filter-changed', values)

  document.cookie = `${selectedCircle.value?.id}-current-filtered-categories-selected=${values.join(',')}`
}

function onClearSelectedCategories() {

  const isChecked = isHasChecked.value

  for (let i = 0; i < categories.value.length; i++) {
    if (categories.value[i].type === 'transfer' || categories.value[i].type === 'receive') {
      categories.value[i].checked = false
    } else {
      categories.value[i].checked = !isChecked;
    }
  }

  setCategoriesFilter()
}
</script>

<style scoped></style>
