<template>
  <div>
    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget
      <span class="text-red-500">*</span>
    </label>
    <div>
      <div class="flex gap-2 items-center justify-between mb-6">
        <general-currency-field v-model="budget" name="amount-budgeting" class="w-full"/>
        <button type="button"
                :disabled="isDisableSaveBudget"
                :class="`${isDisableSaveBudget ? 'bg-gray-500' : 'bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700'} align-center w-10 h-10 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm pa-2.5 text-center dark:focus:ring-primary-800`"
                @click="onSaveBudget">
      <span v-if="isLoadingSubmitBudget">
        <icons-circular-indicator class="inline w-4 h-4 text-white animate-spin"/>
      </span>
          <icons-save v-else class="h-5 w-full"/>
        </button>
      </div>
      <div class="flex gap-3 justify-between">
        <div
            v-for="(window, index) of windowTime"
            class="h-10 inline-flex items-center mb-4">
          <input v-model="selectedWindowTime.selectedValue" :id="`radio-${index}`" type="radio" :value="window.value"
                 class="w-4 h-4 hidden peer text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                 :name="`radio-${index}`" required
                 @change="selectedWindowTime.selectedResult = onDateChanges($event.target.value)">
          <label :for="`radio-${index}`"
                 class="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
            <div class="text-md font-semibold">
              {{ capitalizeFirstLetter(window.label) }}
            </div>
          </label>
        </div>
      </div>
    </div>
    <div v-if="budget && isHideListCategory" class="mt-5 max-h-56">
      <hr class="w-full my-8 border-gray-200 dark:border-gray-700">
      <!--      <div class="flex justify-end">-->
      <!--        <button type="button"-->
      <!--                    :disabled="isDisableSaveBudget"-->
      <!--                    :class="`${isDisableSaveBudget ? 'bg-gray-500' : 'bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700'} justify-around align-center w-20 h-10 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm pa-2.5 text-center dark:focus:ring-primary-800`"-->
      <!--                    @click="onSaveBudget">-->
      <!--          <span v-if="isLoadingSubmitBudget">-->
      <!--            <icons-circular-indicator class="inline w-4 h-4 text-white animate-spin"/>-->
      <!--          </span>-->
      <!--          <span class="flex w-full items-center justify-center" v-else><icons-save class="h-5 mr-2"/>Save</span>-->
      <!--        </button>-->
      <!--      </div>-->
      <div class="flex justify-between">
        <span class="font-semibold">Total</span>
        <div class="flex gap-4">
          <span class="font-normal text-primary-200">{{
              currencyIDRFormatter($circleUsers.selected?.currency, sum(budgetPlanningsData))
            }}</span>
          <span class="font-semibold w-20 text-primary-500">{{ sum(planner).toFixed(0) }}%</span>
        </div>
      </div>
      <hr class="w-full my-8 border-gray-200 dark:border-gray-700">
      <div v-for="(category, index) of expensesCategories"
           class="flex items-center justify-between my-6 text-gray-700 dark:text-gray-400 ">
        <div class="font-semibold">{{ capitalizeFirstLetter(category.name) }}</div>
        <div class="flex gap-2 items-center">
          <span
              class="font-semibold">{{
              currencyIDRFormatter($circleUsers.selected?.currency, budget * (planner[index] / 100).toFixed(2))
            }}</span>
          <input
              v-model="planner[index]"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-20 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              min="0"
              max="100"
              type="number"
              @input="(event) => debounceSubmit({category: category, percentage: event.target.value, amount: budget * (planner[index] / 100)})"
          />
          <span class="font-semibold">%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import lodash from 'lodash';

import {useCircleBudget} from "~/composables/circles";
import {Category, CircleBudgetPlannings} from "~/utils/types";
import {
  addMonths, differenceInMonths,
  endOfMonth,
  endOfToday,
  endOfWeek,
  endOfYesterday, format, isSameMonth, isSameWeek, isToday, parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  startOfYesterday, subMonths
} from "date-fns";
import {toast} from "vue3-toastify";

const {debounce, sum} = lodash;

const isBudgetUpdated = ref<boolean>(false)
const budget = ref<number | undefined>()
const isLoadingSubmitBudget = ref<boolean>(false)
const isLoadingPlanner = ref<boolean>(false)
const planner = ref<number[]>([])
const selectedWindowTime = ref<{
  selectedValue: string,
  selectedResult: { start: Date, end: Date } | undefined
}>({selectedValue: '1 month', selectedResult: onDateChanges('1 month')})
const $categories = useCategories()
const $loading = useLoading();
const $circleUsers = useCircleUsers()
const $circleBudget = useCircleBudget();

const emit = defineEmits(['on-success'])
const selectedCircle = computed(() => $circleUsers.value.selected)
const expensesCategories = computed(() => $categories.value.data.filter((e: Category) => e.type !== 'income' && e.type !== 'receive' && e.type !== 'transfer'))
const isDisableSaveBudget = computed(() => (isLoadingSubmitBudget.value || isLoading.value || !isBudgetUpdated.value) && currentBudget.value)
const isHideListCategory = computed(() => !currentBudget.value || !isBudgetUpdated.value)
const budgetPlanningsData = computed(() => $circleBudget.value?.plannings.map((e) => e.amount) ?? [])

const windowTime: { label: string, value: string }[] = [
  {
    label: '1 Day',
    value: '1 day'
  },
  {
    label: '1 Week',
    value: '1 week',
  },
  {
    label: '1 Month',
    value: '1 month',
  },
  {
    label: '3 Months',
    value: '3 months',
  },
  {
    label: '6 Months',
    value: '6 months',
  }
]

