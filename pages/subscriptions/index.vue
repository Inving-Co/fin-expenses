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
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
        <button @click="modalFormSubscription?.show()"
          class="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg">
          Add Subscription
        </button>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Monthly Spending</h3>
          <p class="text-2xl font-bold text-primary-600">{{ currencyIDRFormatter('IDR', monthlyTotal) }}</p>
          <div v-if="hasMultipleCurrencies" class="text-sm text-gray-500">
            <div v-for="(amount, curr) in monthlyCurrencyTotals" :key="curr">
              {{ currencyIDRFormatter(curr, amount) }}
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Yearly Spending</h3>
          <p class="text-2xl font-bold text-primary-600">{{ currencyIDRFormatter('IDR', yearlyTotal) }}</p>
          <div v-if="hasMultipleCurrencies" class="text-sm text-gray-500">
            <div v-for="(amount, curr) in yearlyCurrencyTotals" :key="curr">
              {{ currencyIDRFormatter(curr, amount) }}
            </div>
          </div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Upcoming Payments</h3>
          <p class="text-2xl font-bold text-primary-600">{{ upcomingCount }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-4 mb-6">
        <select v-model="filters.category"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <select v-model="filters.sortBy"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">Sort By</option>
          <option value="name">Name</option>
          <option value="cost">Cost</option>
          <option value="nextPaymentDate">Payment Date</option>
        </select>
        <select v-model="filters.sortOrder"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <!-- Subscriptions List -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name
                </th>
                <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cost
                </th>
                <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Billing Cycle</th>
                <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Next
                  Payment</th>
                <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category</th>
                <th class="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
              <tr v-for="sub in subscriptions" :key="sub.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ sub.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {{ currencyIDRFormatter(sub.currency, sub.cost) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">{{
                  sub.billingCycle }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{
                  formatDate(sub.nextPaymentDate) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">{{
                  sub.category }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <general-dropdown :id="`dropdownActionButton-${sub.id}`">
                    <template #trigger="{ activator }">
                      <button
                        class="inline-flex items-center text-gray-500 bg-white hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        type="button" @click="activator">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="currentColor"
                            d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2" />
                        </svg>
                      </button>
                    </template>
                    <template #content>
                      <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                          <button @click="editSubscription(sub)"
                            class="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-left">
                            Edit
                          </button>
                        </li>
                        <li>
                          <button @click="deleteSubscription(sub.id)"
                            class="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-red-600 hover:text-red-700 text-left">
                            Delete
                          </button>
                        </li>
                      </ul>
                    </template>
                  </general-dropdown>
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
import { Subscription } from '~/utils/types'

// Add new variables
const monthlyCurrencyTotals = ref<Record<string, number>>({})
const yearlyCurrencyTotals = ref<Record<string, number>>({})
const exchangeRates = ref<Record<string, number>>({})
const hasMultipleCurrencies = computed(() => Object.keys(monthlyCurrencyTotals.value).length > 1)

let modalFormSubscription: ElementEvent | null = null;
let modalConfDelete: ElementEvent | null = null

const categories = ['streaming', 'software', 'utilities', 'other']
const subscriptionToDelete = ref<string | null>(null)
const selectedSubscription = ref<Subscription | null>(null)
const subscriptions = ref<Subscription[]>([])
const monthlyTotal = ref(0)
const yearlyTotal = ref(0)
const upcomingCount = ref(0)
const isLoading = useLoading();

const filters = ref({
  category: '',
  sortBy: '',
  sortOrder: 'asc'
})

definePageMeta({
  title: "Subscriptions",
  layout: 'heading',
});

watch(filters, async () => {
  await fetchSubscriptions()
}, { deep: true })

onMounted(async () => {
  isLoading.value = true

  await Promise.all([
    fetchExchangeRates(),
    fetchSubscriptions(),
    fetchTotals(),
    fetchUpcoming()
  ])

  calculateCurrencyTotals()
  isLoading.value = false
})

async function fetchSubscriptions() {
  try {
    const queryParams = new URLSearchParams()
    if (filters.value.category) queryParams.append('category', filters.value.category)
    if (filters.value.sortBy) {
      queryParams.append('sortBy', filters.value.sortBy)
      queryParams.append('sortOrder', filters.value.sortOrder)
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
      const upcoming = await response.json()
      upcomingCount.value = upcoming.length
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
  modalFormSubscription?.show()
}

function deleteSubscription(id: string) {
  subscriptionToDelete.value = id
  modalConfDelete?.show()
}

async function confirmDeleteSubscription() {
  if (!subscriptionToDelete.value) return
  isLoading.value = true

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
    modalConfDelete?.hide()
    subscriptionToDelete.value = null
  }

  isLoading.value = false
}

async function onSubscriptionCreated(subscription: Subscription) {
  modalFormSubscription?.hide()
  selectedSubscription.value = null
  isLoading.value = true

  await Promise.all([
    fetchSubscriptions(),
    fetchTotals(),
    fetchUpcoming()
  ])
  
  calculateCurrencyTotals()

  isLoading.value = false

}

async function onSubscriptionUpdated(subscription: Subscription) {
  modalFormSubscription?.hide()
  selectedSubscription.value = null

  isLoading.value = true

  await Promise.all([
    fetchSubscriptions(),
    fetchTotals(),
    fetchUpcoming()
  ])

  calculateCurrencyTotals()

  isLoading.value = false
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

</script>
