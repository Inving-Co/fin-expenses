<template>
  <div>
    <form ref="form" class="space-y-6">
      <div>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Type Transaction <span
            class="text-red-500">*</span></label>
        <div class="flex gap-2">
          <div class="flex items-center justify-center">
            <input v-model="typeTransaction" type="radio" id="expenses" :value="TypeFormTransaction.expenses"
              name="typeTransaction" required
              class="focus:ring-primary-500 dark:focus:ring-primary-600 text-primary-600 bg-gray-100 border-gray-300" />
            <label for="expenses" class="ml-2">
              <span class="text-lg font-semibold text-gray-800 dark:text-gray-300">Records</span>
            </label>
          </div>
          <div class="ml-6 flex items-center justify-center">
            <input v-model="typeTransaction" type="radio" id="transfer" :value="TypeFormTransaction.transfer"
              name="typeTransaction" required
              class="focus:ring-primary-500 dark:focus:ring-primary-600 text-primary-600 bg-gray-100 border-gray-300" />
            <label for="transfer" class="ml-2">
              <span class="text-lg font-semibold text-gray-800 dark:text-gray-300">Transfer</span>
            </label>
          </div>
        </div>
      </div>

      <div v-if="typeTransaction == TypeFormTransaction.expenses" class="space-y-6">
        <div class="flex gap-2">
          <div>
            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description
              <span class="text-red-500">*</span></label>

            <input v-model="formTransaction.description" type="text" name="description" id="description"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="Example: Makan Siang" required @keyup.enter="onSaveExpenses">
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date <span
                class="text-red-500">*</span></label>
            <VueDatePicker v-model="formTransaction.date" name="datepicker" id="datepicker" locale="id-ID"
              format="dd/MM/yyyy" input-class-name="dp-custom-input" hide-input-icon :enable-time-picker="false"
              placeholder="Select Date" auto-apply position="bottom" :close-on-scroll="false" :teleport="true"
              :transitions="{ open: '', close: '' }" menu-class-name="date-picker-menu" :dark="isDarkMode" />
          </div>
        </div>

        <div>
          <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount <span
              class="text-red-500">*</span></label>
          <general-currency-field v-model="formTransaction.amount" name="amount" @keyup.enter="onSaveExpenses" />
        </div>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Category <span class="text-red-500">*</span>
        </label>
        <div
          class="h-10 w-10 inline-flex align-bottom mx-2 p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
          style="margin-top: 0" @click="emit('add-category')">
          <icons-plus />
        </div>
        <div
          v-for="(category, index) of $categories.data.filter((cat: any) => cat.type !== 'receive' && cat.type !== 'transfer')"
          class="relative h-10 inline-flex items-center mb-4 mx-3">
          <input v-model="formTransaction.categoryId" :id="`radio-${category.id}`" type="radio" :value="category.id"
            class="w-4 h-4 hidden peer text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            :name="`radio-${category.id}`" required @keyup.enter="onSaveExpenses">
          <label :for="`radio-${category.id}`"
            class="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="text-lg font-semibold">
              {{ capitalizeFirstLetter(category.name) }}
            </div>
          </label>
        </div>
        <div v-if="$circleUsers.selected?.assets">
          <label for="asset" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Asset</label>
          <general-dropdown id="dropdownAsset">
            <template #trigger="{ activator }">
              <button name="asset"
                class="h-[38px] flex w-full justify-between items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                type="button" @click="activator">
                {{ formTransaction.asset ? `${capitalizeFirstLetter(formTransaction.asset?.name)}
                ${formTransaction.asset?.platform ? '(' : ''} ${capitalizeFirstLetter(formTransaction.asset?.platform)}
                ${formTransaction.asset?.platform ? ')' : ''}` : 'Select Asset' }}
                <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>
            </template>
            <template #content="{ activator }">
              <ul class="py-1 w-full text-sm text-gray-700 dark:text-gray-200">
                <li v-for="(asset, index) of $circleUsers.selected?.assets" class="mx-3 my-2">
                  <div class="flex justify-between">
                    <div class="flex items-center pl-3">
                      <input v-if="!isSetDefaultAsset" v-model="formTransaction.asset" :id="`${index}-asset-radio`"
                        type="radio" :value="asset" name="list-asset-radio"
                        class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <label :for="`${index}-asset-radio`"
                        class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                          `${capitalizeFirstLetter(asset.name)} ${asset?.platform ? '(' : ''}
                        ${capitalizeFirstLetter(asset.platform)} ${asset?.platform ? ')' : ''}` }}</label>
                    </div>
                    <icons-select-outline
                      v-if="isSetDefaultAsset && asset.id !== $circleUsers.selected?.circleSettings?.defaultAssetId"
                      class="ml-4 mr-2 cursor-pointer"
                      @click="onSetDefaultAsset($circleUsers.selected?.circleSettingId!, asset.id)" />
                    <icons-check
                      v-if="isSetDefaultAsset && asset.id === $circleUsers.selected?.circleSettings?.defaultAssetId"
                      class="ml-4 mr-2 cursor-pointer"
                      @click="onSetDefaultAsset($circleUsers.selected?.circleSettingId!, undefined)" />
                  </div>
                </li>
                <li v-if="$circleUsers.selected?.assets.length > 0" class="mx-3 my-2">
                  <button type="button"
                    class="w-full mt-4 text-gray-500 hover:text-white bg-gray-100 hover:bg-primary-500 border-transparent focus:border-transparent focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:bg-gray-600 dark:hover:bg-primary-700"
                    @click="isSetDefaultAsset = !isSetDefaultAsset">
                    <span>{{ !isSetDefaultAsset ? 'Set Default Asset' : 'Back' }}</span>
                  </button>
                </li>
              </ul>
            </template>
          </general-dropdown>
        </div>
      </div>
      <div v-else-if="typeTransaction == TypeFormTransaction.transfer" class="space-y-6">
        <div>
          <label for="asset" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Origin Asset<span
              class="text-red-500">*</span></label>
          <general-dropdown id="dropdownOriginAsset">
            <template #trigger="{ activator }">
              <button name="asset"
                class="h-[38px] flex w-full justify-between items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                type="button" @click="activator">
                {{ formTransfer.originAsset ? `${capitalizeFirstLetter(formTransfer.originAsset?.name)}
                ${formTransfer.originAsset?.platform ? '(' : ''}
                ${capitalizeFirstLetter(formTransfer.originAsset?.platform)} ${formTransfer.originAsset?.platform ? ')'
                : ''}` : 'Select Asset' }}
                <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>
            </template>
            <template #content="{ activator }">
              <ul class="py-1 w-full text-sm text-gray-700 dark:text-gray-200">
                <li v-for="(asset, index) of $circleUsers.selected?.assets" class="mx-3 my-2">
                  <div class="flex justify-between">
                    <div class="flex items-center pl-3">
                      <input v-if="!isSetDefaultAsset" v-model="formTransfer.originAsset"
                        :id="`${index}-origin-asset-radio`" type="radio" :value="asset"
                        :name="`${index}-origin-asset-radio`"
                        class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <label :for="`${index}-origin-asset-radio`"
                        class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                          `${capitalizeFirstLetter(asset.name)} ${asset?.platform ? '(' : ''}
                        ${capitalizeFirstLetter(asset.platform)} ${asset?.platform ? ')' : ''}` }}</label>
                    </div>
                  </div>
                </li>
              </ul>
            </template>
          </general-dropdown>
        </div>

        <div>
          <label for="asset" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Destination
            Asset<span class="text-red-500">*</span></label>
          <general-dropdown id="dropdownDestinationAsset">
            <template #trigger="{ activator }">
              <button name="asset"
                class="h-[38px] flex w-full justify-between items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                type="button" @click="activator">
                {{ formTransfer.destinationAsset ? `${capitalizeFirstLetter(formTransfer.destinationAsset?.name)}
                ${formTransfer.destinationAsset?.platform ? '(' : ''}
                ${capitalizeFirstLetter(formTransfer.destinationAsset?.platform)}
                ${formTransfer.destinationAsset?.platform ? ')' : ''}` : 'Select Asset' }}
                <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 10 6">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4" />
                </svg>
              </button>
            </template>
            <template #content="{ activator }">
              <ul class="py-1 w-full text-sm text-gray-700 dark:text-gray-200">
                <li v-for="(asset, index) of $circleUsers.selected?.assets" class="mx-3 my-2">
                  <div class="flex justify-between">
                    <div class="flex items-center pl-3">
                      <input v-if="!isSetDefaultAsset" v-model="formTransfer.destinationAsset"
                        :id="`${index}-destination-asset-radio`" type="radio" :value="asset"
                        :name="`${index}-destination-asset-radio`"
                        class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                      <label :for="`${index}-destination-asset-radio`"
                        class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                          `${capitalizeFirstLetter(asset.name)} ${asset?.platform ? '(' : ''}
                        ${capitalizeFirstLetter(asset.platform)} ${asset?.platform ? ')' : ''}` }}</label>
                    </div>
                  </div>
                </li>
              </ul>
            </template>
          </general-dropdown>
        </div>

        <div>
          <label for="amount-transfer" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount <span
              class="text-red-500">*</span></label>
          <general-currency-field v-model="formTransfer.amount" name="amount-transfer" @keyup.enter="onSaveTransfer" />
        </div>
        <div v-if="typeTransaction == TypeFormTransaction.transfer">
          <label for="amount-transfer" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Charge <span
              class="text-red-500"></span></label>
          <general-currency-field v-model="formTransfer.charge" name="charge-amount-transfer"
            @keyup.enter="onSaveTransfer" />
        </div>
      </div>
      <button v-if="typeTransaction == TypeFormTransaction.expenses" type="button"
        :disabled="isLoadingSubmit || !isButtonExpensesEnabled"
        :class="`${!isButtonExpensesEnabled ? 'bg-gray-500' : 'bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700'} w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800`"
        @click="onSaveExpenses">
        <span v-if="isLoadingSubmit">
          <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
          Loading...
        </span>
        <span v-else>Save</span>
      </button>
      <button v-else-if="typeTransaction == TypeFormTransaction.transfer" type="button"
        :class="`${!isButtonTransferEnabled ? 'bg-gray-500' : 'bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700'} w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800`"
        @click="onSaveTransfer">
        <span v-if="isLoadingSubmit">
          <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
          Loading...
        </span>
        <span v-else>Save</span>
      </button>
    </form>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Category</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete "{{ selectedCategory?.name }}"? This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <button type="button"
            class="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            @click="showDeleteModal = false">
            No, Cancel
          </button>
          <button type="button"
            class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 dark:hover:bg-red-700"
            @click="confirmDelete">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { watchDebounced } from "@vueuse/shared";
