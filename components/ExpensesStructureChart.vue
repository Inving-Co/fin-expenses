<template>
  <div
    class="p-6 bg-white border border-gray-200 rounded-lg  drop-shadow-soft hover:drop-shadow-xl dark:bg-gray-800 dark:border-gray-700">
    <h3 class="font-bold">Expenses Structure</h3>
    <div class="flex-grow border-t mt-2 mb-4 border-gray-400" />
    <div class="mt-4 text-sm text-gray-500 font-bold dark:text-white">{{
      capitalizeFirstLetter(labelTime)
    }}</div>
    <div class="mb-3 text-2xl text-gray-500 font-bold dark:text-white">{{
      currencyIDRFormatter.format(sumOfAmount)
    }}</div>
    <Doughnut v-if="data.labels.length > 0" class="my-4" :data="data" :options="{
      responsive: true,
      elements: {
        center: {
          text: currencyIDRFormatter.format(sumOfAmount),
          color: '#9F9384', // Default is #000000
          fontStyle: 'Arial', // Default is Arial
          sidePadding: 50, // Default is 20 (as a percentage)
          minFontSize: 9, // Default is 20 (in px), set to false and text will not wrap.
          lineHeight: 25 // Default is 25 (in px), used for when text wraps
        }
      },
      plugins: {
        legend: {
          display: false
        },
        customPlugin: {
          consoleText: 'testText'
        }
      },
    }" :plugins="[{
  id: 'centerText',
  beforeDraw: onBeforeDraw
}]" />
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import lodash from 'lodash';
import { PropType } from "@vue/runtime-core";
import { Transaction } from "~/utils/types";
import { capitalizeFirstLetter } from "~/utils/functions";


interface Datasets {
  backgroundColor: string[],
  data: number[]
}

ChartJS.register(ArcElement, Tooltip, Legend,)

const { forEach, groupBy, map, mapValues, omit, reduce, split } = lodash;

const data = ref<{ labels: string[], datasets: Datasets[] }>({
  labels: [],
  datasets: [{
    backgroundColor: [],
    data: []
  }]
})

const props = defineProps({
  labelTime: {
    type: String,
    required: true,
  },
  transactions: {
    type: Object as PropType<Transaction[]>,
    required: true,
  }
})

onMounted(() => {
  if (props.transactions) {
    data.value = setData(props.transactions)
  }
})

watch(() => props.transactions, (newVal, _) => {
  data.value = setData(newVal)
})

const sumOfAmount = computed(() => props.transactions?.filter((val: Transaction) => val.category.type !== 'income').reduce((sum: number, n: Transaction) => sum + n.amount, 0))

function setData(listTrx: Transaction[]): { labels: string[], datasets: Datasets[] } {
  const groupedTrx = mapValues(groupBy(listTrx.filter((val: Transaction) => val.category.type !== 'income'), (trx: Transaction) => `${trx.category.id}/${trx.category.name}/${trx.category.color}`), (clist: Transaction[]) => clist.map((trx: Transaction) => omit(trx, `${trx.category.id}/${trx.category.name}/${trx.category.color}`)))
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

function onBeforeDraw(chart: any) {
  if (chart.config.options.elements.center) {
    // Get ctx from string
    let ctx = chart.ctx;

    // Get options from the center object in options
    let centerConfig = chart.config.options.elements.center;
    let fontStyle = centerConfig.fontStyle || 'Arial';
    let txt = centerConfig.text;
    let color = centerConfig.color || '#000';
    let maxFontSize = centerConfig.maxFontSize || 24;
    let sidePadding = centerConfig.sidePadding || 20;
    const innerRadius = chart._metasets[chart._metasets.length - 1].data[0].innerRadius;
    // const outerRadius = chart._metasets[0].data[0].outerRadius;

    let sidePaddingCalculated = (sidePadding / 100) * (innerRadius * 2)
    // Start with a base font of 30px
    ctx.font = "16px " + fontStyle;

    // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
    let stringWidth = ctx.measureText(txt).width;
    let elementWidth = (innerRadius * 2) - sidePaddingCalculated;

    // Find out how much the font can grow in width.
    let widthRatio = elementWidth / stringWidth;
    let newFontSize = Math.floor(30 * widthRatio);

    let elementHeight = (innerRadius * 2);

    // Pick a new font size so it will not be larger than the height of label.
    let fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
    let minFontSize = centerConfig.minFontSize;
    let lineHeight = centerConfig.lineHeight || 25;
    let wrapText = false;

    if (minFontSize === undefined) {
      minFontSize = 9;
    }

    if (minFontSize && fontSizeToUse < minFontSize) {
      fontSizeToUse = minFontSize;
      wrapText = true;
    }

    // Set font settings to draw it correctly.
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
    let centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
    ctx.font = fontSizeToUse + "px " + fontStyle;
    ctx.fillStyle = color;

    if (!wrapText) {
      ctx.fillText(txt, centerX, centerY);
      return;
    }

    let words = txt.split(' ');
    let line = '';
    let lines = [];

    // Break words up into multiple lines if necessary
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > elementWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }

    // Move the center up depending on line height and number of lines
    centerY -= (lines.length / 2) * lineHeight;

    for (let n = 0; n < lines.length; n++) {
      ctx.fillText(lines[n], centerX, centerY);
      centerY += lineHeight;
    }
    //Draw text in center
    ctx.fillText(line, centerX, centerY);
  }

}


</script>

<style scoped></style>
