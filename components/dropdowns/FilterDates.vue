<template>
  <general-dropdown id="dropdownFilterDateButton">
    <template #trigger="{activator}">
      <button class="h-[38px] inline-flex items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
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
      <div class="flex flex-col sm:flex-row gap-4 items-start p-3">
        <ul v-if="!isDateVisible || !$isMobile()" class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownFilterDateButton">
          <li v-for="valueFilterDate in valuesFilterDate">
            <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center h-5">
                <input v-model="filterDate" :id="valueFilterDate + `-radio`" :name="valueFilterDate + `-radio`"
                       type="radio" :value="valueFilterDate"
                       class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                       @change="onFilterDateChanges($event.target.value);">
              </div>
              <div class="ml-2 text-sm">
                <label :for="valueFilterDate + `-radio`" class="font-medium text-gray-900 dark:text-gray-300">
                  <span>{{ capitalizeFirstLetter(valueFilterDate) }}</span>
                </label>
              </div>
            </div>
          </li>
          <li>
            <div class="flex p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center h-5">
                <input v-model="filterDate" :id="`custom-radio`" :name="`custom-radio`"
                       type="radio" value="custom"
                       class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                       @change="onFilterDateChanges($event.target.value); isDateVisible = true">
              </div>
              <div class="ml-2 text-sm">
                <label :for="`custom-radio`" class="font-medium text-gray-900 dark:text-gray-300">
                  <span>Custom</span>
                </label>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="isDateVisible || !$isMobile()" class="h-full">
          <button
              v-if="$isMobile()"
              class="h-[38px] inline-flex items-center mb-2 text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              type="button" @click="isDateVisible = false">
            Back
          </button>
          <VueDatePicker v-model="date" 
                         name="datepicker" 
                         id="datepicker" 
                         locale="id-ID"
                         format="dd/MM/yyyy"  
                         hide-input-icon 
                         :dark="isDarkMode"
                         :enable-time-picker="false"
                         placeholder="Select Date" 
                         auto-apply 
                         autorange 
                         range 
                         inline 
                         :readonly="filterDate !== 'custom'"
                         :transitions="{ open: '', close: '' }" />
        </div>
      </div>
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
import VueDatePicker from "@vuepic/vue-datepicker";

const filterDate = ref<string>('this month')
const valuesFilterDate = ['today', 'this week', 'this month', 'this year', 'yesterday', 'last month']
const date = ref<any>([undefined, undefined])
const isDateVisible = ref(false)

const emit = defineEmits(['on-filter-changed'])
const isDarkMode = useDarkMode()

onMounted(() => {
  const dt = localStorage.getItem('current-filtered-date-selected')

  if (dt) {
    onFilterDateChanges(dt)
  }
})

watch(() => date.value, (value) => {
  if (filterDate.value === 'custom') {
    emit('on-filter-changed', {
      start: format(value[0], 'yyyy-MM-dd HH:mm'),
      end: format(value[1], 'yyyy-MM-dd HH:mm'),
      label: filterDate.value
    })
  }
})

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
    case('custom'):
      setFilterDate(startOfMonth(new Date()), endOfToday(), 'custom')
      isDateVisible.value = true
      break;
  }
}

function setFilterDate(start: Date, end: Date, filterValue: string) {
  date.value[0] = start
  date.value[1] = end

  emit('on-filter-changed', {start: format(start, 'yyyy-MM-dd HH:mm'), end: format(end, 'yyyy-MM-dd HH:mm'), label: filterValue})

  filterDate.value = filterValue

  localStorage.setItem('current-filtered-date-selected', filterValue)
}
</script>

<style scoped>
:deep(.dp__menu) {
  position: static !important;
  transform: none !important;
  transition: none !important;
  margin: 0 !important;
}

:deep(.dp__outer_menu_wrap) {
  position: static !important;
  transform: none !important;
  transition: none !important;
}
</style>