import { Category, Record } from "~/utils/types";
import { useCategories } from "~/composables/categories";
import { toast } from "vue3-toastify";
import { useAuth } from "~/composables/auth";
import { useCircleUsers } from "~/composables/circles";
import { Asset } from '../utils/types';

enum TypeFormTransaction {
  expenses, transfer
}

const props = defineProps({
  transaction: {
    type: Object as PropType<Record | undefined>,
  },
})

const asset = computed(() => {
  if (!$circleUsers.value.selected?.circleSettings) return null
  return $circleUsers.value.selected?.assets?.findLast((e) => e.id === $circleUsers.value.selected?.circleSettings.defaultAssetId) ?? null
})

const $circleUsers = useCircleUsers()
const isDarkMode = useDarkMode()

const typeTransaction = ref<TypeFormTransaction>(TypeFormTransaction.expenses)
const isSetDefaultAsset = ref<boolean>(false)
const isLoadingSubmit = ref<boolean>(false)
const formTransaction = ref<{
  description: string,
  amount: number | null,
  categoryId: string | null,
  date: string,
  asset: Asset | null
}>({
  description: '',
  amount: null,
  categoryId: null,
  date: '',
  asset: null
})

const formTransfer = ref({
  originAsset: undefined,
  destinationAsset: undefined,
  amount: 0,
  charge: undefined
})

