<template>
  <div>
    <form ref="form" class="space-y-6">
      <div class="mb-1">
        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name <span class="text-red-500">*</span></label>
        <input v-model="formAsset.name" type="text" name="description" id="description"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
               placeholder="Example: Asset Name / Project Name" required @keyup.enter="onSave">
      </div>

      <div class="mb-1">
        <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount <span class="text-red-500">*</span></label>
        <general-currency-field name="amount" v-model="formAsset.amount" @keyup.enter="onSave" />
      </div>

      <div class="mb-1">
        <label class="block text-sm font-medium text-gray-900 dark:text-white">Asset Type</label>
        <div v-for="assetType of assetTypes"
             class="my-2 inline-flex items-center mx-1">
          <div :data-tooltip-target="`tooltip-default-${assetType.name}`">
            <input v-model="formAsset.type" :id="`radio-${assetType.name}`" type="radio" :value="assetType.name"
                   class="w-4 h-4 hidden peer text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                   :name="`radio-${assetType.name}`" required @keyup.enter="onSave">
            <label :for="`radio-${assetType.name}`"
                   class="inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-primary-500 peer-checked:border-primary-600 peer-checked:text-primary-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
              <div class="text-lg font-semibold">
                {{ capitalizeFirstLetter(assetType.name.replaceAll('_', ' ')) }}
              </div>
            </label>
            <div :id="`tooltip-default-${assetType.name}`" role="tooltip"
                 class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
              {{ assetType.description }}
              <div class="tooltip-arrow" data-popper-arrow></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!isExpanded" class="flex flex-col flex-grow max-w-xl h-[45px] overflow-hidden z-20">
        <div class="flex justify-between items-center py-2">
          <label for="expand" class="dark:text-white font-semibold">
            Additional
          </label>
          <button
            name="expand"
            class="h-[30px] p-1 focus:outline-none font-medium rounded-lg text-sm dark:text-white"
            type="button" @click="isExpanded = true">
            <svg xmlns="http://www.w3.org/2000/svg" class="rotate-180" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m17 14l-5-5m0 0l-5 5"/></svg>		
          </button>
        </div>
      </div>

      <div v-else class="flex flex-col flex-grow max-w-xl overflow-hidden z-50">
        <div class="flex justify-between items-center py-2 mb-2">
          <label for="collapse" class="dark:text-white font-semibold">
            Additional
          </label>
          <button
            name="collapse"
            class="h-[30px] p-1 focus:outline-none font-medium rounded-lg text-sm dark:text-white"
            type="button" @click="isExpanded = false">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m17 14l-5-5m0 0l-5 5"/></svg>		
          </button>
        </div>
        <div class="space-y-6">
          <div class="mb-1">
            <label for="estimatedReturnAmount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estimated
              Return Amount</label>
              <general-currency-field name="estimatedReturnAmount" v-model="formAsset.estimatedReturnAmount" @keyup.enter="onSave" />

          </div>

          <div class="mb-1">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estimated Return Date</label>
            <VueDatePicker v-model="formAsset.estimatedReturnDate" name="datepicker" id="datepicker" locale="id-ID"
                          format="dd/MM/yyyy" input-class-name="dp-custom-input" hide-input-icon
                          :enable-time-picker="false"
                          placeholder="Select Date" auto-apply/>
          </div>

          <div class="mb-1">
            <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Platform</label>
            <input v-model="formAsset.platform" type="text" name="description" id="description"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Example: Pintu / Alami / Bibit" required @keyup.enter="onSave">
          </div>

          <label class="my-2 mt-4 relative inline-flex items-center cursor-pointer"
            @click.prevent="formAsset.isAutoRefresh = !formAsset.isAutoRefresh">
            <input type="checkbox" :checked="formAsset.isAutoRefresh" class="sr-only peer">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600">
            </div>
            <span class="ml-3 text-sm font-semibold text-gray-900 dark:text-gray-300">Auto Refresh</span>
          </label>
        </div>

      </div>

      <button type="button" :disabled="isLoadingSubmit || !isButtonEnabled"
              :class="`${!isButtonEnabled? 'bg-gray-500':'bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700'} w-full text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800`"
              @click="onSave">
        <span v-if="isLoadingSubmit">
          <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin"/>
          Loading...
        </span>
        <span v-else>Save</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import {watchDebounced} from "@vueuse/shared";
