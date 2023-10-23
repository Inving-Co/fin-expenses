<template>
  <div>
    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget
      <span class="text-red-500">*</span>
    </label>
    <div class="flex gap-2 items-center justify-between">
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
          <span class="font-normal text-primary-200">{{ currencyIDRFormatter($circleUsers.selected?.currency, sum(budgetPlanningsData)) }}</span>
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

const {debounce, sum} = lodash;

const isBudgetUpdated = ref<boolean>(false)
const budget = ref<number | undefined>()
const isLoadingSubmitBudget = ref<boolean>(false)
const isLoadingPlanner = ref<boolean>(false)
const planner = ref<number[]>([])
const $categories = useCategories()
const $loading = useLoading();
const $circleUsers = useCircleUsers()
const $circleBudget = useCircleBudget();

const emit = defineEmits(['on-success'])
const selectedCircle = computed(() => $circleUsers.value.selected)
const expensesCategories = computed(() => $categories.value.data.filter((e: Category) => e.type !== 'income' && e.type !== 'receive' && e.type !== 'transfer'))
const isDisableSaveBudget = computed(() => (isLoadingSubmitBudget.value || isLoading.value || !isBudgetUpdated.value) && budgets.value?.length !== 0)
const isHideListCategory = computed(() => budgets.value?.length !== 0)
const budgetPlanningsData = computed(() => $circleBudget.value?.plannings.map((e) => e.amount) ?? [])

let debounceSubmit = undefined

onMounted(() => {
  debounceSubmit = debounce((value) => {
    if (budgets.value && budgets.value.length > 0) {
      onSaveBudgetPlanner(value.amount, value.category.id, budgets.value!.at(0)!.id)
    }
  }, 300)
})

watch(() => budget.value, (val) => {
  if (budgets.value && budgets.value.length > 0) {
    isBudgetUpdated.value = val !== budgets.value[0].amount
  }
})

watch(() => expensesCategories.value, (val) => {
  setInitialPlanner(val)
})

const {
  data: budgets,
  error: errorFetchBudgets,
  pending: isLoading,
  refresh: refreshBudgets,
} = await useFetch('/api/circleBudgets', {
  onRequest({request, response}) {
    $loading.value = true
  },
  onResponse: ({response}) => {
    $loading.value = false

    if (response._data.length > 0) {
      budget.value = response._data[0].amount
      $circleBudget.value.budget = response._data[0]
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

  if(errorFetchBudgetPlannings.value) return;

  let curBudgePlannings: CircleBudgetPlannings[];
  curBudgePlannings = budgetPlannings.value ?? [];

  $circleBudget.value.plannings = curBudgePlannings;

  if (curBudgePlannings && curBudgePlannings.length > 0) {
    for (const plan of curBudgePlannings) {
      const index = expensesCategories.value.map((e) => e.id).indexOf(plan.categoryId)

      planner.value[index] = +(100 * (plan.amount / (budget.value ?? 1))).toFixed(0);
    }
  }else {
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
  isLoadingSubmitBudget.value = true

  const {data: result, status} = await useFetch('/api/circleBudgets', {
    method: 'POST',
    body: JSON.stringify({
      amount: budget.value
    })
  })

  if (status.value === 'success') {
    await refreshBudgets()

    if (budgets.value) {
      isBudgetUpdated.value = budget.value !== budgets.value[0].amount
    }
    emit('on-success')
  }
  isLoadingSubmitBudget.value = false
}

</script>
