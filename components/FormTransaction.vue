<template>
  <div>
    <form ref="form" class="space-y-6">
      <div class="flex gap-2">
        <div>
          <label for="description"
                 class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
          <input v-model="formTransaction.description" type="text" name="description" id="description"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                 placeholder="Example: Makan Siang" required @keyup.enter="onSave">
        </div>
        <div>
          <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
          <VueDatePicker v-model="formTransaction.date" name="datepicker" id="datepicker" locale="id-ID"
                         format="dd/MM/yyyy" input-class-name="dp-custom-input" hide-input-icon
                         :enable-time-picker="false"
                         placeholder="Select Date" auto-apply/>
        </div>
      </div>

      <div>
        <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
            <general-currency-field @on-change="formTransaction.amount = $event" @keyup.enter="onSave" />
      </div>
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Category <span v-if="auth?.userId"
                                                                                                 class="inline-flex cursor-pointer"
                                                                                                 @click="emit('edit-category'); isEditMode = !isEditMode">
          <icons-edit v-if="!isEditMode" class="h-4"/>
          <icons-close v-else class="h-4"/>
        </span>
      </label>
      <div v-if="!isEditMode"
           class="h-10 w-10 inline-flex align-bottom mx-2 p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
           style="margin-top: 0" @click="emit('add-category')">
        <icons-plus/>
      </div>
      <div v-else class="h-10 w-10 inline-flex mx-2 p-2" style="margin-top: 0"/>
      <div v-for="(category, index) of $categories.data" class="relative h-10 inline-flex items-center mb-4 mx-3">
        <div v-if="!category.edited">
          <div v-if="isEditMode && category.circleId">
            <icons-trash class="absolute -top-3 -left-2 w-5 h-5 rounded-md p-1 bg-red-500 text-white cursor-pointer"
                         @click="onDeleteCategory(category.id)"/>
            <icons-edit class="absolute -top-3 -right-2 w-5 h-5 rounded-md p-1 bg-purple-500 text-white cursor-pointer"
                        @click="category.edited = true"/>
          </div>
          <input v-model="formTransaction.categoryId" :id="`radio-${category.id}`" type="radio" :value="category.id"
                 class="w-4 h-4 hidden peer text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                 :name="`radio-${category.id}`" required @keyup.enter="onSave">
          <label :for="`radio-${category.id}`"
                 class="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="text-lg font-semibold">
              {{ capitalizeFirstLetter(category.name) }}
            </div>
          </label>
        </div>
        <div v-else class="relative align-bottom" style="margin-top: 0">
          <icons-check class="absolute -top-3 -right-2 w-5 h-5 rounded-md p-1 bg-green-500 text-white cursor-pointer"
                       @click="onUpdateCategory(index, category.id, category.name)"/>
          <input name="category-name" id="category-name" :value="category.name"
                 class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-20 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                 type="text" placeholder="Example: Food" required @input="category.name = $event.target.value"
                 v-on:keydown.enter="onUpdateCategory(index, category.id, $event.target.value)"/>
        </div>
      </div>

      <button type="button" :disabled="isLoadingSubmit"
              class="w-full text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              @click="onSave">
        <span v-if="isLoadingSubmit">
          <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin"/>
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
import {Category, EditableTransaction} from "~/utils/types";
import {useCategories} from "~/composables/categories";
import {toast} from "vue3-toastify";
import {useAuth} from "~/composables/auth";
import {useCircleUsers} from "~/composables/circles";
import {initTooltips} from "flowbite";

const props = defineProps({
  transaction: {
    type: Object as PropType<EditableTransaction | undefined>,
  },
})

const isEditMode = ref<boolean>(false)
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

const emit = defineEmits(['on-success', 'on-failed', 'update:modelValue', 'add-category', 'edit-category', 'on-mounted'])

const auth = useAuth()
const $categories = useCategories()
const $circleUsers = useCircleUsers()


watchDebounced(formTransaction.value, (value) => emit('update:modelValue', value), {debounce: 1000})

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

watch(() => isEditMode.value, (val) => {
  if (!val) {
    $categories.value.data.forEach((val: Category) => {
      val.edited = false
    })
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
          currency: $circleUsers.value.selected?.currency
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
          currency: $circleUsers.value.selected?.currency
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

async function onUpdateCategory(index: number, categoryId: string, name: string) {
  const {data, error, status} = await useFetch('/api/categories/update.category', {
    method: 'POST',
    body: JSON.stringify({
      id: categoryId,
      name,
    }),
  })

  if (status.value === 'success') {
    $categories.value.data[index] = data.value as Category
  } else {
    toast.error(error.value?.statusMessage ?? '')
  }
}

async function onDeleteCategory(categoryId: string) {
  const {error, status} = await useFetch('/api/categories/delete.category', {
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
  display: block;
  width: 100%;
  border-radius: 0.5rem;
}

.light .dp-custom-input {
  background: #f9fafb;
  border-color: #d1d5db;
  color: gray;
}

.dark .dp-custom-input {
  background: #4b5563;
  border-color: #6b7280;
  color: #D1D5DB;
}
</style>
