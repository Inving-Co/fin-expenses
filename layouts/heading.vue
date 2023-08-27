<template>
  <general-loading :is-loading="isLoading || isLoadingRequest"/>

  <!-- {{ isLoading }}
  {{ $categories.isLoading }}
   {{ $circleUsers.isLoading }}
  {{ $transactions.isLoading }} -->

  <div v-if="!isRoot" class="pt-5 bg-white px-16 border-b">
    <div class="flex items-center justify-between flex-wrap">
      <div class="flex items-center">
        <img class="h-8" src="/app_icon.png" alt="login illustration"/>
        <span class="mx-2 text-gray-300">
                    <svg class="h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="1.5" d="M15 4L8 20"/>
                    </svg>
                </span>
        <circles-selector/>
      </div>

      <general-dropdown :id="`action-menu-mobile-trx-${index}`">
        <template #trigger="{ activator }">
          <button
              class="h-[38px] inline-flex items-center text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              type="button" @click="activator">
            Menu
            <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m1 1 4 4 4-4"/>
            </svg>
          </button>
        </template>

        <template #content="{ activator }">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            <li>
              <span class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">v{{
                  useRuntimeConfig().public.CLIENT_VERSION
                }}</span>
            </li>
            <li>
              <general-signout class="block px-4 py-2 dark:hover:bg-gray-600"/>
            </li>
          </ul>
        </template>
      </general-dropdown>
    </div>

    <div
        class="mt-4 text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul class="flex flex-wrap gap-2">
        <li>
          <span class="hover:bg-gray-100 rounded-lg py-3"><nuxt-link to="/transactions"
                                                                     :class="isCurrentPathActive('/transactions')">Transactions</nuxt-link></span>
        </li>
        <li>
          <span class="hover:bg-gray-100 rounded-lg py-3"><nuxt-link to="/assets"
                                                                     :class="isCurrentPathActive('/assets')">Assets</nuxt-link></span>
        </li>
      </ul>
    </div>
  </div>
  <div class="px-6 sm:px-16">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import CirclesSelector from "~/components/dropdowns/CirclesSelector.vue";
import {useRoute} from "vue-router";

import {useCategories} from "~/composables/categories";
import {useCircleUsers} from "~/composables/circles";
import {useTransactions} from "~/composables/transactions";
import {useLoading} from "~/composables/loading";


defineNuxtComponent({
  name: "HeadingLayout",
})

const route = useRoute()


const isLoading = useLoading();
const $categories = useCategories();
const $circleUsers = useCircleUsers();
const $transactions = useTransactions();

const isLoadingRequest = computed(
    () =>
        $categories.value.isLoading ||
        $circleUsers.value.isLoading ||
        $transactions.value.isLoading
);
const isRoot = computed(() => route.fullPath === '/')

const classNavigation = {
  active:
      "inline-block p-4 text-primary-600 border-b-2 border-primary-600 active dark:text-primary-500 dark:border-primary-500",
  inactive:
      "inline-block p-4 border-transparent hover:text-gray-600 dark:hover:text-gray-300",
};

function isCurrentPathActive(path: string): string {
  const route = useRoute();

  return classNavigation[path === route.fullPath ? "active" : "inactive"];
}

</script>
