<template>
  <div>
    <form ref="form" class="space-y-6">
      <div>
        <label for="description"
               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
        <input v-model="formTransaction.description" type="text" name="description" id="description"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
               placeholder="Example: Makan Siang" required>
      </div>

      <div>
        <label for="datepicker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
        <VueDatePicker v-model="formTransaction.date" name="datepicker" id="datepicker" locale="id-ID" format="dd/MM/yyyy"
                       :enable-time-picker="false" placeholder="Select Date"
                       auto-apply/>
      </div>
      <div v-if="!isLoadingCategory">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
        <div v-for="category in categories" class="flex items-center mb-4">
          <input v-model="formTransaction.categoryId" :id="`radio-${category.id}`" type="radio" :value="category.id"
                 :name="`radio-${category.id}`"
                 class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
          <label :for="`radio-${category.id}`" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{{
              category.name
            }}</label>
        </div>
      </div>
      <div>
        <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
        <input v-model="formTransaction.amount" ref="inputRef" name="amount" id="amount"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
               type="text"
               placeholder="Example: 20000" required/>
      </div>

      <button type="button"
              :disabled="isLoadingSubmit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click="onSave">
        <span v-if="isLoadingSubmit">
          <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
          Loading...
        </span>
        <span v-else>Save</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {useCurrencyInput} from 'vue-currency-input'
import {watchDebounced} from "@vueuse/shared";
import {EditableTransaction, Transaction} from "~/utils/types";


const props = defineProps({
  transaction: {
    type: Object as PropType<EditableTransaction> | null,
  },
})

const isLoadingSubmit = ref<boolean>(false)
const formTransaction = ref<{
  description: string,
  amount: number | null,
  categoryId: number | null,
  date: string,
}>({
  description: '',
  amount: null,
  categoryId: null,
  date: '',
})
const {inputRef} = useCurrencyInput({
  currency: 'IDR',
  locale: 'id-ID',
  precision: 0,
})
const emit = defineEmits(['on-success', 'on-failed', 'update:modelValue'])
const {data: categories, error, pending: isLoadingCategory}: any = await useFetch('/api/categories', {})

watchDebounced(formTransaction.value, (value) => emit('update:modelValue', value), {debounce: 1000}) // Vue 2: emit('input', value)

watch(() => props.transaction, (newVal, oldVal) => {
  if (newVal != oldVal) {
    formTransaction.value = {
      description: newVal?.description ?? '',
      amount: newVal?.amount ?? null,
      categoryId: newVal?.categoryId ?? null,
      date: newVal?.date ?? '',
    }
  }
})

async function onSave() {
  isLoadingSubmit.value = true

  const currentForm = formTransaction.value

  if (currentForm.amount && currentForm.description && currentForm.categoryId && currentForm.date) {

    // Create new Transaction
    if (!props.transaction) {
      const {data: result, status} = await useFetch('/api/transactions/create.transaction', {
        method: 'POST',
        body: JSON.stringify({
          description: formTransaction.value.description,
          amount: formTransaction.value.amount,
          categoryId: formTransaction.value.categoryId,
          date: formTransaction.value.date,
          secretPin: localStorage.getItem('secretPin')
        })
      })

      if (status.value === 'success') {
        formTransaction.value = {
          description: '',
          amount: null,
          categoryId: null,
          date: '',
        }

        emit('on-success')
      }
    } else {
      const {data: result, status} = await useFetch('/api/transactions/update.transaction', {
        method: 'POST',
        body: JSON.stringify({
          description: formTransaction.value.description,
          amount: formTransaction.value.amount,
          categoryId: formTransaction.value.categoryId,
          date: formTransaction.value.date,
          id: props.transaction.id,
          secretPin: localStorage.getItem('secretPin')
        })
      })

      if (status.value === 'success') {
        formTransaction.value = {
          description: '',
          amount: null,
          categoryId: null,
          date: '',
        }

        emit('on-success')
      }
    }

    isLoadingSubmit.value = false
  }
}
</script>

<style scoped>

</style>
