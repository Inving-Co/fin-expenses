<template>
  <general-modal id="modal-form-transaction" title="Form Transaction" @on-mounted="modalFormTransaction = $event">
    <template #body>
      <form-transaction :transaction="selectedTransaction"
                        @on-mounted="refreshInputAmount = $event"
                        @on-success="modalFormTransaction?.hide(); refreshTrx(); selectedTransaction = undefined"
                        @add-category="modalFormTransaction?.hide(); modalFormCategory?.show();"/>
    </template>
  </general-modal>
  <general-modal id="modal-form-category" title="Form Category" @on-mounted="modalFormCategory = $event"
                 @on-modal-closed="refreshInputAmount?.setInputAmount(); modalFormTransaction?.show();">
    <template #body>
      <form-category @category-created="modalFormCategory?.hide(); refreshInputAmount?.setInputAmount(); modalFormTransaction?.show();"/>
    </template>
  </general-modal>
  
  <general-modal id="modal-confirmation-delete" title="Confirmation" @on-mounted="modalConfDelete = $event">
    <template #body>
      <p class="text-gray-500">Are you sure you want to delete this data?</p>

      <div class="flex mt-4">

        <button 
          type="button" 
          class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
          @click="modalConfDelete?.hide()">No</button>
        <button 
          type="button" 
          class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
          @click="onDelete(selectedTransaction.id); modalConfDelete?.hide()">Yes</button>
      </div>
    </template>
  </general-modal>

  <div v-if="errorFetchTransactions">{{ errorFetchTransactions.statusMessage }}</div>
  <div v-show="!errorFetchTransactions" class="relative sm:rounded-lg">
    <div class="flex flex-col my-6">
      <span class="text-2xl text-gray-500">My Financial Records</span>
      <span class="text-md mt-2 text-gray-400">Records and Plan your next move for a better week</span>
    </div>
    <div v-if="transactions" class="max-h-1/4 w-full gap-4 sm:flex justify-center mb-8 mt-2">
      <expenses-structure-chart class="sm:w-1/2 md:w-1/4 lg:w-1/5 w-full" :label-time="filterDate"
                                :transactions="transactions"/>
      <div class="sm:w-1/2 md:w-1/ h-full w-full flex-grow justify-between mt-4 sm:mt-0">
        <cash-flow-chart class="mb-4" :label-time="filterDate" :transactions="transactions"/>
        <debt-percentage-by-income :label-time="filterDate" :transactions="transactions"/>
      </div>
    </div>
    <div class="sm:flex p-4 justify-center sm:rounded-t-lg sm:justify-between bg-white dark:bg-gray-700"
         style="box-shadow: 0 10px 12px rgba(0, 0, 0, 0.1)">
      <div class="flex flex-wrap gap-2 justify-center">
        <button type="button"
                        class="h-[38px] inline-flex items-center text-white bg-primary-500 dark:bg-primary-700 dark:text-white drop-shadow-sm hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700"
                        @click="resetAllIsEditMode(); selectedTransaction = undefined; refreshInputAmount?.setInputAmount(); modalFormTransaction?.show()">
          <icons-plus class="mr-1"/>
          Create
        </button>

        <dropdowns-filter-dates
            @on-filter-changed="startFilterDate = $event.start; endFilterDate = $event.end; filterDate = $event.label"/>
        <dropdowns-filter-categories/>

        <button
            class="h-[38px] inline-flex items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            type="button" @click="(_) => refreshTrx()" :disabled="isLoading">
          <icons-circular-indicator v-if="isLoading" class="inline w-4 h-4 mr-1 text-white animate-spin"/>
          <icons-refresh v-else class="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1"/>
          Refresh
        </button>

      </div>
      <div class="mt-2 sm:mt-0">
        <label for="table-search-transactions" class="sr-only">Search</label>
        <div class="relative">
          <div class="z-10 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                 fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input :value="searchKey" :readonly="isLoading" type="text" id="table-search-transactions"
                 class="w-full p-2 pl-10 pr-10 text-sm text-gray-900 dark:text-gray-400 dark:bg-gray-800 drop-shadow hover:drop-shadow-md focus:drop-shadow-md rounded-lg border-none focus:ring-0"
                 placeholder="Search for transactions"
                 v-on:keydown.enter="onSearchTransactions(($event.target as HTMLInputElement)?.value)">
        </div>
      </div>
    </div>
    <div v-if="transactions?.length === 0"
         class="flex flex-col text-2xl justify-center items-center align-center top-0 left-0 right-0 bottom-0 z-50 font-semibold p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full">
      <div class="w-full sm:w-1/5 my-5 text-center">
        <vue3-lottie :animationData="EmptyJSON"/>
        <p class="text-gray-500 dark:text-gray-400">No transactions found.</p>
      </div>
    </div>
    <div v-else-if="!$circleUsers.isLoading && !categories.isLoading"
         class="relative overflow-x-auto drop-shadow-soft" style="height: 500px !important">
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
            v-on:keydown.esc="trx.isEditMode = false; selectedTransaction = undefined">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <span v-if="!trx.isEditMode">{{ format(parseISO(trx.date), 'dd/MM/yyyy') }}</span>
            <span v-else><vue-date-picker v-model="selectedTransaction!.date" format="dd/MM/yyyy"
                                           :enable-time-picker="false" name="datepicker" locale="id-ID" auto-apply :teleport="true"
                                           @update:model-value="onUpdate(trx)"/></span>
          </th>
          <td class="px-6 py-4">
            <span v-if="!trx.isEditMode">{{ capitalizeFirstLetter(trx.description) }}</span>
            <span v-else class="flex">
                <input v-model="selectedTransaction!.description" type="text" name="Description" id="Description"
                       class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                       v-on:keydown.enter="onUpdate">
                <button class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                        type="button" @click="modalConfDelete?.show()"><icons-trash/></button>
              </span>
          </td>
          <td class="px-6 py-4">
            <span v-if="!trx.isEditMode">
                        {{ currencyIDRFormatter($circleUsers.selected.currency, trx.amount) }}
            </span>
            <span v-else>
                  <general-currency-field v-model="selectedTransaction!.amount" @keydown.enter="onUpdate" />
              </span>
          </td>
          <td class="px-6 py-4">
            <span v-if="!trx.isEditMode">{{ capitalizeFirstLetter(trx.category.name) }}</span>
            <span v-else>
                <select v-model="selectedTransaction!.categoryId" id="categories"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        @change="onUpdate">
                  <option v-for="category in categories.data" :value="category.id" selected>
                    {{ capitalizeFirstLetter(category.name) }}
                  </option>
                </select>
              </span>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else>
        <div v-for="(trx, index) of transactions ?? []"
             class="w-full my-3 p-6 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <span class="flex justify-between">
            <span class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {{ currencyIDRFormatter($circleUsers.selected.currency, trx.amount) }}
            </span>
            <span>
              <general-dropdown :id="`action-menu-mobile-trx-${index}`">
                <template #trigger="{ activator }">
                  <button
                      class="inline-flex items-center text-gray-500 bg-white drop-shadow focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                      type="button" @click="activator">
                    <icons-kebab-menu/>
                  </button>
                </template>

                <template #content="{ activator }">
                  <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <button class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              type="button"
                              @click="selectedTransaction = trx; refreshInputAmount?.setInputAmount(); modalFormTransaction?.show(); activator()">Edit</button>
                    </li>
                    <li>
                      <button class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              type="button" @click="onDelete(trx.id); activator()">Delete</button>
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
import {Vue3Lottie} from "vue3-lottie";
import EmptyJSON from '~/assets/lottie/empty.json'

