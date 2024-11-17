<template>
  <div
      class="p-6 bg-white border border-gray-200 rounded-lg drop-shadow-soft hover:drop-shadow-xl dark:bg-gray-800 dark:border-gray-700">
    <div class="flex justify-between items-center">
      <h3 class="font-bold dark:text-gray-300">Expenses Structure</h3>
      <button v-if="isFiltered"
          class="h-[30px] p-1 text-gray-500 hover:text-gray-700 focus:outline-none font-medium rounded-lg text-sm dark:text-gray-400"
          type="button" @click="resetFilter">
        <icons-refresh class="inline" />
      </button>
    </div>
    <hr class="flex-grow border-t mt-2 mb-4 border-gray-400"/>
    <div class="mt-4 text-sm text-gray-500 font-bold dark:text-gray-300">{{
        capitalizeFirstLetter(labelTime)
      }}
    </div>
    <div class="mb-3 text-2xl text-gray-500 font-bold dark:text-gray-300">{{
        currencyIDRFormatter($circleUsers.selected?.currency, sumOfAmount)
      }}
    </div>
    <Doughnut v-if="data.labels.length > 0" class="my-4" :data="data" :options="{
      responsive: true,
      onClick: (event, elements) => {
        if (elements && elements.length > 0) {
          const index = elements[0].index;
          const categoryId = categoryIds[index];
          handleChartClick(categoryId);
        }
      },
      elements: {
        center: {
          text: currencyIDRFormatter($circleUsers.selected?.currency, sumOfAmount),
          color: '#9F9384',
          fontStyle: 'Arial',
          sidePadding: 50,
          minFontSize: 9,
          lineHeight: 25
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.raw;
              return ` ${currencyIDRFormatter($circleUsers.selected?.currency, value)}`;
            }
          }
        }
      },
    }" :plugins="[{
  id: 'centerText',
  beforeDraw: onBeforeDraw
}]"/>
  </div>
</template>

<script setup lang="ts">
import {Doughnut} from 'vue-chartjs'
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js'
import lodash from 'lodash';
import {PropType} from "@vue/runtime-core";
import {Record} from "~/utils/types";
import {capitalizeFirstLetter} from "~/utils/functions";
import {useCircleUsers} from "~/composables/circles";
import {useCategories} from "~/composables/categories";

interface Datasets {
  backgroundColor: string[],
  data: number[]
}

ChartJS.register(ArcElement, Tooltip, Legend)

const {forEach, groupBy, map, mapValues, omit, reduce, split} = lodash;

const data = ref<{ labels: string[], datasets: Datasets[] }>({
  labels: [],
  datasets: [{
    backgroundColor: [],
    data: []
  }]
})

const categoryIds = ref<string[]>([])
const previousFilterState = ref<string[]>([])
const hasChartFilter = ref(false)
const selectedCategoryId = ref<string | null>(null)
const $circleUsers = useCircleUsers()
const $categories = useCategories()

const emit = defineEmits(['on-filter-changed'])

const props = defineProps({
  labelTime: {
    type: String,
    required: true,
  },
  transactions: {
    type: Object as PropType<Record[]>,
    required: true,
  }
})

const isFiltered = computed(() => hasChartFilter.value)

onMounted(() => {
  if (props.transactions) {
    data.value = setData(props.transactions)
  }
})

watch(() => props.transactions, (newVal, _) => {
  data.value = setData(newVal)
})

const sumOfAmount = computed(() => props.transactions?.filter((val: Record) => val.category.type !== 'income').reduce((sum: number, n: Record) => sum + n.amount, 0))

function setData(listTrx: Record[]): { labels: string[], datasets: Datasets[] } {
  const groupedTrx = mapValues(groupBy(listTrx.filter((val: Record) => val.category.type !== 'income'), (trx: Record) => `${trx.category.id}/${trx.category.name}/${trx.category.color}`), (clist: Record[]) => clist.map((trx: Record) => omit(trx, `${trx.category.id}/${trx.category.name}/${trx.category.color}`)))
  const keys = Object.keys(groupedTrx)
  const values = Object.values(groupedTrx)

  let names = new Set()
  let colors = new Set()
  categoryIds.value = []

  forEach(keys, (val: string) => {
    const [id, name, color] = split(val, '/')
    names.add(capitalizeFirstLetter(name))
    colors.add(`#${color}`)
    categoryIds.value.push(id)
  })

  // Update chart options to highlight selected category
  const backgroundColors = Array.from(colors) as string[];
  if (selectedCategoryId.value) {
    const selectedIndex = categoryIds.value.findIndex(id => id === selectedCategoryId.value);
    if (selectedIndex !== -1) {
      // Make other segments more transparent
      backgroundColors.forEach((color, index) => {
        if (index !== selectedIndex) {
          backgroundColors[index] = color + '80'; // Add 50% transparency
        }
      });
    }
  }

  return {
    labels: Array.from(names) as string[],
    datasets: [{
      backgroundColor: backgroundColors,
      data: map(values, (val: Record[]) => reduce(val, (sum: number, n: Record) => sum + n.amount, 0))
    }]
  }
}

function handleChartClick(categoryId: string) {
  const selectedCircle = $circleUsers.value.selected;
  if (!selectedCircle) return;

  // If clicking the same category, reset the filter
  if (selectedCategoryId.value === categoryId) {
    resetFilter();
    return;
  }

  // Store current filter state before changing it
  const cats = useCookie<string>(`${selectedCircle.id}-current-filtered-categories-selected`);
  previousFilterState.value = cats.value ? cats.value.split(',') : [];
  
  // Reset all categories checked state
  $categories.value.data.forEach((cat: any) => {
    cat.checked = false;
  });

  // Find and check the clicked category
  const category = $categories.value.data.find((cat: any) => cat.id === categoryId);
  if (category) {
    category.checked = true;
  }

  // Save to cookie and emit event
  cats.value = categoryId;
  hasChartFilter.value = true;
  selectedCategoryId.value = categoryId;
  emit('on-filter-changed', [categoryId]);
}

function resetFilter() {
  const selectedCircle = $circleUsers.value.selected;
  if (!selectedCircle) return;

  // Reset all categories checked state
  $categories.value.data.forEach((cat: any) => {
    cat.checked = false;
  });

  // Restore previous filter state
  previousFilterState.value.forEach((categoryId) => {
    const category = $categories.value.data.find((cat: any) => cat.id === categoryId);
    if (category) {
      category.checked = true;
    }
  });

  // Save to cookie and emit event
  const cats = useCookie<string>(`${selectedCircle.id}-current-filtered-categories-selected`);
  cats.value = previousFilterState.value.length > 0 ? previousFilterState.value.join(',') : undefined;
  hasChartFilter.value = false;
  selectedCategoryId.value = null;
  emit('on-filter-changed', previousFilterState.value);
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
