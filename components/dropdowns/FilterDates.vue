<template>
  <general-dropdown id="dropdownFilterDateButton">
    <template #trigger="{activator}">
      <button class="h-[38px] inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button" @click="activator">
        <span class="sr-only">{{ capitalizeFirstLetter(filterDate) }}</span>
        {{ capitalizeFirstLetter(filterDate) }}
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 4 4 4-4"/>
        </svg>
      </button>
    </template>
    <template #content="{activator}">
      <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownFilterDateButton">
        <li v-for="valueFilterDate in valuesFilterDate">
          <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
            <div class="flex items-center h-5">
              <input v-model="filterDate" :id="valueFilterDate + `-radio`" :name="valueFilterDate + `-radio`"
                     type="radio" :value="valueFilterDate"
                     class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                     @change="onFilterDateChanges($event.target.value);">
            </div>
            <div class="ml-2 text-sm">
              <label :for="valueFilterDate + `-radio`" class="font-medium text-gray-900 dark:text-gray-300">
                <span>{{ capitalizeFirstLetter(valueFilterDate) }}</span>
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
import {
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYesterday, format,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday, subMonths
} from "date-fns";

const filterDate = ref<string>('this month')
const valuesFilterDate = ['today', 'this week', 'this month', 'this year', 'yesterday', 'last month']

const emit = defineEmits(['on-filter-changed'])

function onFilterDateChanges(value: string) {
  switch (value) {
    case('today'):
      setFilterDate(startOfToday(), endOfToday(), 'today')
      break
    case('this week'):
      setFilterDate(startOfWeek(new Date()), endOfWeek(new Date()), 'this week')
      break;
    case('this month'):
      setFilterDate(startOfMonth(new Date()), endOfToday(), 'this month')
      break;
    case('this year'):
      setFilterDate(startOfYear(new Date()), endOfToday(), 'this year')
      break;
    case('yesterday'):
      setFilterDate(startOfYesterday(), endOfYesterday(), 'yesterday')
      break;
    case('last month'):
      setFilterDate(startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1)), 'last month')
      break;
  }
}

function setFilterDate(start: Date, end: Date, filterValue: string) {
  emit('on-filter-changed', {start: format(start, 'yyyy-MM-dd HH:mm'), end: format(end, 'yyyy-MM-dd HH:mm'), label: filterValue})

  filterDate.value = filterValue
}

</script>

<style scoped>

</style>
