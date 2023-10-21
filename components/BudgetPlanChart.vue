<template>
  <div
      class="p-6 bg-white border border-gray-200 rounded-lg drop-shadow-soft hover:drop-shadow-xl dark:bg-gray-800 dark:border-gray-700">
    <h3 class="font-bold dark:text-gray-300">Budget Plan</h3>
    <hr class="flex-grow border-t mt-2 mb-4 border-gray-400"/>
    <div class="flex flex-col sm:flex-row gap-3 justify-between mt-4 mb-3 ">
      <div class="flex flex-col">
        <div class="text-sm text-gray-500 font-bold dark:text-gray-300">
          Budget
        </div>
        <div class="text-2xl text-gray-500 font-bold dark:text-gray-300">{{
            currencyIDRFormatter($circleUsers.selected?.currency, $circleBudget.budget?.amount)
          }}
        </div>
      </div>
      <div class="flex flex-col">
        <div class="text-sm text-gray-500 font-bold dark:text-gray-300">
          Planned
        </div>
        <div class="text-2xl text-gray-500 font-bold dark:text-gray-300">{{
            currencyIDRFormatter($circleUsers.selected?.currency, sumOfPlanned)
          }}
        </div>
      </div>
    </div>
    <Bar :data="data" :options="{
      responsive: true,
      maintainAspectRatio: true,
    }"/>
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import {Bar} from 'vue-chartjs'
import lodash from 'lodash';
import {PropType} from "@vue/runtime-core";
import {CircleBudgetPlannings, Record} from "~/utils/types";
import {capitalizeFirstLetter} from "~/utils/functions";
import {useCircleBudget, useCircleUsers} from "~/composables/circles";

interface Datasets {
  label: string | undefined,
  backgroundColor: string | undefined,
  data: number[]
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const {forEach, groupBy, map, mapValues, omit, reduce, split} = lodash;

const data = ref<{ labels: string[], datasets: Datasets[] }>({
  labels: [],
  datasets: [{
    label: undefined,
    backgroundColor: undefined,
    data: []
  }]
})

const $circleUsers = useCircleUsers()
const $circleBudget = useCircleBudget()
const $categories = useCategories()

const props = defineProps({
  transactions: {
    type: Object as PropType<Record[]>,
    required: true,
  }
})

watch(() => [$circleBudget.value.plannings, props.transactions], ([newPlan, newTrx], [oldPlan, oldTrx]) => {
  data.value = setData(newPlan as CircleBudgetPlannings[], newTrx as Record[])
}, { deep: true })

const filteredCategories = computed(() => Array.from($categories.value.data.filter((e) => e.type !== 'income' && e.type !== 'transfer' && e.type !== 'receive')
    .sort((a, b) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
}).map((e) => capitalizeFirstLetter(e.name))))

const sumOfPlanned = computed(() => $circleBudget.value.plannings?.reduce((sum: number, n: CircleBudgetPlannings) => sum + n.amount, 0))

function setData(plannings: CircleBudgetPlannings[], listTrx: Record[]): { labels: string[], datasets: Datasets[] } {
  const grouped = groupBy(listTrx.filter((val: Record) => val.category.type !== 'income'), (trx: Record) => `${trx.category.name}`);
  const sortedKeys = Object.keys(grouped).sort();

  const groupedTrx = sortedKeys.reduce((acc: any, key: any) => {
    acc[key] = grouped[key].map((trx: Record) => omit(trx, `${trx.category.name}`));
    return acc;
  }, {});

  const summedData = mapValues(groupedTrx, (values: Record[]) => {
    return reduce(values, (sum: number, n: Record) => sum + n.amount, 0);
  });

  return {
    labels: filteredCategories.value,
    datasets: [
      {
        label: 'Actual',
        backgroundColor: '#EC7514',
        data: Object.values(summedData),
      },
      {
        label: 'Planned',
        backgroundColor: '#0080a3',
        data: plannings?.sort((a, b) => {
          if (a.category.name > b.category.name) return 1;
          if (a.category.name < b.category.name) return -1;
          return 0;
        }).map((e) => e.amount) ?? []
      },
    ]
  }
}


</script>

<style scoped></style>
