<template>
  <general-modal id="modal-form-transaction" label="Form Transaction" @on-mounted="modalFormTransaction = $event">
    <template #body>
      <FormTransaction :transaction="selectedTransaction"
                       @on-success="modalFormTransaction?.hide(); refresh(); selectedTransaction.value = null"/>
    </template>
  </general-modal>

  <general-modal id="modal-form-input-pin" label="Input Secret PIN" @on-mounted="modalFormSecretPin = $event">
    <template #body>
      <FormSecretPin @setted="modalFormSecretPin?.hide(); secretPin = $event; refresh()"/>
    </template>
  </general-modal>


  <div v-if="errorFetchTransactions">{{ errorFetchTransactions.statusMessage }}</div>
  <div v-show="!errorFetchTransactions" class="relative sm:rounded-lg">
    <div class="sm:flex mx-4 justify-center sm:justify-between pb-4 bg-white dark:bg-gray-900">
      <div class="flex gap-2 justify-center">
        <button id="dropdownActionButton" data-dropdown-toggle="dropdownAction"
                class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button">
          <span class="sr-only">Action button</span>
          Action
          <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 1 4 4 4-4"/>
          </svg>
        </button>
        <!-- Dropdown menu -->
        <div id="dropdownAction"
             class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
          <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">
            <li>
              <button type="button"
                      class="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      @click=" resetAllIsEditMode(); selectedTransaction = null; modalFormTransaction?.show()">Create
              </button>
            </li>
          </ul>
        </div>

        <button id="dropdownFilterButton" data-dropdown-toggle="dropdownFilterRadio"
                class="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button">
          <span class="sr-only">{{ capitalizeFirstLetter(filterDate) }}</span>
          {{ capitalizeFirstLetter(filterDate) }}
          <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
               viewBox="0 0 10 6">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m1 1 4 4 4-4"/>
          </svg>
        </button>

        <!-- Dropdown menu -->
        <div id="dropdownFilterRadio"
             class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-60 dark:bg-gray-700 dark:divide-gray-600"
             data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="top"
             style="position: absolute; inset: auto auto 0px 0px; margin: 0px; transform: translate3d(522.5px, 6119.5px, 0px);">
          <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownFilterButton">
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
                    <div>{{ capitalizeFirstLetter(valueFilterDate) }}</div>
                  </label>
                </div>
              </div>
            </li>
          </ul>
        </div>

      </div>
      <div class="mt-2 sm:mt-0">
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input :value="searchKey" :readonly="isLoading" type="text" id="table-search-transactions"
                 class="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 placeholder="Search for transactions" v-on:keydown.enter="onSearchTransactions($event.target.value)">
        </div>
      </div>
    </div>
    <div v-show="isLoading"
         class="fixed flex text-2xl justify-center items-center align-center top-0 left-0 right-0 bottom-0 z-50 bg-black bg-opacity-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full">
      Loading data...
    </div>
    <div>
      <table v-if="!$isMobile()" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">
            Date
          </th>
          <th scope="col" class="px-6 py-3">
            Description
          </th>
          <th scope="col" class="px-6 py-3">
            Amount
          </th>
          <th scope="col" class="px-6 py-3">
            Category
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="trx in transactions" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            v-on:dblclick="onDoubleClickRow(trx)"
            v-on:keydown.esc="trx.isEditMode = false; selectedTransaction = null">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <span v-if="!trx.isEditMode">{{ format(parseISO(trx.date), 'dd/MM/yyyy') }}</span>
            <span v-else> <VueDatePicker v-model="selectedTransaction.date" format="dd/MM/yyyy"
                                         :enable-time-picker="false" name="datepicker" locale="id-ID" auto-apply
                                         @update:model-value="onUpdate"/></span>
          </th>
          <td class="px-6 py-4">
            <span v-if="!trx.isEditMode">{{ capitalizeFirstLetter(trx.description) }}</span>
            <span v-else class="flex"><input v-model="selectedTransaction.description" type="text" name="Description"
                                             id="Description"
                                             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                             v-on:keydown.enter="onUpdate">
                          <button
                              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              type="button" @click="onDelete(trx.id); "><icons-trash/></button>
            </span>
          </td>
          <td class="px-6 py-4">
            <span v-if="!trx.isEditMode">{{ currencyIDRFormatter.format(trx.amount) }}</span>
            <span v-else><input v-model="selectedTransaction.amount" ref="inputRef" name="Amount"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                type="text"
                                placeholder="Example: 20000" v-on:keydown.enter="onUpdate"/>
            </span>
          </td>
          <td class="px-6 py-4">
            <span v-if="!trx.isEditMode">{{ capitalizeFirstLetter(trx.category.name) }}</span>
            <span v-else>
              <select v-model="selectedTransaction.categoryId" id="categories"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      @change="onUpdate">
                <option v-for="category in categories" :value="category.id" selected>
                  {{ capitalizeFirstLetter(category.name) }}
                </option>
              </select>
            </span>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else>
        <div v-for="(trx,index) in transactions"
             class="w-full my-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <span class="flex justify-between">
            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {{ currencyIDRFormatter.format(trx.amount) }}</h5>
            <div>
              <general-dropdown :id="`action-menu-mobile-trx-${index}`">
                <template #trigger="{activator}">
                  <button
                      class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                      type="button" @click="activator">
                    <icons-kebab-menu/>
                  </button>
                </template>

                <template #content="{activator}">
                  <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <button
                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          type="button" @click="selectedTransaction = trx; modalFormTransaction?.show(); activator()">Edit</button>
                    </li>
                    <li>
                      <button
                          class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          type="button" @click="onDelete(trx.id);  activator()">Delete</button>
                    </li>
                  </ul>
                </template>
              </general-dropdown>
            </div>
          </span>

          <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">{{ capitalizeFirstLetter(trx.description) }}</p>
          <span class="flex justify-between">
            <a class="inline-flex items-center text-gray-600 font-bold hover:underline">
            {{ capitalizeFirstLetter(trx.category.name) }}
          </a>
            <a class="inline-flex items-center text-gray-600 font-bold hover:underline">
            {{ format(parseISO(trx.date), 'dd/MM/yyyy') }}
          </a>
          </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {initDropdowns, initFlowbite} from "flowbite";