import {initDropdowns} from "flowbite";
import {endOfToday, format, parseISO, startOfMonth,} from 'date-fns'
import {capitalizeFirstLetter, checkAuth, currencyIDRFormatter, onSignOut} from "~/utils/functions";
import {Category, EditableTransaction, ElementEvent, Transaction} from "~/utils/types";
import FormTransaction from "~/components/FormTransaction.vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import ExpensesStructureChart from "~/components/ExpensesStructureChart.vue";
import DebtPercentageByIncome from "~/components/DebtPercentageByIncome.vue";
import {toast} from "vue3-toastify";
import {useCategories} from "~/composables/categories";
import {useCircleUsers} from "~/composables/circles";
import {useTransactions} from "~/composables/transactions";
import FormCategory from "~/components/FormCategory.vue";

const searchKey = ref<string>('')
const filterDate = ref<string>('this month')
const startFilterDate = ref<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd HH:mm'))
const endFilterDate = ref<string>(format(endOfToday(), 'yyyy-MM-dd HH:mm'))
const selectedTransaction = ref<EditableTransaction | undefined>()
const categories = useCategories()
const $circleUsers = useCircleUsers()
const $transactions = useTransactions()

let modalFormTransaction: ElementEvent | null = null
let modalFormCategory: ElementEvent | null = null
let modalConfDelete: ElementEvent | null = null
let refreshInputAmount: any = null

