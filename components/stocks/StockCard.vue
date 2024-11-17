<template>
  <div class="stock-card">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-lg font-bold">{{ stock.symbol }}</h3>
        <p class="text-sm text-gray-600">{{ stock.name }}</p>
      </div>
      <button @click="$emit('toggle-favorite', stock)" class="favorite-btn">
        <i :class="['fas', isFavorite ? 'fa-star text-yellow-400' : 'fa-star text-gray-300']"></i>
      </button>
    </div>
    
    <div class="mt-4">
      <div class="flex justify-between items-center">
        <span class="text-2xl font-bold">${{ formatPrice(stock.price) }}</span>
        <span :class="['price-change', getPriceChangeClass()]">
          {{ formatPriceChange(stock.change) }}%
        </span>
      </div>
      
      <div class="mt-2 text-sm text-gray-600">
        <div class="flex justify-between">
          <span>Open</span>
          <span>${{ formatPrice(stock.open) }}</span>
        </div>
        <div class="flex justify-between">
          <span>High</span>
          <span>${{ formatPrice(stock.high) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Low</span>
          <span>${{ formatPrice(stock.low) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Volume</span>
          <span>{{ formatVolume(stock.volume) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stock: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

function formatPrice(price) {
  return Number(price).toFixed(2)
}

function formatPriceChange(change) {
  return Number(change).toFixed(2)
}

function formatVolume(volume) {
  return new Intl.NumberFormat().format(volume)
}

function getPriceChangeClass() {
  return {
    'text-green-500': props.stock.change > 0,
    'text-red-500': props.stock.change < 0,
    'text-gray-500': props.stock.change === 0
  }
}
</script>

<style scoped>
.stock-card {
  @apply bg-white p-4 rounded-lg shadow-md;
}

.favorite-btn {
  @apply p-2 hover:bg-gray-100 rounded-full transition-colors;
}

.price-change {
  @apply px-2 py-1 rounded text-sm font-semibold;
}
</style>
