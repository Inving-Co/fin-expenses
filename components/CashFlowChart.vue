<template>
  <div
    class="p-6 bg-white border border-gray-200 rounded-lg drop-shadow-soft hover:drop-shadow-xl dark:bg-gray-800 dark:border-gray-700">
    <h3 class="font-bold dark:text-gray-300">Cash Flow</h3>
    <hr class="flex-grow border-t mt-2 mb-4 border-gray-400"/>
    <div class="mt-4 text-sm text-gray-500 font-bold dark:text-gray-300">{{
      capitalizeFirstLetter(labelTime)
    }}</div>
    <div class="mb-3 text-2xl text-gray-500 font-bold dark:text-gray-300">{{
      currencyIDRFormatter($circleUsers.selected?.currency, sumOfIncomeAmount - sumOfExpenseAmount)
    }}</div>
    <div class="flex-col">
      <span class="flex justify-between">
        <div class="mb-1 text-sm text-gray-500 font-medium dark:text-gray-300">Income</div>
        <div class="mb-1 text-sm text-gray-500 font-medium dark:text-gray-300">{{
            currencyIDRFormatter($circleUsers.selected?.currency, sumOfIncomeAmount)
          }}</div>
      </span>
      <div class="w-full h-6 bg-gray-200 rounded dark:bg-gray-700">
        <div class="h-6 bg-green-400 rounded dark:bg-green-300 transition-width transition-slowest ease-in-out"
          :style="`width: ${percentageOfIncome}%`"></div>
      </div>
    </div>
    <div class="flex-col mt-4">
      <span class="flex justify-between">
        <div class="mb-1 text-sm text-gray-500 font-medium dark:text-gray-300">Expense</div>
        <div class="mb-1 text-sm text-gray-500 font-medium dark:text-gray-300">{{
            currencyIDRFormatter($circleUsers.selected?.currency, sumOfExpenseAmount)
          }}</div>
      </span>
      <div class="w-full h-6 bg-gray-200 rounded dark:bg-gray-700">
        <div class="h-6 bg-red-400 rounded dark:bg-red-300  transition-width transition-slowest ease-in-out"
          :style="`width: ${percentageOfExpense}%`"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import lodash from 'lodash';
import { PropType } from "@vue/runtime-core";
import { Record } from "~/utils/types";

ChartJS.register(ArcElement, Tooltip, Legend)

const { map, reduce, split } = lodash;


const props = defineProps({
  labelTime: {
    type: String,
    required: true,
  },
  transactions: {
    type: Object as PropType<Record[]> || null,
    required: true,
  }
})

const $circleUsers = useCircleUsers()

const sumOfIncomeAmount = computed(() => props.transactions?.filter((val: Record) => val.category.type === 'income').reduce((sum: number, n: Record) => sum + n.amount, 0) ?? 0)
const sumOfExpenseAmount = computed(() => props.transactions?.filter((val: Record) => val.category.type !== 'income').reduce((sum: number, n: Record) => sum + n.amount, 0) ?? 0)


const percentageOfIncome = computed<number>(() => !sumOfIncomeAmount.value ? 0 : sumOfIncomeAmount.value / (sumOfIncomeAmount.value + sumOfExpenseAmount.value) * 100)
const percentageOfExpense = computed<number>(() => !sumOfExpenseAmount.value ? 0 : sumOfExpenseAmount.value / (sumOfIncomeAmount.value + sumOfExpenseAmount.value) * 100)

</script>

<style scoped></style>
