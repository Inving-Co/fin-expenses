<template>
  <general-modal id="modal-form-transaction" title="Form Transaction" @on-mounted="modalFormTransaction = $event">
    <template #body>
      <form-transaction :transaction="selectedTransaction"
                        @on-success="modalFormTransaction?.hide(); refreshTrx(); selectedTransaction = null"/>
    </template>
  </general-modal>
  <div v-if="errorFetchTransactions">{{ errorFetchTransactions.statusMessage }}</div>
  <div v-show="!errorFetchTransactions" class="relative sm:rounded-lg">
    <div class="flex justify-end">
      <general-signout/>
    </div>
    <div class="flex justify-between mt-2">
      <dropdowns-circles-selector @on-changed="refreshTrx()"/>
    </div>
    <div v-if="transactions" class="max-h-1/4 w-full gap-4 sm:flex justify-center mb-8 mt-2">
      <expenses-structure-chart class="sm:w-1/2 md:w-1/4 lg:w-1/5 w-full" :label-time="filterDate"
                                :transactions="transactions"/>
      <div class="sm:w-1/2 md:w-1/ h-full w-full flex-grow justify-between mt-4 sm:mt-0">
        <cash-flow-chart class="mb-4" :label-time="filterDate" :transactions="transactions"/>
        <debt-percentage-by-income :label-time="filterDate" :transactions="transactions"/>
      </div>
    </div>
    <div class="sm:flex p-4 justify-center sm:justify-between bg-white dark:bg-gray-900">
      <div class="flex flex-wrap gap-2 justify-center">
        <general-dropdown id="dropdownActionButton">
          <template #trigger="{activator}">
            <button
                class="h-[38px] inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button" @click="activator">
              <span class="sr-only">Action button</span>
              Action
              <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 10 6">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 1 4 4 4-4"/>
              </svg>
            </button>
          </template>
          <template #content="{activator}">
            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
              <li>
                <button type="button"
                        class="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        @click="resetAllIsEditMode(); selectedTransaction = null; modalFormTransaction?.show()">Create
                </button>
              </li>
            </ul>
          </template>
        </general-dropdown>

        <dropdowns-filter-dates
            @on-filter-changed="startFilterDate = $event.start; endFilterDate = $event.end; filterDate = $event.label"/>

        <dropdowns-filter-categories @on-mounted="categories = $event"
                                     @on-filter-changed="categoriesFilter = $event; refreshTrx()"/>

        <button
            class="h-[38px] inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button" @click="refreshTrx">
          <span class="sr-only">Refresh</span>
          Refresh
          <svg class="w-4 h-4 text-gray-500 dark:text-gray-400 ml-1" aria-hidden="true"
               xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor"
                  d="M17.65 6.35a7.95 7.95 0 0 0-6.48-2.31c-3.67.37-6.69 3.35-7.1 7.02C3.52 15.91 7.27 20 12 20a7.98 7.98 0 0 0 7.21-4.56c.32-.67-.16-1.44-.9-1.44c-.37 0-.72.2-.88.53a5.994 5.994 0 0 1-6.8 3.31c-2.22-.49-4.01-2.3-4.48-4.52A6.002 6.002 0 0 1 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"/>
          </svg>
        </button>

      </div>
      <div class="mt-2 sm:mt-0">
        <label for="table-search-transactions" class="sr-only">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input :value="searchKey" :readonly="isLoading" type="text" id="table-search-transactions"
                 class="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                 placeholder="Search for transactions" v-on:keydown.enter="onSearchTransactions($event.target.value)">
        </div>
      </div>
    </div>
    <div v-show="isLoading"
         class="fixed flex text-2xl justify-center items-center align-center top-0 left-0 right-0 bottom-0 z-50 font-semibold bg-black bg-opacity-5 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full">
      Loading data...
    </div>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg" style="height: 500px !important">
      <table v-if="!$isMobile()" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 sticky top-0 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
        <tbody class="overflow-y-scroll">
        <tr v-for="trx in transactions"
            class="bg-white hover:bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700"
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
            <span class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {{ currencyIDRFormatter.format(trx.amount) }}</span>
            <span>
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
            </span>
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

import {initDropdowns} from "flowbite";
import {
  endOfToday,
  format,
  parseISO,
  startOfMonth,
} from 'date-fns'
import {capitalizeFirstLetter, checkToken, currencyIDRFormatter, onSignOut} from "~/utils/functions";
import {Category, EditableTransaction, ElementEvent, Transaction} from "~/utils/types";
import FormTransaction from "~/components/FormTransaction.vue";
import {useCurrencyInput} from "vue-currency-input";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import ExpensesStructureChart from "~/components/ExpensesStructureChart.vue";
import DebtPercentageByIncome from "~/components/DebtPercentageByIncome.vue";
import {toast} from "vue3-toastify";

const searchKey = ref<string>('')
const filterDate = ref<string>('this month')
const secretPin = ref<string>('')
const startFilterDate = ref<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd HH:mm'))
const endFilterDate = ref<string>(format(endOfToday(), 'yyyy-MM-dd HH:mm'))
const categoriesFilter = ref<string[]>([])
const selectedTransaction = ref<EditableTransaction | null>(null)
const categories = ref<Category[]>([])

const {inputRef} = useCurrencyInput({
  currency: 'IDR',
  locale: 'id-ID',
  precision: 0,
})

let modalFormTransaction: ElementEvent | null = null

onMounted(() => {
  initDropdowns()
})

const {
  data: transactions,
  error: errorFetchTransactions,
  pending: isLoading,
  refresh: refreshTrx,
} = await useFetch<{
  at(index: number): Transaction;
  forEach(arg0: (val: Transaction) => boolean): void;
  indexOf(value: EditableTransaction | null): number;
  data: Transaction[]
}>('/api/transactions', {
  query: {
    key: searchKey,
    startDate: startFilterDate,
    endDate: endFilterDate,
    categoryIds: categoriesFilter
  },
  server: false,
  onResponse: (context) => {
    if (context.response.status === 401) {
      toast.error(context.response.statusText);

      onSignOut()
    }
  },
  watch: [startFilterDate, endFilterDate, categoriesFilter],
})


function onSearchTransactions(value: string) {
  searchKey.value = value;
}

async function onDelete(trxId: String) {
  const {status} = await useFetch('/api/transactions/delete.transaction', {
    query: {
      id: trxId,
      secretPin: localStorage.getItem('secretPin')
    },
  })

  if (status.value === 'success') {
    selectedTransaction.value = null

    await refreshTrx()
  }
}

async function onUpdate() {
  const currentRow = selectedTransaction.value

  if (currentRow?.amount && currentRow.description && currentRow.id && currentRow.date && currentRow.categoryId) {
    const {status} = await useFetch('/api/transactions/update.transaction', {
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

      await refreshTrx()
    }
  }
}

function onDoubleClickRow(trx: any) {
  trx.isEditMode = true;

  if (selectedTransaction.value && transactions.value) {
    const index = transactions.value.indexOf(selectedTransaction.value) as number
    transactions.value.at(index).isEditMode = false;
  }

  selectedTransaction.value = trx
}

function resetAllIsEditMode() {
  transactions.value!.forEach((val: any) => val.isEditMode = false)
}


</script>
