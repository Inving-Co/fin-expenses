<template>
  <div class="flex items-center gap-4">
    <span v-if="currencySymbol" class="text-xl text-gray-500 font-bold dark:text-gray-300">{{currencySymbol}}</span>
    <input v-model="inputValue"
           @input="onInput"
           @blur="onBlur"
           :placeholder="`Example: ${currencySymbol} 20000`"
           :readonly="readOnly"
           class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
    />
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmits} from 'vue';
import { watchDebounced } from '@vueuse/core';

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
const isCalculating = ref(false);

watch(() => $circleUsers.value.selected, (val: Circle | null) => {
  if (val) {
    currencySymbol.value = getCurrencySymbol(val?.currency);
  }
})

watch(() => props.modelValue, (val) => {
  if (!isCalculating.value) {
    inputValue.value = val ? formatValue(val) : '';
  }
});

// Function to safely evaluate mathematical expressions
function evaluateExpression(expression: string): number | null {
  try {
    // Remove all spaces and validate the expression contains only numbers and basic operators
    const sanitizedExpr = expression.replace(/[^0-9+\-*/().]/g, '');
    if (!/^[\d+\-*/().]+$/.test(sanitizedExpr)) {
      return null;
    }
    // Evaluate the expression
    const result = new Function(`return ${sanitizedExpr}`)();
    return typeof result === 'number' && isFinite(result) ? result : null;
  } catch {
    return null;
  }
}

const onInput = () => {
  const value = inputValue.value.replace(/[^0-9+\-*/().]/g, '');
  
  if (value.match(/[+\-*/]/)) {
    isCalculating.value = true;
    inputValue.value = value;
    return;
  }

  const numericValue = parseFloat(value);
  if (!isNaN(numericValue)) {
    emit('update:modelValue', numericValue);
    if (!isCalculating.value) {
      const formattedValue = formatValue(numericValue);
      if (inputValue.value !== formattedValue) {
        inputValue.value = formattedValue;
      }
    }
  }
};

const onBlur = () => {
  if (isCalculating.value) {
    const result = evaluateExpression(inputValue.value);
    if (result !== null) {
      isCalculating.value = false;
      emit('update:modelValue', result);
      inputValue.value = formatValue(result);
    }
  }
};

watchDebounced(
  () => inputValue.value,
  (newValue) => {
    if (isCalculating.value) {
      const result = evaluateExpression(newValue);
      if (result !== null) {
        isCalculating.value = false;
        emit('update:modelValue', result);
        inputValue.value = formatValue(result);
      }
    }
  },
  { debounce: 1000 }
);

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
