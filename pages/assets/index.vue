<template>
  <general-modal id="modal-form-asset" title="Form Asset" @on-mounted="modalFormAsset = $event">
    <template #body>
      <form-asset :asset="selectedAsset"
        @on-success="modalFormAsset?.hide(); selectedAsset = undefined; refreshAssets()" />
    </template>
  </general-modal>
  <div class="pb-8">
    <div class="flex justify-between items-center">
      <div class="flex flex-col my-6">
        <span class="text-2xl text-gray-500">My Assets</span>
        <span class="text-md mt-2 text-gray-400">Track the value of your assets over time</span>
      </div>
      <button
        class="h-[38px] inline-flex items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        type="button" @click="selectedAsset = undefined; modalFormAsset?.show()">
        <span class="sr-only">Create Assets</span>
        Create Assets
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div v-for="(asset, index) of assets"
        class="w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <!-- <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{{ asset?.name }}</h5> -->
        <div class="flex justify-between mb-2">
          <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {{ currencyIDRFormatter.format(asset?.amount) }}
            <span :data-tooltip-target="`tooltip-estimated-return-amount-${index}`"
              class="text-green-500 text-sm align-top">+{{ (100 - ((asset?.amount /
                asset?.estimatedReturnAmount) * 100)).toFixed(0)
              }}%</span>
          </h5>
          <general-dropdown id="dropdownActionButton">
            <template #trigger="{ activator }">
              <button
                class="inline-flex items-center text-gray-500 bg-white hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                type="button" @click="activator">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M12 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2m0-6a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2a2 2 0 0 1 2-2Z" />
                </svg>
              </button>
            </template>
            <template #content="{ activator }">
              <ul class="py-1 text-sm text-gray-700 dark:text-gray-200">
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

        <div :id="`tooltip-estimated-return-amount-${index}`" role="tooltip"
          class="absolute z-50 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
          {{ currencyIDRFormatter.format(asset?.estimatedReturnAmount) }}
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
        <div class="flex justify-between">
          <span class="w-1/2 mb-3 font-normal text-gray-500 dark:text-gray-400 break-words">
            {{ capitalizeFirstLetter(asset?.name) }}
          </span>
          <span class="mb-3 font-normal text-right text-gray-500 dark:text-gray-400">
            {{ asset?.type }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="font-normal text-gray-500 dark:text-gray-400">
            {{ format(parseISO(asset?.estimatedReturnDate), 'dd/MM/yyyy') }}
          </span>
          <span class="font-normal text-gray-500 dark:text-gray-400">
            {{ asset?.platform?.toUpperCase() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElementEvent, EditableAsset, Asset } from "~/utils/types";
import { useLoading } from "~/composables/loading";
import { parseISO, format } from 'date-fns';
import { initTooltips } from 'flowbite';

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

onMounted(() => {
  initTooltips()
})

const {
  data: assets,
  error: errorFetchAssets,
  pending: isLoading,
  refresh: refreshAssets,
} = await useFetch<{
  data: Asset[]
}>('/api/assets', {
  query: {
    key: searchKey,
  },
  server: false,
  onRequest({ request, response }) {
    $loading.value = true
  },
  onResponse: (context) => {
    $loading.value = false
  },
  watch: [selectedCircle]
})


async function onDelete(assetId: String) {
  $loading.value = true
  const { status } = await useFetch('/api/assets/delete.asset', {
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
