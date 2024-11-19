<template>
  <div>
    <div class="mb-5">
      <label for="subscription-name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Subscription Name <span class="text-red-500">*</span>
      </label>
      <input v-model="name" ref="inputRef" name="subscription-name" id="subscription-name"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        type="text" placeholder="Example: Netflix" required v-on:keydown.enter="onSave" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
      <div>
        <label for="cost" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Cost <span class="text-red-500">*</span>
        </label>
        <general-currency-field v-model="cost" name="cost" @keyup.enter="onSave" />
      </div>
      <div>
        <label for="currency" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Currency <span class="text-red-500">*</span>
        </label>
        <select v-model="currency" id="currency"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
          <option v-for="curr in currencies" :key="curr" :value="curr">{{ curr }}</option>
        </select>
      </div>
    </div>

    <div class="mb-5">
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Billing Cycle <span class="text-red-500">*</span>
      </label>
      <div class="flex flex-wrap gap-4">
        <div v-for="cycle in billingCycles" class="flex h-10 items-center">
          <input v-model="billingCycle" :id="cycle.value" type="radio" :value="cycle.value"
            class="w-4 h-4 hidden peer text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            :name="cycle.value" required>
          <label :for="cycle.value"
            class="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="text-lg font-semibold capitalize">{{ cycle.label }}</div>
          </label>
        </div>
      </div>
    </div>

    <div class="mb-5">
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Next Payment Date <span class="text-red-500">*</span>
      </label>
      <VueDatePicker v-model="nextPaymentDate" locale="id-ID" format="dd/MM/yyyy"
        input-class-name="dp-custom-input" hide-input-icon :enable-time-picker="false"
        placeholder="Select Date" auto-apply position="bottom" :close-on-scroll="false"
        :teleport="true" :transitions="{ open: '', close: '' }" menu-class-name="date-picker-menu"
        :dark="isDarkMode" />
    </div>

    <div class="mb-5">
      <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        Category <span class="text-red-500">*</span>
      </label>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="cat in categories" :key="cat.value" class="relative">
          <input v-model="category" :id="cat.value" type="radio" :value="cat.value"
            class="hidden peer" required>
          <label :for="cat.value"
            class="inline-flex items-center justify-center w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="text-sm font-semibold capitalize">{{ cat.label }}</div>
          </label>
          <div :id="`tooltip-${cat.value}`" role="tooltip"
            class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            {{ cat.description }}
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </div>

    <button type="button"
      class="w-full mt-3 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      @click="onSave">
      <span v-if="isLoadingSubmit">
        <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
        Loading...
      </span>
      <span v-else>{{ props.subscription ? 'Update' : 'Add' }} Subscription</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { initTooltips } from 'flowbite'
import { toast } from 'vue3-toastify'
import { Subscription } from '~/utils/types'

const props = defineProps({
  subscription: {
    type: Object as PropType<Subscription | undefined>,
  },
  source: {
    type: String,
    default: 'circle-settings'
  }
})

const billingCycles = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' }
]

const categories = [
  { value: 'streaming', label: 'Streaming', description: 'Streaming services like Netflix, Spotify, etc.' },
  { value: 'software', label: 'Software', description: 'Software subscriptions and licenses' },
  { value: 'utilities', label: 'Utilities', description: 'Regular utility payments' },
  { value: 'other', label: 'Other', description: 'Other subscription types' }
]

const currencies = ref(['IDR', 'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 'SGD'])

const name = ref('')
const cost = ref(0)
const currency = ref('IDR')
const billingCycle = ref('monthly')
const nextPaymentDate = ref(new Date())
const category = ref('')
const isLoadingSubmit = ref(false)
const isDarkMode = ref(false)
const inputRef = ref<HTMLInputElement>()

const emit = defineEmits(['subscription-created', 'subscription-updated'])

onMounted(() => {
  initTooltips()
  inputRef.value?.focus()
  
  // Fetch available currencies
  fetch('/api/currencies/rates')
    .then(response => response.json())
    .then(data => {
      currencies.value = Object.keys(data.rates)
    })
    .catch(error => {
      console.error('Error fetching currencies:', error)
    })
})

watch(() => props.subscription, (val) => {
  if (val) {
    name.value = val.name
    cost.value = val.cost
    currency.value = val.currency || 'IDR'
    billingCycle.value = val.billingCycle
    nextPaymentDate.value = new Date(val.nextPaymentDate)
    category.value = val.category
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  name.value = ''
  cost.value = 0
  currency.value = 'IDR'
  billingCycle.value = 'monthly'
  nextPaymentDate.value = new Date()
  category.value = ''
}

async function onSave() {
  try {
    if (!name.value || !cost.value || !billingCycle.value || !nextPaymentDate.value || !category.value || !currency.value) {
      toast.error('Please fill in all required fields')
      return
    }

    isLoadingSubmit.value = true
    const endpoint = props.subscription?.id 
      ? `/api/subscriptions/${props.subscription.id}` 
      : '/api/subscriptions/create'
    
    const response = await fetch(endpoint, {
      method: props.subscription ? 'PUT' : 'POST',
      body: JSON.stringify({
        name: name.value,
        cost: cost.value,
        currency: currency.value,
        billingCycle: billingCycle.value,
        nextPaymentDate: nextPaymentDate.value.toISOString(),
        category: category.value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to save subscription')
    }

    const result = await response.json()
    toast.success(`Subscription ${props.subscription ? 'updated' : 'added'} successfully`)
    emit(props.subscription ? 'subscription-updated' : 'subscription-created', result)
    if (!props.subscription) {
      resetForm()
    }
  } catch (error) {
    console.error('Error saving subscription:', error)
    toast.error('Failed to save subscription')
  } finally {
    isLoadingSubmit.value = false
  }
}
</script>

<style>
.dp-custom-input {
  @apply bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white;
}
</style>
