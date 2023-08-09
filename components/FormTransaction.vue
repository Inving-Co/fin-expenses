<template>
  <div>
    <form ref="form" class="space-y-6">
      <div class="flex gap-2">
        <div>
          <label for="description"
                 class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <input v-model="formTransaction.description" type="text" name="description" id="description"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                 placeholder="Example: Makan Siang" required
                 @keyup.enter="onSave" >
        </div>
        <div>
          <label for="datepicker" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
          <VueDatePicker v-model="formTransaction.date" name="datepicker" id="datepicker" locale="id-ID" format="dd/MM/yyyy"
                         input-class-name="dp-custom-input"
                         hide-input-icon
                         :enable-time-picker="false" placeholder="Select Date"
                         auto-apply/>
        </div>
      </div>

      <div>
        <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
        <input ref="inputRef" name="amount" id="amount"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
               type="text"
               placeholder="Example: 20000" required  @keyup.enter="onSave" @input="formTransaction.amount = $event.target.value"/>
      </div>
      <div v-if="!isLoadingCategory">
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category</label>
        <div v-for="category in categories" class="inline-flex items-center mb-4 mx-2">
          <input v-model="formTransaction.categoryId" :id="`radio-${category.id}`" type="radio" :value="category.id"
                 class="w-4 h-4 hidden peer text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                 :name="`radio-${category.id}`" required
                 @keyup.enter="onSave">
          <label :for="`radio-${category.id}`" class="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div class="text-lg font-semibold">
                {{ capitalizeFirstLetter(category.name) }}
            </div>
          </label>
        </div>
      </div>

      <button type="button"
              :disabled="isLoadingSubmit"
              class="w-full text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
import {useCategories} from "~/composables/categories";


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
const categories = useCategories()


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

    inputRef.value.value = ''

    isLoadingSubmit.value = false
  }
}
</script>

<style lang="scss">
//bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white
.dp-custom-input {
  background: #F9FAFB;
  border-color: #D1D5DB;
  color: gray;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.625rem;
  display: block;
  width: 100%;
  border-radius: 0.5rem;
}
</style>
