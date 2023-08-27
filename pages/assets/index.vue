<template>
  <general-modal id="modal-form-asset" title="Form Asset" @on-mounted="modalFormAsset = $event">
    <template #body>
      <form-asset :asset="selectedAsset"
                  @on-success="modalFormAsset?.hide(); selectedAsset = undefined; refreshAssets()"/>
    </template>
  </general-modal>
  <div class="pb-8">
    <div class="flex flex-wrap justify-between items-center">
      <div class="flex flex-col my-6">
        <span class="text-2xl text-gray-500">My Assets
            <span v-if="summaryAssets?._sum"
              class="inline-flex text-green-500 font-semibold tracking-tight">
              {{ currencyIDRFormatter.format(summaryAssets?._sum.amount ?? 0) }}
          </span>
        </span>
        <span class="text-md mt-2 text-gray-400">Track the value of your assets over time</span>
      </div>
      <button
          class="h-[38px] w-full mb-4 sm:w-1/6 sm:mb-0 items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
          type="button" @click="selectedAsset = undefined; modalFormAsset?.show()">
        <span class="sr-only">Create Assets</span>
        Create Assets
      </button>
    </div>

    <div v-if="assets?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="(asset, index) of assets"
           class="w-full p-6 bg-white border border-gray-200 rounded-lg drop-shadow-soft dark:bg-gray-800 dark:border-gray-700">
        <div class="flex justify-between mb-2">
          <div class="flex flex-col mb-2">
            <h5 class="text-2xl text-gray-500 dark:text-white">
              {{ currencyIDRFormatter.format(asset?.amount) }}

              <div
                  v-if="asset?.estimatedReturnAmount"
                  class="inline-flex text-green-500 text-sm align-top font-semibold tracking-tight">+{{
                  (100 - ((asset?.amount /
                      asset?.estimatedReturnAmount!) * 100)).toFixed(0)
                }}%
              </div>
            </h5>
            <div v-if="asset?.estimatedReturnAmount" class="text-md text-green-500 font-semibold tracking-tight">
              {{ currencyIDRFormatter.format(asset?.estimatedReturnAmount) }}
            </div>
          </div>
          <general-dropdown :id="`dropdownActionButton-${index}`">
            <template #trigger="{ activator }">
              <button
                  class="inline-flex items-center text-gray-500 bg-white hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  type="button" @click="activator">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor"
                        d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2Z"/>
                </svg>
              </button>
            </template>
            <template #content="{ activator }">
              <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
                <li>
                  <button type="button"
                          class="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          @click="selectedAsset = asset; modalFormAsset?.show();">Update
                  </button>
                </li>
                <li>
                  <button type="button"
                          class="w-full text-left block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          @click="onDelete(asset?.id)">Delete
                  </button>
                </li>
              </ul>
            </template>
          </general-dropdown>
        </div>
        <div class="flex justify-between">
          <span class="w-1/2 mb-3 text-gray-500 dark:text-gray-400 break-words">
            {{ asset?.name?.toUpperCase() }}
          </span>
          <span class="mb-3 font-normal text-sm text-right text-gray-500 dark:text-gray-400">
            {{ asset?.type.replaceAll('_', ' ') }}
          </span>
        </div>
        <div class="flex justify-between">
          <span v-if="asset?.estimatedReturnDate" class="font-normal text-gray-500 dark:text-gray-400">
            {{ format(parseISO(asset?.estimatedReturnDate!), 'dd/MM/yyyy') }}
          </span>
          <span v-else></span>
          <span class="font-normal text-gray-500 dark:text-gray-400">
            {{ asset?.platform?.toUpperCase() }}
          </span>
        </div>
      </div>
    </div>
    <div v-else
         class="flex text-2xl justify-center items-center align-center top-0 left-0 right-0 bottom-0 z-50 font-semibold p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full">
      <vue3-lottie :animationData="EmptyJSON" :height="400" :width="400"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Vue3Lottie} from "vue3-lottie";
import EmptyJSON from '~/assets/lottie/empty.json'

import {ElementEvent, EditableAsset} from "~/utils/types";
import {useLoading} from "~/composables/loading";
import {parseISO, format} from 'date-fns';
import {initTooltips} from 'flowbite';

const $loading = useLoading();
const $circleUsers = useCircleUsers()
const selectedAsset = ref<EditableAsset | undefined>()
const searchKey = ref<string>('')

let modalFormAsset: ElementEvent | null = null
const selectedCircle = computed(() => $circleUsers.value.selected)


definePageMeta({
  title: "AssetsPlanner",
  layout: 'heading',
});

const {
  data: assets,
  error: errorFetchAssets,
  pending: isLoading,
  refresh: refreshAssets,
} = await useFetch('/api/assets', {
  query: {
    key: searchKey,
  },
  server: false,
  onRequest({request, response}) {
    $loading.value = true
  },
  onResponse: (context) => {
    $loading.value = false
  },
  watch: [selectedCircle]
})

const {
  data: summaryAssets,
  pending: isLoadingSummary,
  refresh: refreshSummary,
} = await useFetch('/api/assets/summary.asset', {
  server: false,
  onRequest({request, response}) {
    $loading.value = true
  },
  onResponse: (context) => {
    $loading.value = false
  },
  watch: [selectedCircle]
})


async function onDelete(assetId: String) {
  $loading.value = true
  const {status} = await useFetch('/api/assets/delete.asset', {
    query: {
      id: assetId,
    },
  })

  if (status.value === 'success') {
    await refreshAssets()
  }

  $loading.value = false
}


</script>