import {EditableAsset} from "~/utils/types";
import {initTooltips} from "flowbite";


onMounted(() => {
  initTooltips()
  emit('on-mounted')
})

const props = defineProps({
  asset: {
    type: Object as PropType<EditableAsset> | null,
  },
})

const assetTypes = [{
  name: 'liquid_assets',
  description: 'Liquid assets can be quickly sold or converted to cash without significantly affecting their value.'
}, {
  name: 'illiquid_assets',
  description: 'Illiquid assets, may take longer to convert into cash, and their value may change in the process.'
}, {
  name: 'cash_and_cash_equivalents',
  description: 'This includes money in checking or savings accounts, as well as other forms of easily accessible funds.'
}]

const isExpanded = ref<boolean>(false)
const isLoadingSubmit = ref<boolean>(false)
const formAsset = ref<{
  name: string,
  amount: number | undefined,
  estimatedReturnAmount: number | undefined,
  estimatedReturnDate: string | undefined,
  platform: string | undefined
  type: string | undefined
  isAutoRefresh: boolean | undefined
}>({
  name: '',
  amount: undefined,
  estimatedReturnAmount: undefined,
  estimatedReturnDate: undefined,
  platform: undefined,
  type: undefined,
  isAutoRefresh: undefined
})

const emit = defineEmits(['on-success', 'on-failed', 'update:modelValue', 'change', 'on-mounted'])

watchDebounced(formAsset.value, (value) => emit('update:modelValue', value), {debounce: 1000})

watch(() => props.asset, (newVal, oldVal) => {
  if (newVal != oldVal) {
    formAsset.value = {
      name: newVal?.name ?? '',
      amount: newVal?.amount,
      estimatedReturnAmount: newVal?.estimatedReturnAmount,
      estimatedReturnDate: newVal?.estimatedReturnDate,
      platform: newVal?.platform,
      type: newVal?.type,
      isAutoRefresh: newVal?.isAutoRefresh

    }
  }
})
const isButtonEnabled = computed(() => {
  const name = formAsset.value.name
  const amount = formAsset.value.amount

  return (!!name && !!amount)
})

async function onSave() {
  isLoadingSubmit.value = true

  // name, amount, estimatedReturnAmount, platform, type
  const {data: result, status} = await useFetch(props.asset ? '/api/assets/update.asset' : '/api/assets/create.asset', {
    method: 'POST',
    body: JSON.stringify({
      id: props.asset?.id,
      name: formAsset.value.name,
      amount: formAsset.value.amount,
      estimatedReturnAmount: formAsset.value.estimatedReturnAmount,
      estimatedReturnDate: formAsset.value.estimatedReturnDate,
      platform: formAsset.value.platform,
      type: formAsset.value.type,
      isAutoRefresh: formAsset.value.isAutoRefresh
    })
  })

  if (status.value === 'success') {
    formAsset.value = {
      name: '',
      amount: undefined,
      estimatedReturnAmount: undefined,
      estimatedReturnDate: undefined,
      platform: undefined,
      type: undefined,
      isAutoRefresh: undefined
    }

    emit('on-success')
  }
  isLoadingSubmit.value = false
}
</script>


<style lang="scss">
.dp-custom-input {
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.625rem;
  display: block;
  width: 100%;
  border-radius: 0.5rem;
}

.light-mode .dp-custom-input {
  background: #F9FAFB;
  border-color: #D1D5DB;
  color: gray;
}

.dark-mode .dp-custom-input {
  background: #4b5563;
  border-color: #6b7280;
  color: #D1D5DB;
}
</style>