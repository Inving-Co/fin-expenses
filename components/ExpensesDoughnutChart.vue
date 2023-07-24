<template>
  <div class="w-full flex justify-center">
    <div class="sm:w-1/4 sm:h-1/4 w-full h-full">
      <h3 class="font-bold">Expenses Structure</h3>
      <Doughnut v-if="data.labels.length > 0" class="my-4" :data="data" :options="{responsive: true, plugins: {
      legend: {
        display: false
      },
    }}"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Doughnut} from 'vue-chartjs'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import {forEach, groupBy, map, mapValues, omit, reduce, split} from 'lodash';
import {PropType} from "@vue/runtime-core";
import {Transaction} from "~/utils/types";
import {capitalizeFirstLetter} from "~/utils/functions";


interface Datasets {
  backgroundColor: string[],
  data: number[]
}

ChartJS.register(ArcElement, Tooltip, Legend)

const data = ref<{ labels: string[], datasets: Datasets[] }>({
  labels: [],
  datasets: [{
    backgroundColor: [],
    data: []
  }]
})

const props = defineProps({
  transactions: {
    type: Object as PropType<Transaction[]>,
    required: true,
  }
})


watch(() => props.transactions, (newVal, _) => {
  data.value = setData(newVal)
})


function setData(listTrx: Transaction[]): { labels: string[], datasets: Datasets[] } {
  const groupedTrx = mapValues(groupBy(listTrx, (trx: Transaction) => `${trx.category.id}/${trx.category.name}/${trx.category.color}`), (clist: Transaction[]) => clist.map((trx: Transaction) => omit(trx, `${trx.category.id}/${trx.category.name}/${trx.category.color}`)))
  const keys = Object.keys(groupedTrx)
  const values = Object.values(groupedTrx)

  let names = new Set()
  let colors = new Set()

  forEach(keys, (val: string) => {
    const splitted = split(val, '/')

    names.add(capitalizeFirstLetter(splitted[1]))
    colors.add(`#${splitted[2]}`)
  })

  const data = map(values, (values: Transaction[]) => reduce(values, (sum: number, n: Transaction) => sum + n.amount, 0))

  return {
    labels: Array.from(names) as string[],
    datasets: [{
      backgroundColor: Array.from(colors) as string[],
      data: data
    }]
  }
}


</script>

<style scoped>

</style>
