<template>
  <div
    class="p-6 bg-white border border-gray-200 rounded-lg drop-shadow-soft hover:drop-shadow-xl dark:bg-gray-800 dark:border-gray-700">
    <h3 class="font-bold dark:text-gray-300">Debt Percentage by Income</h3>
    <hr class="flex-grow border-t mt-2 mb-4 border-gray-400"/>
    <div class="mt-4 text-sm text-gray-500 font-bold dark:text-gray-300">{{
      capitalizeFirstLetter(labelTime)
    }}</div>
    <div class="flex justify-between">
      <span class="mb-3 text-2xl text-gray-500 font-bold dark:text-gray-300">{{
            currencyIDRFormatter($circleUsers.selected?.currency, sumOfDebtAmount)

        }}</span>
      <span class="mb-3 text-2xl text-gray-500 font-bold dark:text-gray-300">{{
        percentageOfDebtByIncome.toFixed(2)
      }}%</span>
    </div>
    <div class="w-full h-6 bg-gray-200 rounded dark:bg-gray-700">
      <div class="h-6 bg-orange-400 rounded dark:bg-orange-300 transition-width transition-slowest ease-in-out"
        :style="`width: ${percentageOfDebtByIncome}%`"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
const sumOfDebtAmount = computed(() => props.transactions?.filter((val: Record) => val.category.type === 'debt').reduce((sum: number, n: Record) => sum + n.amount, 0) ?? 0)

const percentageOfDebtByIncome = computed<number>(() => !sumOfDebtAmount.value ? 0 : sumOfDebtAmount.value / sumOfIncomeAmount.value * 100)

</script>

<style scoped></style>
