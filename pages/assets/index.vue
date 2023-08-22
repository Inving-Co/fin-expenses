import { ElementEvent, EditableAsset } from '../../utils/types';
<template>
  <general-modal id="modal-form-asset" title="Form Asset" @on-mounted="modalFormAsset = $event">
    <template #body>
      <form-asset :asset="selectedAsset" @on-success="modalFormAsset?.hide(); selectedAsset = undefined; refreshAssets()" />
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
      <div v-for="asset in assets"
        class="w-full p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{{ asset?.name }}</h5>
        </a>
        <div class="flex justify-between">
          <span class="mb-3 font-normal text-gray-500 dark:text-gray-400">
            {{ asset?.platform }}
          </span>
          <span class="mb-3 font-normal text-gray-500 dark:text-gray-400">
            {{ asset?.type }}
          </span>
        </div>
        <div class="flex justify-between">
          <span class="mb-3 font-normal text-gray-500 dark:text-gray-400">
            {{ currencyIDRFormatter.format(asset?.amount) }}
          </span>
          <span class="mb-3 font-normal text-gray-500 dark:text-gray-400">
            {{ currencyIDRFormatter.format(asset?.estimatedReturnAmount) }}
            {{ format(parseISO(asset?.estimatedReturnDate), 'dd/MM/yyyy') }}
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

const selectedAsset = ref<EditableAsset | undefined>()
const searchKey = ref<string>('')
let modalFormAsset: ElementEvent | null = null

definePageMeta({
  title: "AssetsPlanner",
  layout: 'heading',
});

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
  onRequest({ request, response }) {
    useLoading().value = true
  },
  onResponse: (context) => {
    useLoading().value = false
  },
})

</script>

<style scoped></style>