import {
  endOfMonth, endOfToday,
  endOfWeek, endOfYesterday,
  format,
  parseISO,
  startOfMonth,
  startOfToday, startOfWeek,
  startOfYear,
  startOfYesterday,
  subMonths
} from 'date-fns'
import {capitalizeFirstLetter, currencyIDRFormatter} from "~/utils/functions";
import {EditableTransaction, ElementEvent} from "~/utils/types";
import FormTransaction from "~/components/FormTransaction.vue";
import {useCurrencyInput} from "vue-currency-input";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import FormSecretPin from "~/components/FormSecretPin.vue";

const valuesFilterDate = ['today', 'this week', 'this month', 'this year', 'yesterday', 'last month']

const searchKey = ref<string>('')
const filterDate = ref<string>('this month')
const secretPin = ref<string>('')
const startFilterDate = ref<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd HH:mm'))
const endFilterDate = ref<string>(format(endOfToday(), 'yyyy-MM-dd HH:mm'))

const selectedTransaction = ref<EditableTransaction | null>(null)

const {inputRef} = useCurrencyInput({
  currency: 'IDR',
  locale: 'id-ID',
  precision: 0,
})

let modalFormTransaction: ElementEvent | null = null
let modalFormSecretPin: ElementEvent | null = null

onMounted(() => {
  initDropdowns()

  onCheckModalSecretPin()
})

const {data: categories}: any = await useFetch('/api/categories', {})

const {
  data: transactions,
  error: errorFetchTransactions,
  pending: isLoading,
  refresh,
}: any = await useFetch('/api/transactions', {
  query: {
    key: searchKey,
    startDate: startFilterDate,
    endDate: endFilterDate,
    secretPin: secretPin
  },
  immediate: true,
  server: false,
  onResponse: (context) => {
    if (context.response.status === 401) {
      localStorage.clear()
      setTimeout(() => onCheckModalSecretPin(), 150)
    }
  },
  watch: [startFilterDate, endFilterDate],
})

function onSearchTransactions(value: string) {
  searchKey.value = value;
}

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
  startFilterDate.value = format(start, 'yyyy-MM-dd HH:mm')
  endFilterDate.value = format(end, 'yyyy-MM-dd HH:mm')
  filterDate.value = filterValue
}

async function onDelete(trxId: number) {
  const {data: _, status} = await useFetch('/api/transactions/delete.transaction', {
    query: {
      id: trxId,
      secretPin: localStorage.getItem('secretPin')
    },
  })

  if (status.value === 'success') {
    selectedTransaction.value = null

    refresh()
  }
}

async function onUpdate() {
  const currentRow = selectedTransaction.value

  if (currentRow?.amount && currentRow.description && currentRow.id && currentRow.date && currentRow.categoryId) {
    const {data: _, status} = await useFetch('/api/transactions/update.transaction', {
      method: 'POST',
      body: JSON.stringify({
        id: currentRow.id,
        amount: currentRow.amount,
        description: currentRow.description,
        date: currentRow.date,
        categoryId: currentRow.categoryId,
        secretPin: localStorage.getItem('secretPin')
      })
    })

    if (status.value === 'success') {
      selectedTransaction.value = null

      refresh()
    }
  }
}

function onDoubleClickRow(trx: any) {
  trx.isEditMode = true;

  if (selectedTransaction.value) {
    const index = transactions.value.indexOf(selectedTransaction.value)
    transactions.value[index].isEditMode = false;
  }

  selectedTransaction.value = trx
}

function resetAllIsEditMode() {
  transactions.value.forEach((val: any) => val.isEditMode = false)
}

function onCheckModalSecretPin() {
  const $secretPin = localStorage.getItem('secretPin')

  if (!$secretPin) {
    setTimeout(() => modalFormSecretPin?.show(), 200)
  } else {
    secretPin.value = $secretPin
  }
}

</script>
