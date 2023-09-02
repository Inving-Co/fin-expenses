<template>
    <input v-model="inputValue"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
        type="text" placeholder="Example: 20000" required />
</template>

<script setup lang="ts">
import { Circle } from '~/utils/types';
import { watchDebounced } from '@vueuse/shared';

const emit = defineEmits(['on-change', 'update:modelValue'])

const props = defineProps({
    modelValue: {
        type: Number,
    },
})

const $circleUsers = useCircleUsers()
const inputValue = ref()
const amount = ref(0)
const currency = ref('IDR')

onMounted(() => {
    if (props.modelValue) {
        inputValue.value = new Intl.NumberFormat('ID', {
            style: 'currency',
            currency: currency.value,
            maximumFractionDigits: currency.value === 'IDR' ? 0 : 2
        }).format(props.modelValue);
    }
})

watch(() => $circleUsers.value.selected, (val: Circle | null) => {
    if (val) {
        currency.value = val?.currency
    }
})

watch(() => props.modelValue, (val) => {
    if (!val) {
        inputValue.value = ''
    } else {
        inputValue.value = new Intl.NumberFormat('ID', {
            style: 'currency',
            currency: currency.value,
            maximumFractionDigits: currency.value === 'IDR' ? 0 : 2
        }).format(val);
    }
})

watchDebounced(() => amount.value, (value) => {
    emit('update:modelValue', value);
}, { debounce: 1000 })

watch(() => inputValue.value, (val) => {
    if (val[val.length - 1] === ',' || val === '') {
        return
    }

    else if (val[val.length - 1] !== ',') {
        const curAmount = val.replace(/[^0-9,]/g, '').replace(',', '.');
        amount.value = +curAmount

        const maximumFractionDigits = curAmount.split('.') ? curAmount.split('.')[1]?.length ?? 0 : 0;

        inputValue.value = new Intl.NumberFormat('ID', {
            style: 'currency',
            currency: currency.value,
            maximumFractionDigits: maximumFractionDigits
        }).format(amount.value);
    }

    emit('on-change', amount.value)
})

</script>