let debounceSubmit = undefined

onMounted(() => {
  debounceSubmit = debounce((value) => {
    if (currentBudget.value && currentBudget.value) {
      onSaveBudgetPlanner(value.amount, value.category.id, currentBudget.value!.id)
    }
  }, 800)
})

watch(() => budget.value, (val) => {
  if (currentBudget.value) isBudgetUpdated.value = val !== currentBudget.value?.amount
})

watch(() => selectedWindowTime.value.selectedResult, (val) => {
  if (currentBudget.value) {
    if (val?.end) {
      val.end.setSeconds(0)
      val.end.setMilliseconds(0);
    }

    isBudgetUpdated.value = val?.end.toISOString() !== currentBudget.value?.endedAt as any;
  }
})

watch(() => expensesCategories.value, (val) => {
  setInitialPlanner(val)
})

const {
  data: currentBudget,
  error: errorFetchBudgets,
  pending: isLoading,
  refresh: refreshBudgets,
} = await useFetch('/api/circleBudgets', {
  onRequest({request, response}) {
    $loading.value = true
  },
  onResponse: ({response}) => {
    $loading.value = false

    if (response._data) {
      budget.value = response._data.amount
      selectedWindowTime.value.selectedValue = getDateRangeString(parseISO(response._data.startedAt), parseISO(response._data.endedAt))
      $circleBudget.value.budget = response._data
    } else {
      $circleBudget.value.budget = undefined
      $circleBudget.value.plannings = []
      budget.value = undefined
    }
    fetchCircleBudgetPlannings()
  },
  watch: [selectedCircle]
})

async function fetchCircleBudgetPlannings() {
  const {
    data: budgetPlannings,
    error: errorFetchBudgetPlannings,
  } = await useFetch(`/api/circleBudgetPlannings`, {
    params: {
      circleBudgetId: $circleBudget.value.budget?.id
    },
    onRequest({request, response}) {
      $loading.value = true
    },
    onResponse: ({response}) => {
      $loading.value = false
    },
  })

  if (errorFetchBudgetPlannings.value) return;

  let curBudgePlannings: CircleBudgetPlannings[];
  curBudgePlannings = budgetPlannings.value ?? [];

  $circleBudget.value.plannings = curBudgePlannings;

  if (curBudgePlannings && curBudgePlannings.length > 0) {
    for (const plan of curBudgePlannings) {
      const index = expensesCategories.value.map((e) => e.id).indexOf(plan.categoryId)

      planner.value[index] = +(100 * (plan.amount / (budget.value ?? 1))).toFixed(0);
    }
  } else {
    setInitialPlanner(expensesCategories.value)
  }
}

function setInitialPlanner(categories: Category[]) {
  for (const item of categories) {
    planner.value.push(0)
  }
}

async function onSaveBudgetPlanner(amount: number, categoryId: string, circleBudgetId: string) {
  isLoadingPlanner.value = true

  const {data: result, status} = await useFetch('/api/circleBudgetPlannings', {
    method: 'POST',
    body: JSON.stringify({
      amount, categoryId, circleBudgetId
    })
  })

  if (status.value === 'success') {
    await fetchCircleBudgetPlannings()
  }
  isLoadingPlanner.value = false
}

async function onSaveBudget() {
  const startTime = selectedWindowTime.value.selectedResult?.start
  const endTime = selectedWindowTime.value.selectedResult?.end

  if (!startTime || !endTime) {
    return toast.error('Please select the Range Time of Budget')
  }

  isLoadingSubmitBudget.value = true

  const formatPattern = 'yyyy-MM-dd HH:mm'

  const {data: result, status} = await useFetch('/api/circleBudgets', {
    method: 'POST',
    body: JSON.stringify({
      amount: budget.value, windowTime: {
        start: format(startTime, formatPattern),
        end: format(endTime, formatPattern)
      }
    })
  })

  if (status.value === 'success') {
    await refreshBudgets()

    if (currentBudget.value) {
      isBudgetUpdated.value = budget.value !== currentBudget.value.amount
      budget.value = currentBudget.value.amount
    }
    emit('on-success')
  }
  isLoadingSubmitBudget.value = false
}


function onDateChanges(value: string): { start: Date, end: Date } | undefined {

  switch (value) {
    case('1 day'):
      return {start: startOfToday(), end: endOfToday()}

    case '1 week':
      return {start: startOfWeek(new Date()), end: endOfWeek(new Date())};

    case '1 month':
      return {start: startOfMonth(new Date()), end: endOfMonth(new Date())};

    case '3 months':
      return {start: startOfMonth(new Date()), end: addMonths(new Date(), 2)};

    case '6 months':
      return {start: startOfMonth(new Date()), end: addMonths(new Date(), 5)};

    default:
      throw new Error('Invalid period');
  }
}

function getDateRangeString(start: Date, end: Date): string {
  if (isToday(start) && isToday(end)) {
    return '1 day';
  }

  if (isSameWeek(start, new Date()) && isSameWeek(end, new Date())) {
    return '1 week';
  }

  if (isSameMonth(start, new Date())) {
    const monthDifference = differenceInMonths(end, start);
    switch (monthDifference) {
      case 0:
        return '1 month';
      case 2:
        return '3 months';
      case 5:
        return '6 months';
      default:
        throw new Error('Invalid date range');
    }
  }

  throw new Error('Invalid date range');
}

</script>
