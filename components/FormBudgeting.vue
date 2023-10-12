<template>
  <div>
    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget
    <span class="text-red-500">*</span></label>
    <general-currency-field v-model="budget" name="amount-budgeting" class="mb-3" />
    <button  type="button"
      :disabled="isDisableSaveBudget"
      :class="`${isDisableSaveBudget ? 'bg-gray-500' : 'bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700'} w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800`"
      @click="onSave">
      <span v-if="isLoadingSubmit">
        <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
        Loading...
      </span>
      <span v-else>Save</span>
    </button>
    <div class="mt-5">
      <div v-for="category of expensesCategories" class="my-6 text-gray-700 dark:text-gray-400">
        <span class="font-semibold">{{ capitalizeFirstLetter(category.name) }}</span>

        <div class="flex items-center gap-4">
          <span>0%</span>
          <input :id="`${category.id}-minmax-range`" class="rounded-lg overflow-hidden appearance-none bg-gray-300 dark:bg-gray-500 h-[14px] w-full" type="range" min="1" max="100" step="1" :value="100 / expensesCategories.length" />
          <span>100%</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const isBudgetUpdated = ref<boolean>(false)
const budget = ref<number | undefined>()
const isLoadingSubmit = ref<boolean>(false)
const $categories = useCategories()
const $loading = useLoading();
const $circleUsers = useCircleUsers()

const emit = defineEmits(['on-success'])
const selectedCircle = computed(() => $circleUsers.value.selected)
const expensesCategories = computed(() => $categories.value.data.filter((e: Category) => e.type !== 'income' &&  e.type !== 'receive' && e.type !== 'transfer'))
const isDisableSaveBudget = computed(() => (isLoadingSubmit.value || isLoading.value || !isBudgetUpdated.value) && budgets.value?.length !== 0)

watch(() => budget.value, (val) => {
  if(budgets.value && budgets.value.length > 0) {
    isBudgetUpdated.value = val !== budgets.value[0].amount
  }
})

// onMounted(() => {
//   const slider = document.querySelector('.slider');
//   const value = document.querySelector('.value');

//   slider.oninput = function() {
//     const percentage = (slider.value - slider.min) / (slider.max - slider.min) * 100;
//     value.innerHTML = slider.value;
//     slider.style.background = `linear-gradient(to right, #4dc0b5 0%, #4dc0b5 ${percentage}%, #e0e0e0 ${percentage}%, #e0e0e0 100%)`;
//   }
// })

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

    if(response._data.length > 0) {
      budget.value = response._data[0].amount
    }
  },
  watch: [selectedCircle]
})


async function onSave() {
  isLoadingSubmit.value = true

  const {data: result, status} = await useFetch('/api/circleBudgets', {
    method: 'POST',
    body: JSON.stringify({
      amount: budget.value
    })
  })

  if (status.value === 'success') {
    budget.value = 0

    await refreshBudgets()
    if(budgets.value)
      isBudgetUpdated.value =  budget.value !== budgets.value[0].amount
    emit('on-success')
  }
  isLoadingSubmit.value = false
}

</script>
