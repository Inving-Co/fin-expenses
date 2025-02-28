<template>
  <general-modal id="modal-form-transaction" title="Form Transaction" @on-mounted="modalFormTransaction = $event">
    <template #body>
      <form-transaction :transaction="selectedTransaction"
                        @on-mounted="refreshInputAmount = $event"
                        @on-success="modalFormTransaction?.hide(); refreshTrx(); selectedTransaction = undefined"
                        @add-category="modalFormTransaction?.hide(); modalFormCategory?.show();"/>
    </template>
  </general-modal>
  
  <general-modal id="modal-form-category-trx" title="Form Category" 
    @on-mounted="modalFormCategory = $event"
    @on-modal-closed="refreshInputAmount?.setInputAmount(); modalFormTransaction?.show();">
    <template #body>
      <form-category
          source="transactions"
          @category-created="onCategoryCreated"
          @category-updated="onCategoryUpdated"/>
    </template>
  </general-modal>

  <general-modal id="modal-confirmation-delete-records" title="Confirmation" @on-mounted="modalConfDelete = $event">
    <template #body>
      <p class="text-gray-500">Are you sure you want to delete this data?</p>

      <div class="flex mt-4">
        <button
            type="button"
            class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            @click="modalConfDelete?.hide()">No, Cancel
        </button>
        <button
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click="onDelete(selectedTransaction.id); modalConfDelete?.hide()">Yes, Delete
        </button>
      </div>
    </template>
  </general-modal>

  <general-modal id="modal-budget-plan" classModal="max-w-lg" title="Budgeting" @on-mounted="modalBudgeting = $event">
    <template #body>
      <client-only>
        <form-budgeting/>
      </client-only>
    </template>
  </general-modal>

  <div v-if="errorFetchTransactions">{{ errorFetchTransactions.statusMessage }}</div>
  <div v-show="!errorFetchTransactions" class="relative sm:rounded-lg">
    <div class="flex flex-wrap justify-between items-center">
      <div class="flex flex-col my-6">
        <div class="flex">
          <div class="text-2xl text-gray-500">My Financial Records</div>
          <div class="ml-2 mr-1" @click.prevent="toggleIsAmountVisible()">
            <span v-if="isAmountVisible"><icons-eye-visible class="w-6 h-6 cursor-pointer text-gray-500"/></span>
            <span v-else><icons-eye-invisible class="w-6 h-6 cursor-pointer text-gray-500"/></span>
          </div>
        </div>
        <div class="text-md mt-2 text-gray-400">Records and Plan your next move for a better week</div>
      </div>
      <button type="button"
              class="h-[38px] inline-flex w-full mb-4 sm:w-1/6 sm:mb-0 items-center justify-center text-white bg-primary-500 dark:bg-primary-700 dark:text-white drop-shadow-sm hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700"
              @click="modalBudgeting?.show()">
        <icons-plan class="mr-2"/>
        Plan
      </button>
    </div>
    <div v-if="transactions" class="max-h-1/4 w-full gap-4 md:flex justify-center mb-8 mt-2">
      <client-only>

        <div class="md:w-1/2 h-full w-full flex-grow justify-between mt-4 md:mt-0">
          <div class="flex flex-col mb-4 gap-4">
            <div class="flex w-full flex-col lg:flex-row gap-4">
              <expenses-structure-chart class="w-full lg:w-4/12" :label-time="filterDate"
                                        :transactions="chartTransactions"/>
              <budget-plan-chart class="w-full lg:w-8/12" :transactions="chartTransactions"
                                @category-selected="onCategorySelected"
                                @reset-filter="onResetFilter"/>
            </div>
            <div class="flex flex-col lg:flex-row gap-4">
              <cash-flow-chart class="w-full" :label-time="filterDate" :transactions="chartTransactions"/>
              <debt-percentage-by-income class="w-full" :label-time="filterDate" :transactions="chartTransactions"/>
            </div>
          </div>
        </div>
      </client-only>
    </div>
    <div class="sm:flex p-4 justify-center sm:rounded-t-lg sm:justify-between bg-white dark:bg-gray-700"
         style="box-shadow: 0 10px 12px rgba(0, 0, 0, 0.1)">
      <div class="flex flex-wrap gap-2 items-center mb-4">
        <button
            class="hidden md:inline-flex h-[38px] items-center text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            type="button" @click="toggleModal(true)">
          <icons-plus class="inline w-4 h-4 mr-1"/>
          Create
        </button>

        <dropdowns-filter-dates
            @on-filter-changed="startFilterDate = $event.start; endFilterDate = $event.end; filterDate = $event.label"/>
        <dropdowns-filter-categories />

        <button
            class="h-[38px] inline-flex items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            type="button" @click="(_) => refreshTrx()" :disabled="isLoading">
          <icons-circular-indicator v-if="isLoading" class="inline w-4 h-4 mr-1 text-white animate-spin"/>
          <icons-refresh v-else class="inline w-4 h-4 mr-1"/>
          Refresh
        </button>
      </div>
      <div class="flex gap-3 mt-3 sm:mt-0 flex-col lg:flex-row">
        <div
            class="h-[38px] inline-flex items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
          <label class="my-2 relative inline-flex items-center cursor-pointer"
                 @click.prevent="toggleCheckReceiveTransferCategories()">
            <input type="checkbox" :checked="isIncludeTransferReceive" class="sr-only peer">
            <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600">
            </div>
            <span class="ml-3 text-sm whitespace-nowrap text-gray-900 dark:text-gray-300">Include Transfer</span>
          </label>
        </div>
        <div class="mt-2 sm:mt-0">
          <label for="table-search-transactions" class="sr-only">Search</label>
          <div class="relative">
            <div class="z-10 absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                   xmlns="http://www.w3.org/2000/svg"
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
    </div>
    <div v-if="transactions?.length === 0"
         class="flex flex-col text-2xl justify-center items-center align-center top-0 left-0 right-0 bottom-0 z-50 font-semibold p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full">
      <div class="w-full sm:w-1/5 mt-5 text-center mb-48">
        <vue3-lottie :animationData="EmptyJSON"/>
        <p class="text-gray-500 dark:text-gray-400">No transactions found.</p>
      </div>
    </div>
    <div v-else-if="!$circleUsers.isLoading && !$categories.isLoading"
         class="mb-16 sm:mb-12 relative overflow-x-auto drop-shadow-soft" style="height: 500px !important">
      <table v-if="!$isMobile()" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 sticky top-0 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-3 py-2">
            Date
          </th>
          <th scope="col" class="px-3 py-2">
            Description
          </th>
          <th scope="col" class="px-3 py-2">
            Amount
          </th>
          <th scope="col" class="px-3 py-2">
            Category
          </th>
          <th scope="col" class="px-3 py-2 w-20">
            Actions
          </th>
        </tr>
        </thead>
        <tbody class="overflow-y-scroll">
        <tr v-for="trx in transactions"
            :class="`${isRowTransferReceive(trx)} hover:bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700`">
          <th scope="row" class="px-3 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ format(parseISO(trx.date), 'dd/MM/yyyy') }}
          </th>
          <td class="px-3 py-2">
            {{ capitalizeFirstLetter(trx.description) }}
          </td>
          <td class="px-3 py-2">
            {{ currencyIDRFormatter($circleUsers.selected?.currency, trx.amount) }}
          </td>
          <td class="px-3 py-2">
            {{ capitalizeFirstLetter(trx.category.name) }}
          </td>
          <td class="px-3 py-2">
            <div class="flex gap-1">
              <button class="p-1 text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400"
                      @click="selectedTransaction = {...trx}; modalFormTransaction?.show()">
                <icons-edit class="w-4 h-4"/>
              </button>
              <button class="p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400"
                      @click="selectedTransaction = trx; modalConfDelete?.show()">
                <icons-trash class="w-4 h-4"/>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else>
        <div v-for="(trx, index) of transactions ?? []"
             :class="`${isRowTransferReceive(trx)} w-full my-3 p-6 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700`">
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
  <general-floating-action-button @click="toggleModal(true)" />
