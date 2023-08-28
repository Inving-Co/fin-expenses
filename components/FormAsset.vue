<template>
  <div>
    <form ref="form" class="space-y-6">
      <div class="mb-1">
        <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
        <input v-model="formAsset.name" type="text" name="description" id="description"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
               placeholder="Example: Asset Name / Project Name" required @keyup.enter="onSave">
      </div>

      <div class="mb-1">
        <label for="amount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
        <input ref="inputRefAmount" name="amount" id="amount"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
               type="text" placeholder="Example: Rp2.000.000" required @keyup.enter="onSave"
               @input="formAsset.amount = $event.target?.value"/>
      </div>

      <div class="mb-1">
        <label for="estimatedReturnAmount" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Estimated
          Return Amount</label>
        <input ref="inputRefEstimatedReturnAmount" name="estimatedReturnAmount" id="estimatedReturnAmount"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
               type="text" placeholder="Example: Rp2.000.000" required @keyup.enter="onSave"
               @input="formAsset.estimatedReturnAmount = $event.target?.value"/>
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


      <button type="button" :disabled="isLoadingSubmit"
              class="w-full text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
import {useCurrencyInput} from 'vue-currency-input'
import {watchDebounced} from "@vueuse/shared";
import {EditableAsset} from "~/utils/types";
import {initTooltips} from "flowbite";

onMounted(() => {
  initTooltips()
})

const props = defineProps({
  asset: {
    type: Object as PropType<EditableAsset> | null,
  },
})

const assetTypes = [{
  name: 'LIQUID_ASSETS',
  description: 'Liquid assets can be quickly sold or converted to cash without significantly affecting their value.'
}, {
  name: 'ILLIQUID_ASSETS',
  description: 'Illiquid assets, may take longer to convert into cash, and their value may change in the process.'
}, {
  name: 'CASH_AND_CASH_EQUIVALENTS',
  description: 'This includes money in checking or savings accounts, as well as other forms of easily accessible funds.'
}]

const isLoadingSubmit = ref<boolean>(false)
const formAsset = ref<{
  name: string,
  amount: number | undefined,
  estimatedReturnAmount: number | undefined,
  estimatedReturnDate: string | undefined,
  platform: string | undefined
  type: string | undefined
}>({
  name: '',
  amount: undefined,
  estimatedReturnAmount: undefined,
  estimatedReturnDate: undefined,
  platform: undefined,
  type: undefined
})

const {inputRef: inputRefAmount} = useCurrencyInput({
  currency: 'IDR',
  locale: 'id-ID',
  precision: 0,
})

const {inputRef: inputRefEstimatedReturnAmount} = useCurrencyInput({
  currency: 'IDR',
  locale: 'id-ID',
  precision: 0,
})
const emit = defineEmits(['on-success', 'on-failed', 'update:modelValue', 'change'])


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
    }

    inputRefAmount.value.value = newVal?.amount
    inputRefEstimatedReturnAmount.value.value = newVal?.estimatedReturnAmount
  }
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
    }

    emit('on-success')
  }
  inputRefAmount.value.value = ''
  inputRefEstimatedReturnAmount.value.value = ''

  isLoadingSubmit.value = false
}
</script>

<style lang="scss">
//bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white
.dp-custom-input {
  background: #F9FAFB;
  border-color: #D1D5DB;
  color: gray;
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.625rem;
  display: block;
  width: 100%;
  border-radius: 0.5rem;
}
</style>
