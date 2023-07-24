<template>
  <div>
    <form ref="form" class="space-y-6">
      <div>
        <label for="Description"
               class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
        <input v-model="formTransaction.description" type="text" name="Description" id="Description"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
               placeholder="Example: Makan Siang" required>
      </div>

      <div>
        <label for="datepicker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
        <VueDatePicker v-model="formTransaction.date" name="datepicker" locale="id-ID" format="dd/MM/yyyy"
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
        <label for="Amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
        <input v-model="formTransaction.amount" ref="inputRef" name="Amount"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
               type="text"
               placeholder="Example: 20000" required/>
      </div>

      <button type="button"
              :disabled="isLoadingSubmit"
              class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click="onSave">
        <span v-if="isLoadingSubmit">
          <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 text-white animate-spin"
               viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"/>
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"/>
          </svg>
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

const isLoadingSubmit = ref<boolean>(false)

const props = defineProps({
  transaction: {
    type: Object as PropType<EditableTransaction> | null,
  },
})

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