</template>

<script setup lang="ts">
import {Vue3Lottie} from "vue3-lottie";
import EmptyJSON from '~/assets/lottie/empty.json'

import {initDropdowns} from "flowbite";
import {endOfToday, format, parseISO, startOfMonth,} from 'date-fns'
import {capitalizeFirstLetter, checkAuth, currencyIDRFormatter, onSignOut} from "~/utils/functions";
import {Category, EditableRecord, ElementEvent, Record} from "~/utils/types";
import FormTransaction from "~/components/FormTransaction.vue";
import '@vuepic/vue-datepicker/dist/main.css'
import ExpensesStructureChart from "~/components/ExpensesStructureChart.vue";
import DebtPercentageByIncome from "~/components/DebtPercentageByIncome.vue";
import {toast} from "vue3-toastify";
import {useCategories} from "~/composables/categories";
import {useCircleUsers} from "~/composables/circles";
import {useTransactions} from "~/composables/transactions";
import FormCategory from "~/components/FormCategory.vue";
import BudgetPlanChart from "~/components/BudgetPlanChart.vue";

const searchKey = ref<string>('')
const filterDate = ref<string>('this month')
const startFilterDate = ref<string>(format(startOfMonth(new Date()), 'yyyy-MM-dd HH:mm'))
const endFilterDate = ref<string>(format(endOfToday(), 'yyyy-MM-dd HH:mm'))
const selectedTransaction = ref<EditableRecord | undefined>()
const $categories = useCategories()
const $circleUsers = useCircleUsers()
const $transactions = useTransactions()
const isAmountVisible = useAmountVisibility()

