<template>
  <div>
    <!-- Add/Edit Modal -->
    <general-modal id="modal-form-subscription" :title="selectedSubscription ? 'Edit Subscription' : 'Add Subscription'"
      subtitle="Manage your subscriptions" @on-mounted="modalFormSubscription = $event">
      <template #body>
        <form-subscription :subscription="selectedSubscription" @subscription-created="onSubscriptionCreated"
          @subscription-updated="onSubscriptionUpdated" />
      </template>
    </general-modal>


    <!-- Delete Confirmation Modal -->
    <general-modal id="modal-confirmation-delete-subscription" title="Delete Subscription"
      @on-mounted="modalConfDelete = $event">
      <template #body>
        <p class="text-gray-500 dark:text-gray-400">Are you sure you want to delete this subscription?</p>
        <div class="flex mt-4">
          <button type="button"
            class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:focus:ring-primary-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            @click="modalConfDelete?.hide()">
            No, Cancel
          </button>
          <button type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click="confirmDeleteSubscription(); modalConfDelete?.hide()">
            Yes, Delete
          </button>
        </div>
      </template>
    </general-modal>

    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
        <button @click="selectedSubscription = null; modalFormSubscription?.show()"
          class="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Subscription
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <h3 class="text-lg font-medium mb-3 text-gray-800 dark:text-white">Monthly Spending</h3>
          <p class="text-3xl font-semibold text-primary-600 mb-2">{{ currencyIDRFormatter('IDR', monthlyTotal) }}</p>
          <div v-if="hasMultipleCurrencies" class="space-y-1 text-sm text-gray-500">
            <div v-for="(amount, curr) in monthlyCurrencyTotals" :key="curr" class="flex items-center">
              <span class="w-12 font-medium">{{ curr }}</span>
              <span>{{ currencyIDRFormatter(curr, amount) }}</span>
            </div>
          </div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <h3 class="text-lg font-medium mb-3 text-gray-800 dark:text-white">Yearly Spending</h3>
          <p class="text-3xl font-semibold text-primary-600 mb-2">{{ currencyIDRFormatter('IDR', yearlyTotal) }}</p>
          <div v-if="hasMultipleCurrencies" class="space-y-1 text-sm text-gray-500">
            <div v-for="(amount, curr) in yearlyCurrencyTotals" :key="curr" class="flex items-center">
              <span class="w-12 font-medium">{{ curr }}</span>
              <span>{{ currencyIDRFormatter(curr, amount) }}</span>
            </div>
          </div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
          <h3 class="text-lg font-medium mb-3 text-gray-800 dark:text-white">Upcoming Payments</h3>
          <p class="text-3xl font-semibold text-primary-600 mb-2">{{ upcomingPayments.length }}</p>
          <div class="space-y-2">
            <div v-for="payment in upcomingPayments.slice(0, 3)" :key="payment.id"
              class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-300">{{ payment.name }}</span>
              <span class="font-medium text-gray-900 dark:text-white">{{ currencyIDRFormatter(payment.currency,
                payment.cost) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex-1 min-w-[200px]">
            <select v-model="selectedCategory"
              class="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ capitalizeFirstLetter(category) }}
              </option>
            </select>
          </div>
          <div class="flex-1 min-w-[200px]">
            <select v-model="sortOrder"
              class="w-full px-3 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
              <option value="asc">Cost: Low to High</option>
              <option value="desc">Cost: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div
        class="mb-16 sm:mb-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Billing Cycle</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Next Payment</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="sub in filteredSubscriptions" :key="sub.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ sub.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600 dark:text-gray-300">{{ currencyIDRFormatter(sub.currency, sub.cost)
                    }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600 dark:text-gray-300 capitalize">{{ sub.billingCycle }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600 dark:text-gray-300">{{ formatDate(sub.nextPaymentDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-3 py-1 text-xs font-medium rounded-full" :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300': sub.category === 'streaming',
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300': sub.category === 'software',
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300': sub.category === 'utilities',
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300': sub.category === 'other'
                  }">
                    {{ capitalizeFirstLetter(sub.category) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex items-center justify-end space-x-3">
                    <button @click="editSubscription(sub)"
                      class="p-1 text-gray-400 hover:text-primary-600 dark:text-gray-500 dark:hover:text-primary-400">
                      <icons-edit class="w-4 h-4" />
                    </button>
                    <button @click="deleteSubscription(sub.id)"
                      class="p-1 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400">
                      <icons-trash class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import { toast } from "vue3-toastify";
import { ref, computed } from 'vue'
import type { Subscription } from '~/utils/types'

// Add new variables
const monthlyCurrencyTotals = ref<Record<string, number>>({})
const yearlyCurrencyTotals = ref<Record<string, number>>({})
const exchangeRates = ref<Record<string, number>>({})
const hasMultipleCurrencies = computed(() => Object.keys(monthlyCurrencyTotals.value).length > 1)

let modalFormSubscription: any = null;
let modalConfDelete: any = null

const subscriptions = ref<Subscription[]>([])
const upcomingPayments = ref<Subscription[]>([])
const $loading = useLoading();
$loading.value = true

// Filter and sort state
const selectedCategory = ref('')
const sortOrder = ref('asc')

// Available categories
const categories = ['streaming', 'software', 'utilities', 'other']

// Filtered and sorted subscriptions
const filteredSubscriptions = computed(() => {
  let filtered = [...subscriptions.value]

  if (selectedCategory.value) {
    filtered = filtered.filter(sub => sub.category === selectedCategory.value)
  }

  filtered.sort((a, b) => {
    const costA = a.cost || 0
    const costB = b.cost || 0
    return sortOrder.value === 'asc' ? costA - costB : costB - costA
  })

  return filtered
})

// Monthly and yearly totals
const monthlyTotal = ref(0)
const yearlyTotal = ref(0)

const subscriptionToDelete = ref<string | null>(null)
const selectedSubscription = ref<Subscription | null>(null)


await Promise.all([
  fetchSubscriptions(),
  fetchTotals(),
  fetchUpcoming(),
  fetchExchangeRates()
])

calculateCurrencyTotals()

$loading.value = false

definePageMeta({
  title: "Subscriptions",
  layout: 'heading',
});

watch([selectedCategory, sortOrder], async () => {
  await fetchSubscriptions()
}, { deep: true })

async function fetchSubscriptions() {
  try {
    const queryParams = new URLSearchParams()
    if (selectedCategory.value) queryParams.append('category', selectedCategory.value)
    if (sortOrder.value) {
      queryParams.append('sortOrder', sortOrder.value)
    }

    const response = await fetch(`/api/subscriptions?${queryParams}`)
    if (response.ok) {
      subscriptions.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
  }

}

async function fetchTotals() {

  try {
    const [monthlyResponse, yearlyResponse] = await Promise.all([
      fetch('/api/subscriptions?period=monthly'),
      fetch('/api/subscriptions?period=yearly')
    ])

    if (monthlyResponse.ok && yearlyResponse.ok) {
      monthlyTotal.value = await monthlyResponse.json()
      yearlyTotal.value = await yearlyResponse.json()
    }
  } catch (error) {
    console.error('Error fetching totals:', error)
  }
}

async function fetchUpcoming() {
  try {
    const response = await fetch('/api/subscriptions/upcoming')
    if (response.ok) {
      upcomingPayments.value = await response.json()
    }
  } catch (error) {
    console.error('Error fetching upcoming payments:', error)
  }
}

// Calculate totals for each currency
function calculateCurrencyTotals() {
  const monthly: Record<string, number> = {}
  const yearly: Record<string, number> = {}
  let monthlyTotalIDR = 0
  let yearlyTotalIDR = 0

  // First, calculate totals in original currencies
  subscriptions.value.forEach(sub => {
    const currency = sub.currency || 'IDR'
    const cost = sub.cost || 0

    if (sub.billingCycle === 'monthly') {
      monthly[currency] = (monthly[currency] || 0) + cost
      yearly[currency] = (yearly[currency] || 0) + (cost * 12)
    } else {
      monthly[currency] = (monthly[currency] || 0) + (cost / 12)
      yearly[currency] = (yearly[currency] || 0) + cost
    }
  })

  monthlyCurrencyTotals.value = monthly
  yearlyCurrencyTotals.value = yearly

  // Then calculate IDR totals using exchange rates
  Object.entries(monthly).forEach(([curr, amount]) => {
    if (curr === 'IDR') {
      monthlyTotalIDR += amount
    } else if (exchangeRates.value[curr]) {
      // Convert to EUR first (base currency) then to IDR
      const amountInOthers = amount / exchangeRates.value[curr]
      const amountInIDR = amountInOthers * exchangeRates.value['IDR']
      monthlyTotalIDR += amountInIDR
    }
  })

  Object.entries(yearly).forEach(([curr, amount]) => {
    if (curr === 'IDR') {
      yearlyTotalIDR += amount
    } else if (exchangeRates.value[curr]) {
      // Convert to EUR first (base currency) then to IDR
      const amountInOthers = amount / exchangeRates.value[curr]
      const amountInIDR = amountInOthers * exchangeRates.value['IDR']
      yearlyTotalIDR += amountInIDR
    }
  })

  monthlyTotal.value = monthlyTotalIDR
  yearlyTotal.value = yearlyTotalIDR
}

// Fetch exchange rates
async function fetchExchangeRates() {
  try {
    const response = await fetch('/api/currencies/rates')
    if (response.ok) {
      const data = await response.json()
      exchangeRates.value = data.rates
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
  }
}

function editSubscription(subscription: Subscription) {
  selectedSubscription.value = subscription
  modalFormSubscription.show()
}

function deleteSubscription(id: string) {
  subscriptionToDelete.value = id
  modalConfDelete.show()
}

async function confirmDeleteSubscription() {
  if (!subscriptionToDelete.value) return
  $loading.value = true

  try {
    const response = await fetch(`/api/subscriptions/${subscriptionToDelete.value}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      await Promise.all([
        fetchSubscriptions(),
        fetchTotals(),
        fetchUpcoming()
      ])

      calculateCurrencyTotals()
      toast.success('Subscription deleted successfully')
    } else {
      toast.error('Failed to delete subscription')
    }
  } catch (error) {
    console.error('Error deleting subscription:', error)
    toast.error('Failed to delete subscription')
  } finally {
    modalConfDelete.hide()
    subscriptionToDelete.value = null
  }

  $loading.value = false
}

async function onSubscriptionCreated(subscription: Subscription) {
  modalFormSubscription.hide()
  selectedSubscription.value = null
  $loading.value = true

  await Promise.all([
    fetchSubscriptions(),
    fetchTotals(),
    fetchUpcoming()
  ])

  calculateCurrencyTotals()

  $loading.value = false

}

async function onSubscriptionUpdated(subscription: Subscription) {
  modalFormSubscription.hide()
  selectedSubscription.value = null

  $loading.value = true

  await Promise.all([
    fetchSubscriptions(),
    fetchTotals(),
    fetchUpcoming()
  ])

  calculateCurrencyTotals()

  $loading.value = false
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}


async function closeModal() {
  selectedSubscription.value = null
  modalFormSubscription?.hide()
}
</script>
