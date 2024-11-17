<template>
  <div
      class="p-4 bg-white border border-gray-200 rounded-lg drop-shadow-soft hover:drop-shadow-xl dark:bg-gray-800 dark:border-gray-700">
    <div class="flex justify-between items-center">
      <h3 class="font-bold dark:text-gray-300">Budget Plan</h3>
      <button @click="showBudgetInfo = !showBudgetInfo" 
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'rotate-180': showBudgetInfo}" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9l-7 7l-7-7"/>
        </svg>
      </button>
    </div>
    
    <transition name="slide">
      <div v-if="showBudgetInfo" class="mt-2">
        <hr class="flex-grow border-t mb-2 border-gray-400"/>
        <div class="flex flex-col sm:flex-row gap-2 justify-between">
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
    
    <div class="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-h-[400px] md:max-h-none overflow-y-auto pr-2">
      <div v-for="(item, index) in budgetItems" :key="index" 
           class="bg-gray-50 dark:bg-gray-700 rounded-lg p-2 md:p-4"
           :class="{'border-l-4 border-red-500': item.actual > item.planned}">
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
import {ref} from 'vue';

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

const sumOfPlanned = computed(() => $circleBudget.value.plannings?.reduce((sum: number, n: CircleBudgetPlannings) => sum + n.amount, 0))

const budgetItems = computed(() => {
  if (!props.transactions || !$circleBudget.value.plannings) return [];

  const plannings = $circleBudget.value.plannings.filter(p => p.amount > 0);
  const transactions = props.transactions.filter(t => 
    t.category.type !== 'income' && 
    plannings.map(p => p.categoryId).includes(t.category.id)
  );

  const groupedTransactions = groupBy(transactions, t => t.category.name);
  const summedTransactions = mapValues(groupedTransactions, transactions =>
    reduce(transactions, (sum, t) => sum + t.amount, 0)
  );

  return plannings.map(planning => ({
    category: capitalizeFirstLetter(planning.category.name),
    planned: planning.amount,
    actual: summedTransactions[planning.category.name] || 0
  })).sort((a, b) => b.planned - a.planned);
})

function getProgressColor(ratio: number): string {
  if (ratio <= 0.7) return '#10B981'; // Green for under budget
  if (ratio <= 0.9) return '#F59E0B'; // Yellow for close to budget
  return '#EF4444'; // Red for over/near budget
}

function getBudgetStatus(actual: number, planned: number): string {
  const ratio = actual / planned;
  if (ratio >= 1) {
    const overAmount = actual - planned;
    return `Over ${currencyIDRFormatter($circleUsers.selected?.currency, overAmount)}`;
  }
  if (ratio >= 0.9) return 'Near Limit';
  if (ratio >= 0.7) return 'On Track';
  const remainingAmount = planned - actual;
  return currencyIDRFormatter($circleUsers.selected?.currency, remainingAmount);
}

function getBudgetStatusColor(ratio: number): string {
  if (ratio >= 1) return 'text-red-500 dark:text-red-400';
  if (ratio >= 0.9) return 'text-yellow-500 dark:text-yellow-400';
  if (ratio >= 0.7) return 'text-blue-500 dark:text-blue-400';
  return 'text-green-500 dark:text-green-400';
}

const showBudgetInfo = ref(false)
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
