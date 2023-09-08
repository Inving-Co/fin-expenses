import { Asset } from '../utils/types';
<template>
    <table v-if="!$isMobile()" class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 sticky top-0 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-6 py-3">
                    Name
                </th>
                <th scope="col" class="px-6 py-3">
                    Platform
                </th>
                <th scope="col" class="px-6 py-3">
                    Amount
                </th>
                <th scope="col" class="px-6 py-3">
                    Type
                </th>
                <th scope="col" class="px-6 py-3">
                    Estimated Return Amount
                </th>
                <th scope="col" class="px-6 py-3">
                    Estimated Return Date
                </th>
                <th scope="col" class="px-6 py-3">
                    Date
                </th>
            </tr>
        </thead>
        <tbody class="overflow-y-scroll">
            <tr v-for="as in assetHistory"
                class="bg-white hover:bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <span>{{ capitalizeFirstLetter(as.name) }}</span>
                </th>
                <td class="px-6 py-4">
                    <span>{{ capitalizeFirstLetter(as?.platform) }}</span>
                </td>
                <td class="px-6 py-4">
                    <span>{{ currencyIDRFormatter($circleUsers.selected?.currency,
                        as?.amount) }}</span>
                </td>
                <td class="px-6 py-4">
                    <span>{{ capitalizeFirstLetter(as?.type?.replaceAll('_', ' ')) }}</span>
                </td>

                <td class="px-6 py-4">
                    <span v-if="as?.estimatedReturnAmount">{{ currencyIDRFormatter($circleUsers.selected?.currency,
                        as?.estimatedReturnAmount) }}</span>
                </td>
                <td class="px-6 py-4">
                    <span v-if="as?.estimatedReturnDate">{{ format(parseISO(as?.estimatedReturnDate), 'dd/MM/yyyy')
                    }}</span>
                </td>
                <td class="px-6 py-4">
                    <span>
                        {{ format(parseISO(as?.createdAt), 'dd/MM/yyyy') }}
                    </span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { Asset } from '~/utils/types';
import { endOfToday, format, parseISO, startOfMonth, } from 'date-fns'

const assetId = ref<String>()

const $circleUsers = useCircleUsers()

const props = defineProps({
    asset: {
        type: Object as PropType<Asset> | undefined,
    },
})

watch(() => props.asset, (val) => {
    assetId.value = val?.id
})


const {
    data: assetHistory,
    error: error,
    pending: isLoading,
    refresh: refreshHistory,
} = await useFetch('/api/assetHistory', {
    query: {
        assetId: assetId
    },
    immediate: false,
    watch: [assetId]
})

</script>