const selectedCircle = computed(() => $circleUsers.value.selected)
const selectedCategories = computed(() => categories.value.data.filter((cat: Category) => cat.checked).map((e) => e.id))

definePageMeta({
  title: "Transactions",
  layout: 'heading',
});

onMounted(() => {
  initDropdowns()
  checkAuth()
})

const {
  data: transactions,
  error: errorFetchTransactions,
  pending: isLoading,
  refresh: refreshTrx,
} = await useFetch('/api/transactions', {
  query: {
    key: searchKey,
    startDate: startFilterDate,
    endDate: endFilterDate,
    categoryIds: selectedCategories
  },
  server: false,
  immediate: false,
  onRequest({request, response}) {
    $transactions.value.isLoading = true
  },
  onResponse: (context) => {
    $transactions.value.isLoading = false

    if (context.response.status === 401) {
      toast.error(context.response.statusText);

      onSignOut()
    }
  },
  watch: [selectedCategories, selectedCircle]
})


function onSearchTransactions(value: string) {
  searchKey.value = value;
}

async function onDelete(trxId: String) {
  $transactions.value.isLoading = true
  const {status} = await useFetch('/api/transactions/delete.transaction', {
    query: {
      id: trxId,
      secretPin: localStorage.getItem('secretPin')
    },
  })

  if (status.value === 'success') {
    resetAllIsEditMode()
    selectedTransaction.value = undefined

    await refreshTrx()
  }

  $transactions.value.isLoading = false
}

async function onUpdate(trx: any) {
  $transactions.value.isLoading = true

  const currentRow = selectedTransaction.value

  if (currentRow?.amount && currentRow.description && currentRow.id && currentRow.date && currentRow.categoryId) {
    const {status} = await useFetch('/api/transactions/update.transaction', {
      method: 'POST',
      body: JSON.stringify({
        id: currentRow.id,
        amount: +currentRow.amount,
        description: currentRow.description,
        date: currentRow.date,
        categoryId: currentRow.categoryId,
        secretPin: localStorage.getItem('secretPin')
      })
    })

    if (status.value === 'success') {
      await refreshTrx()
    }
  }

  $transactions.value.isLoading = false
}

function onDoubleClickRow(trx: any) {

  if (selectedTransaction.value && transactions.value) {
    const index = transactions.value.indexOf(selectedTransaction.value) as number
    transactions.value.at(index).isEditMode = false;
  }

  // trx.date = format(parseISO(trx.date), 'dd/MM/yyyy')
  selectedTransaction.value = trx
  trx.isEditMode = true;
}

function resetAllIsEditMode() {
  transactions.value!.forEach((val: any) => val.isEditMode = false)
}


</script>

<style lang="scss">
.dp-custom-calendar {
    
  overflow: visible;
  .dp__calendar_item {
    border: 1px solid var(--dp-border-color-hover);
  }
}
</style>