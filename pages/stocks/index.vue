<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between sm:items-end my-6">
      <div class="flex justify-between items-center mb-6">
        <div class="text-2xl text-gray-500">My Financial Records</div>
        <input v-model="searchQuery" @input="searchStocks" type="text" placeholder="Search stocks..."
          class="px-4 py-2 border rounded-lg" />
      </div>
    </div>
  
    <!-- Error State -->
    <div v-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>

    <template v-else>
      <!-- Favorites Section -->
      <div v-if="favorites.length > 0" class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Favorites</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StockCard v-for="stock in favorites" :key="stock.symbol" :stock="stock" :is-favorite="true"
            @toggle-favorite="toggleFavorite" />
        </div>
      </div>

      <!-- Market Overview -->
      <div v-if="stocks.length > 0">
        <h2 class="text-xl font-semibold mb-4">Market Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StockCard v-for="stock in stocks" :key="stock.symbol" :stock="stock" :is-favorite="isFavorite(stock.symbol)"
            @toggle-favorite="toggleFavorite" />
        </div>
      </div>

      <!-- No Results -->
      <div v-else class="text-center py-8 text-gray-500">
        No stocks found. Try a different search term.
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import StockCard from '~/components/stocks/StockCard.vue'

const searchQuery = ref('')
const $loading = useLoading();
const error = ref(null)
let stockUpdateInterval

$loading.value = true

definePageMeta({
  title: "Stocks",
  layout: 'heading',
});

// Initial data fetch using useFetch
const { data: stocks, refresh: refreshStocks } = await useFetch('/api/stocks/gainers-losers', {
  watch: [searchQuery]
})

const { data: favorites, refresh: refreshFavorites } = await useFetch('/api/stocks/favorites', {
  watch: [searchQuery]
})

$loading.value = false

onMounted(() => {
  startRealTimeUpdates()
})

onUnmounted(() => {
  if (stockUpdateInterval) {
    clearInterval(stockUpdateInterval)
  }
})

// Start real-time updates for favorites
function startRealTimeUpdates() {
  stockUpdateInterval = setInterval(async () => {
    if (favorites.value?.length > 0) {
      const symbols = favorites.value.map(f => f.symbol).join(',')
      try {
        const data = await $fetch(`/api/stocks/batch-quotes?symbols=${symbols}`)
        
        favorites.value = favorites.value.map(favorite => {
          const quote = data.find(q => q.symbol === favorite.symbol)
          return quote ? { ...favorite, ...quote } : favorite
        })
      } catch (err) {
        console.error('Error updating favorites:', err)
      }
    }
  }, 60000) // Update every minute
}

// Search stocks
async function searchStocks() {
  if (searchQuery.value.length < 2) {
    await refreshStocks()
    await refreshFavorites()
    return
  }

  try {
    isLoading.value = true
    stocks.value = await $fetch(`/api/stocks/search?query=${searchQuery.value}`)
  } catch (err) {
    error.value = 'Failed to search stocks. Please try again later.'
    console.error('Error searching stocks:', err)
  } finally {
    isLoading.value = false
  }
}

// Toggle favorite status
async function toggleFavorite(stock) {
  const isFav = isFavorite(stock.symbol)
  try {
    if (isFav) {
      await $fetch(`/api/stocks/${stock.symbol}`, { method: 'DELETE' })
      favorites.value = favorites.value.filter(f => f.symbol !== stock.symbol)
    } else {
      const result = await $fetch('/api/stocks/favorites', {
        method: 'POST',
        body: { symbol: stock.symbol }
      })
      if (result.data) {
        favorites.value.push({ ...stock, ...result.data })
      }
    }
  } catch (err) {
    console.error('Error toggling favorite:', err)
  }
}

// Check if stock is in favorites
function isFavorite(symbol) {
  return favorites.value?.some(f => f.symbol === symbol)
}
</script>

<style scoped></style>