const emit = defineEmits(['on-success', 'on-failed', 'update:modelValue', 'add-category', 'on-mounted'])

const auth = useAuth()
const $categories = useCategories()

watchDebounced(formTransaction.value, (value) => emit('update:modelValue', value), { debounce: 1000 })

watch(() => props.transaction, (newVal, oldVal) => {
  if (newVal != oldVal) {
    formTransaction.value = {
      description: newVal?.description ?? '',
      amount: newVal?.amount ?? null,
      categoryId: newVal?.categoryId ?? null,
      date: newVal?.date ?? '',
      asset: newVal?.asset ?? asset.value
    }
  }
})

watchEffect(() => {
  formTransaction.value.asset = asset.value
})

const isButtonExpensesEnabled = computed(() => {
  const description = formTransaction.value.description
  const amount = formTransaction.value.amount
  const date = formTransaction.value.date
  const categoryId = formTransaction.value.categoryId

  return (!!description && !!amount && !!date && !!categoryId)
})

const isButtonTransferEnabled = computed(() => {
  return formTransfer.value.originAsset && formTransfer.value.destinationAsset && formTransfer.value.amount > 0
})

async function onSaveTransfer() {
  isLoadingSubmit.value = true

  const { data: result, status } = await useFetch('/api/assets/transfer.asset', {
    method: 'POST',
    body: JSON.stringify({
      originAssetId: formTransfer.value?.originAsset?.id,
      destinationAssetId: formTransfer.value?.destinationAsset?.id,
      amount: formTransfer.value?.amount,
      charge: formTransfer.value?.charge
    })
  })

  if (status.value === 'success') {
    formTransfer.value = {
      originAsset: undefined,
      destinationAsset: undefined,
      amount: 0,
      charge: undefined
    }

    emit('on-success')
  }

  isLoadingSubmit.value = false
}

