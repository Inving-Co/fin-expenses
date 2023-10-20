<template>
  <div class="flex items-center gap-4">
    <span v-if="currencySymbol" class="text-xl text-gray-500 font-bold dark:text-gray-300">{{currencySymbol}}</span>
    <input v-model="inputValue"
           @input="onInput"
           :placeholder="`Example: ${currencySymbol} 20000`"
           :readonly="readOnly"
           class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue';

const props = defineProps({
  modelValue: Number,
  readOnly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const $circleUsers = useCircleUsers()
const inputValue = ref('');
const currencySymbol = ref('');

watch(() => $circleUsers.value.selected, (val: Circle | null) => {
  if (val) {
    currencySymbol.value = getCurrencySymbol(val?.currency);
  }
})

watch(() => props.modelValue, (val) => {
  inputValue.value = val ? formatValue(val) : '';
});

const onInput = () => {
  const lastChar = inputValue.value.slice(-1);
  if (lastChar === '.') {
    // If the last character is a decimal delimiter, bypass the formatting
    const sanitizedValue = inputValue.value.replace(/[^0-9.]/g, '');
    const numericValue = parseFloat(sanitizedValue);
    if (!isNaN(numericValue)) {
      emit('update:modelValue', numericValue);
    }
    return;
  }

  const sanitizedValue = inputValue.value.replace(/[^0-9.]/g, '');
  const numericValue = parseFloat(sanitizedValue);
  if (!isNaN(numericValue)) {
    emit('update:modelValue', numericValue);
    const formattedValue = formatValue(numericValue);
    // Update inputValue without triggering another input event
    if (inputValue.value !== formattedValue) {
      inputValue.value = formattedValue;
    }
  }
};

const isIDR = currencySymbol.value === 'IDR'
const locale = isIDR ? 'id-ID' : 'en-US'

const formatValue = (value: any) => {
  const options = {
    style: 'decimal',
    maximumFractionDigits: isIDR ? 0 : 2,
  };
  return new Intl.NumberFormat(locale, options).format(value);
};

const getCurrencySymbol = (currencyCode: any) => {
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode
  }).formatToParts(0);
  const currencyPart = parts.find(part => part.type === 'currency');
  return currencyPart ? currencyPart.value : '';
};


</script>

<style scoped>
.currency-input {
  /* Your styles here */
}
</style>