let modalFormTransaction: ElementEvent | null = null
let modalFormCategory: ElementEvent | null = null
let modalConfDelete: ElementEvent | null = null
let modalBudgeting: ElementEvent | null = null
let refreshInputAmount: any = null

const selectedCircle = computed(() => $circleUsers.value.selected)
const selectedCategories = computed(() => $categories.value.data.filter((cat: Category) => cat.checked).map((e) => e.id))

definePageMeta({
  title: "Transactions",
  layout: 'heading',
});

onMounted(() => {
  initDropdowns()
})

const chartTransactions = computed(() => transactions.value?.filter((trx: any) => trx.category.type !== 'receive' && trx.category.type !== 'transfer'))
const isIncludeTransferReceive = computed(() => $categories.value.data?.filter((e) => (e.type === 'receive' || e.type === 'transfer') && e.checked).length > 0)

const {
  data: transactions,
  error: errorFetchTransactions,
  pending: isLoading,
  refresh: refreshTrx,
} = await useFetch('/api/records', {
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
    } else {
      $transactions.value.data = context.response._data
    }
  },
  watch: [selectedCategories, selectedCircle]
})

function toggleIsAmountVisible() {
  const val = !isAmountVisible.value
  localStorage.setItem('is-amount-visible', `${val}`)

  isAmountVisible.value = val
}

function isRowTransferReceive(row: any): string {
  if (row.category?.type === 'receive' || row.category?.type === 'transfer') {
    return 'bg-gray-50 dark:bg-gray-900';
  }

  return 'bg-white'
}

function toggleCheckReceiveTransferCategories() {
  for (let i = 0; i < $categories.value.data.length; i++) {
    const category = $categories.value.data[i];
    if (category.type === 'receive' || category.type === 'transfer') {
      category.checked = !category.checked;
    }
  }

  const values = $categories.value.data.filter((cat: Category) => cat.checked).map((cat: Category) => cat.id)
  const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires

  document.cookie = `${selectedCircle.value?.id}-current-filtered-categories-selected=${values.join(',')}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
}

function onSearchTransactions(value: string) {
  searchKey.value = value;
}

async function onDelete(trxId: String) {
  $transactions.value.isLoading = true
  const {status} = await useFetch('/api/records/delete.record', {
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
    const {status} = await useFetch('/api/records/update.record', {
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

function toggleModal(create: boolean) {
  if (create) {
    resetAllIsEditMode()
    selectedTransaction.value = undefined
    refreshInputAmount?.setInputAmount()
    modalFormTransaction?.show()
  }
}

function onCategorySelected(category: any) {
  // Clear all category selections first
  $categories.value.data.forEach((cat: any) => {
    cat.checked = false;
  });
  
  // Select only the clicked category
  const selectedCategory = $categories.value.data.find((cat: any) => cat.id === category.id);
  if (selectedCategory) {
    selectedCategory.checked = true;
    
    // Update cookie and emit filter change
    const values = $categories.value.data.filter((cat: any) => cat.checked).map((cat: any) => cat.id);
    document.cookie = `${$circleUsers.value.selected?.id}-current-filtered-categories-selected=${values.join(',')}`;
    
    // Trigger filter update
    onFilterCategoriesChanged(values);
  }
}

function onResetFilter() {
  // Update cookie with reset state
  const values = $categories.value.data.filter((cat: any) => cat.checked).map((cat: any) => cat.id);
  document.cookie = `${$circleUsers.value.selected?.id}-current-filtered-categories-selected=${values.join(',')}`;
  
  // Trigger filter update
  onFilterCategoriesChanged(values);
}

function onCategoryCreated() {
  modalFormCategory?.hide()
  refreshInputAmount?.setInputAmount()
  modalFormTransaction?.show()
}

function onCategoryUpdated() {
  modalFormCategory?.hide()
  refreshInputAmount?.setInputAmount()
  modalFormTransaction?.show()
}

function onFilterCategoriesChanged(values: any[]) {
  refreshTrx()
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
