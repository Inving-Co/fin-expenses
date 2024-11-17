<template>
  <div
      class="p-4 bg-white border border-gray-200 rounded-lg drop-shadow-soft hover:drop-shadow-xl dark:bg-gray-800 dark:border-gray-700">
    <div class="flex justify-between items-center">
      <h3 class="font-bold dark:text-gray-300">Budget Plan</h3>
      <div class="flex items-center gap-2">
        <button v-if="isFiltered"
            class="h-[30px] p-1 text-gray-500 hover:text-gray-700 focus:outline-none font-medium rounded-lg text-sm dark:text-gray-400"
            type="button" @click="resetFilter">
          <icons-refresh class="inline" />
        </button>
        <button @click="showBudgetInfo = !showBudgetInfo" 
                class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'rotate-180': showBudgetInfo}" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9l-7 7l-7-7"/>
          </svg>
        </button>
      </div>
    </div>
    
    <transition name="slide">
      <div v-if="showBudgetInfo" class="mt-2">
        <hr class="flex-grow border-t mb-2 border-gray-400"/>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="flex flex-col">
            <div class="text-xs text-gray-500 font-medium dark:text-gray-300">
              Budget
            </div>
            <div class="text-sm text-gray-500 font-bold dark:text-gray-300">{{
                currencyIDRFormatter($circleUsers.selected?.currency, $circleBudget.budget?.amount)
              }}
            </div>
          </div>
          <div class="flex flex-col">
            <div class="text-xs text-gray-500 font-medium dark:text-gray-300">
              Planned
            </div>
            <div class="text-sm text-gray-500 font-bold dark:text-gray-300">{{
                currencyIDRFormatter($circleUsers.selected?.currency, sumOfPlanned)
              }}
            </div>
          </div>
        </div>
      </div>
    </transition>

    <hr class="flex-grow border-t my-3 border-gray-400"/>

    <!-- Budget Summary Section -->
    <div class="mt-4">
      <div class="text-md text-gray-500 font-semibold dark:text-gray-300 mb-2">Summary</div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex items-center gap-2">
          <div :class="getOverallStatusColor(totalSpentPercentage)" class="w-2 h-2 rounded-full"></div>
          <div class="text-sm group relative">
            <span class="text-gray-500 dark:text-gray-300">Overall Spent: </span>
            <span class="font-semibold cursor-help" 
                  :class="getOverallStatusColor(totalSpentPercentage)"
                  @mouseenter="showTotalSpent = true"
                  @mouseleave="showTotalSpent = false">
              {{ Math.round(totalSpentPercentage) }}%
            </span>
            <!-- Tooltip -->
            <div v-if="showTotalSpent" 
                  class="absolute z-10 px-3 py-2 text-sm font-normal text-white bg-gray-900 rounded-lg shadow-sm tooltip dark:bg-gray-700"
                  style="top: -40px; left: 50%; transform: translateX(-50%)">
              {{ currencyIDRFormatter($circleUsers.selected?.currency, totalSpent) }}
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div :class="{'bg-red-500': overBudgetCategories > 0, 'bg-green-500': overBudgetCategories === 0}" class="w-2 h-2 rounded-full"></div>
          <div class="text-sm">
            <span class="text-gray-500 dark:text-gray-300">Over Budget: </span>
            <span class="font-semibold" :class="{'text-red-500': overBudgetCategories > 0, 'text-green-500': overBudgetCategories === 0}">
              {{ overBudgetCategories }} {{ overBudgetCategories === 1 ? 'category' : 'categories' }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div :class="{'bg-green-500': underBudgetCategories > 0, 'bg-yellow-500': underBudgetCategories === 0}" class="w-2 h-2 rounded-full"></div>
          <div class="text-sm">
            <span class="text-gray-500 dark:text-gray-300">Under Budget: </span>
            <span class="font-semibold" :class="{'text-green-500': underBudgetCategories > 0, 'text-yellow-500': underBudgetCategories === 0}">
              {{ underBudgetCategories }} {{ underBudgetCategories === 1 ? 'category' : 'categories' }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :class="getRemainingBudgetColor"></div>
          <div class="text-sm">
            <span class="text-gray-500 dark:text-gray-300">Remaining: </span>
            <span class="font-semibold" :class="getRemainingBudgetColor">
              {{ currencyIDRFormatter($circleUsers.selected?.currency, remainingBudget) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <hr class="flex-grow border-t my-3 border-gray-400"/>
    
    <div class="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-h-[400px] md:max-h-none overflow-y-auto pr-2">
      <div v-for="(item, index) in budgetItems" :key="index" 
           class="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 md:p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
           :class="{
             'border-l-4 border-red-500': item.actual > item.planned,
             'ring-2 ring-primary-500': selectedCategoryId === item.categoryId
           }"
           @click="selectCategory(item)">
        <div class="flex justify-between items-center mb-1.5 md:mb-3">
          <div class="flex items-center gap-1 md:gap-2">
            <span class="font-medium text-gray-700 dark:text-gray-200 text-xs md:text-sm">{{ item.category }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">({{ Math.round((item.actual / item.planned) * 100) }}%)</span>
          </div>
          <div class="text-xs md:text-sm" :class="getBudgetStatusColor(item.actual / item.planned)">
            {{ getBudgetStatus(item.actual, item.planned) }}
          </div>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 md:h-2 mb-1.5 md:mb-3">
          <div class="h-1.5 md:h-2 rounded-full" 
               :style="{ width: `${Math.min((item.actual / item.planned) * 100, 100)}%`, 
                        backgroundColor: getProgressColor(item.actual / item.planned) }"
               :title="`${Math.round((item.actual / item.planned) * 100)}%`">
          </div>
        </div>
        <div class="flex justify-between text-xs md:text-sm">
          <div>
            <span class="text-gray-600 dark:text-gray-300">Actual: </span>
            <span class="font-medium text-gray-700 dark:text-gray-200">
              {{ currencyIDRFormatter($circleUsers.selected?.currency, item.actual) }}
            </span>
          </div>
          <div>
            <span class="text-gray-600 dark:text-gray-300">Planned: </span>
            <span class="font-medium text-gray-700 dark:text-gray-200">
              {{ currencyIDRFormatter($circleUsers.selected?.currency, item.planned) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import lodash from 'lodash';
import {PropType} from "@vue/runtime-core";
import {CircleBudgetPlannings, Record} from "~/utils/types";
import {capitalizeFirstLetter} from "~/utils/functions";
import {useCircleBudget, useCircleUsers} from "~/composables/circles";
import {useCategories} from "~/composables/categories";
import {ref, computed} from 'vue';

const emit = defineEmits(['category-selected', 'reset-filter'])

const {forEach, groupBy, map, mapValues, omit, reduce, split} = lodash;
const $circleUsers = useCircleUsers()
const $circleBudget = useCircleBudget()
const $categories = useCategories()

const props = defineProps({
  transactions: {
    type: Object as PropType<Record[]>,
    required: true,
  }
})

const sumOfPlanned = computed(() => $circleBudget.value.plannings?.reduce((sum: number, n: CircleBudgetPlannings) => sum + n.amount, 0) || 0)

const budgetItems = computed(() => {
  if (!props.transactions || !$circleBudget.value.plannings) return [];

  const plannings = $circleBudget.value.plannings.filter(p => p.amount > 0);
  const transactions = props.transactions.filter(t => 
    plannings.some(p => p.categoryId === t.categoryId)
  );

  const groupedTransactions = groupBy(transactions, 'categoryId');
  
  return plannings.map(p => {
    const categoryTransactions = groupedTransactions[p.categoryId] || [];
    const actual = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const category = $categories.value.data.find(c => c.id === p.categoryId)?.name;
    
    return {
      categoryId: p.categoryId,
      category: capitalizeFirstLetter(category || ''),
      planned: p.amount,
      actual: Math.abs(actual)
    };
  });
})

function getProgressColor(ratio: number): string {
  if (ratio < 0.7) return '#10B981'; // Green for under budget
  if (ratio < 0.9) return '#F59E0B'; // Yellow for close to budget
  if (ratio === 1) return '#3B82F6'; // Blue for exactly on budget
  return '#EF4444'; // Red for over budget
}

function getBudgetStatus(actual: number, planned: number): string {
  const ratio = actual / planned;
  if (ratio > 1) {
    const overAmount = actual - planned;
    return `Over ${currencyIDRFormatter($circleUsers.selected?.currency, overAmount)}`;
  }
  if (ratio === 1) return 'On Budget';
  if (ratio >= 0.9) return 'Near Budget';
  if (ratio >= 0.7) return 'On Track';
  const remainingAmount = planned - actual;
  return currencyIDRFormatter($circleUsers.selected?.currency, remainingAmount);
}

function getBudgetStatusColor(ratio: number): string {
  if (ratio > 1) return 'text-red-500 dark:text-red-400';
  if (ratio === 1) return 'text-blue-500 dark:text-blue-400';
  if (ratio >= 0.9) return 'text-yellow-500 dark:text-yellow-400';
  if (ratio >= 0.7) return 'text-blue-500 dark:text-blue-400';
  return 'text-green-500 dark:text-green-400';
}

const showBudgetInfo = ref(false)
const previousFilterState = ref<string[]>([])
const isFiltered = ref(false)
const showTotalSpent = ref(false)
const selectedCategoryId = ref<string | null>(null)

function selectCategory(item: any) {
  const category = $categories.value.data.find(c => c.id === item.categoryId);
  if (category) {
    // If clicking the same category, reset the filter
    if (selectedCategoryId.value === category.id) {
      resetFilter();
      selectedCategoryId.value = null;
      return;
    }

    // Store current filter state if not already filtered
    if (!isFiltered.value) {
      previousFilterState.value = $categories.value.data
        .filter((cat: any) => cat.checked)
        .map((cat: any) => cat.id);
    }

    // Update selected category and filter state
    selectedCategoryId.value = category.id;
    isFiltered.value = true;
    emit('category-selected', category);
  }
}

function resetFilter() {
  // Restore previous filter state
  $categories.value.data.forEach((cat: any) => {
    cat.checked = previousFilterState.value.includes(cat.id);
  });
  
  isFiltered.value = false;
  selectedCategoryId.value = null;
  emit('reset-filter');
}

const totalSpent = computed(() => {
  return budgetItems.value.reduce((sum, item) => sum + item.actual, 0);
});

const totalSpentPercentage = computed(() => {
  if (!$circleBudget.value?.budget?.amount || !sumOfPlanned.value) return 0;
  return (totalSpent.value / sumOfPlanned.value) * 100;
});

const overBudgetCategories = computed(() => {
  return budgetItems.value.filter(item => item.actual > item.planned).length;
});

const underBudgetCategories = computed(() => {
  return budgetItems.value.filter(item => item.actual < item.planned).length;
});

const remainingBudget = computed(() => {
  if (!sumOfPlanned.value) return 0;
  const totalSpent = budgetItems.value.reduce((sum, item) => sum + item.actual, 0);
  return sumOfPlanned.value - totalSpent;
});

const getRemainingBudgetColor = computed(() => {
  if (!sumOfPlanned.value) return 'text-gray-500';
  if (remainingBudget.value <= 0) return 'text-red-500';
  if (remainingBudget.value < sumOfPlanned.value * 0.2) return 'text-yellow-500';
  return 'text-green-500';
});

function getOverallStatusColor(percentage: number) {
  if (percentage >= 100) return 'text-red-500';
  if (percentage >= 80) return 'text-yellow-500';
  return 'text-green-500';
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease-out;
}

.slide-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.space-y-3 {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

.space-y-3::-webkit-scrollbar {
  width: 6px;
}

.space-y-3::-webkit-scrollbar-track {
  background: #EDF2F7;
  border-radius: 3px;
}

.space-y-3::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 3px;
}

.dark .space-y-3 {
  scrollbar-color: #4B5563 #1F2937;
}

.dark .space-y-3::-webkit-scrollbar-track {
  background: #1F2937;
}

.dark .space-y-3::-webkit-scrollbar-thumb {
  background-color: #4B5563;
}
</style>