async function onSaveExpenses() {
  isLoadingSubmit.value = true

  const currentForm = formTransaction.value

  if (currentForm.amount && currentForm.description && currentForm.categoryId && currentForm.date) {
    // Create new Transaction
    if (!props.transaction) {
      const { data: result, status } = await useFetch('/api/records/create.record', {
        method: 'POST',
        body: JSON.stringify({
          description: formTransaction.value.description,
          amount: formTransaction.value.amount,
          categoryId: formTransaction.value.categoryId,
          date: formTransaction.value.date,
          currency: $circleUsers.value.selected?.currency,
          assetId: formTransaction.value.asset?.id
        })
      })

      if (status.value === 'success') {
        formTransaction.value = {
          description: '',
          amount: null,
          categoryId: null,
          date: '',
          asset: asset.value
        }

        emit('on-success')
      }
    } else {
      const { data: result, status } = await useFetch('/api/records/update.record', {
        method: 'POST',
        body: JSON.stringify({
          description: formTransaction.value.description,
          amount: formTransaction.value.amount,
          categoryId: formTransaction.value.categoryId,
          date: formTransaction.value.date,
          id: props.transaction.id,
          currency: $circleUsers.value.selected?.currency
        })
      })

      if (status.value === 'success') {
        formTransaction.value = {
          description: '',
          amount: null,
          categoryId: null,
          date: '',
          asset: asset.value
        }

        emit('on-success')
      }
    }

    isLoadingSubmit.value = false
  }
}

async function onSetDefaultAsset(circleSettingId: string, defaultAssetId: string | undefined) {
  const { error, status } = await useFetch(`/api/circleSettings/${circleSettingId}`, {
    method: 'PUT',
    body: JSON.stringify({
      defaultAssetId: defaultAssetId,
    }),
  })

  if (status.value === 'success') {
    $circleUsers.value?.refreshSelected($circleUsers.value.selected?.id)
  }

}

const showDeleteModal = ref(false)
const selectedCategory = ref<any>(null)

function showDeleteConfirm(category: any) {
  selectedCategory.value = category
  showDeleteModal.value = true
}

async function confirmDelete() {
  if (selectedCategory.value) {
    await onDeleteCategory(selectedCategory.value.id)
    showDeleteModal.value = false
    selectedCategory.value = null
  }
}

async function onDeleteCategory(categoryId: string) {
  const { error, status } = await useFetch('/api/categories/delete.category', {
    query: {
      id: categoryId,
    },
  })

  if (status.value === 'success') {
    $categories.value.data = $categories.value.data.filter((val: Category) => val.id !== categoryId)
  } else {
    toast.error(error.value?.statusMessage ?? '')
  }
}
</script>

<style>
.dp-custom-input {
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.625rem;
  width: 100%;
  border-radius: 0.5rem;
  background-color: rgb(249 250 251);
  border: 1px solid rgb(209 213 219);
  color: rgb(17 24 39);
}

.dp-custom-input:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  border-color: rgb(99 102 241);
}

:root {
  --dp-border-radius: 0.5rem;
  --dp-cell-border-radius: 0.375rem;
  --dp-common-padding: 0.5rem;
  --dp-menu-min-width: 260px;
}

.dp__arrow_top {
  top: 0px !important;
  right: 0px !important;
  margin: 0 auto !important
}

.dp__menu {
  position: absolute !important;
  width: var(--dp-menu-min-width);
  left: 0px !important;
  right: 0px !important;
  margin: 0 auto !important;
  margin-top: 4px;
  z-index: 999999;
  transform: none !important;
  transition: none !important;
}

.dp__outer_menu_wrap {
  position: absolute !important;
  width: var(--dp-menu-min-width);
  transform: none !important;
  transition: none !important;
}

.date-picker-menu {
  z-index: 999999999 !important;
}

.dark {
  .dp-custom-input {
    background-color: rgb(75 85 99);
    border-color: rgb(75 85 99);
    color: rgb(255 255 255);

    &::placeholder {
      color: rgb(156 163 175);
    }
  }
}
</style>
