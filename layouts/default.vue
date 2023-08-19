<template>
  <general-loading :is-loading="isLoading || isLoadingRequest"/>

  <div v-if="isLoggedIn" class="pt-5 bg-white px-16 border-b">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img class="h-8" src="/app_icon.png" alt="login illustration">
        <span class="mx-2 text-gray-300">
        <svg class="h-8" xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 24 24"><path fill="none" stroke="currentColor"
                                       stroke-linecap="round"
                                       stroke-linejoin="round"
                                       stroke-width="1.5" d="M15 4L8 20"/></svg>
      </span>
        <circles-selector/>
      </div>

      <general-signout/>
    </div>

    <div class="mt-4 text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul class="flex flex-wrap -mb-px">
        <li class="mr-2">
          <nuxt-link to="/transactions" :class="isCurrentPathActive('/transactions')">Transactions</nuxt-link>
        </li>
        <li class="mr-2">
          <nuxt-link to="/assets" :class="isCurrentPathActive('/assets')">Assets Planner</nuxt-link>
        </li>
      </ul>
    </div>

  </div>
  <div class="sm:px-16">
    <slot/>
  </div>
</template>

<script setup lang="ts">
import {useCategories} from "~/composables/categories";
import {useCircleUsers} from "~/composables/circles";
import {useTransactions} from "~/composables/transactions";
import {useLoading} from "~/composables/loading";
import {useAuth} from "~/composables/auth";
import CirclesSelector from "~/components/dropdowns/CirclesSelector.vue";
import {useRoute} from "vue-router";

const isLoading = useLoading()
const $categories = useCategories()
const $circleUsers = useCircleUsers()
const $transactions = useTransactions()
const $auth = useAuth()

const isLoadingRequest = computed(() => $categories.value.isLoading || $circleUsers.value.isLoading || $transactions.value.isLoading)

const isLoggedIn = computed(() => $auth.value?.userId)

const classNavigation = {
  active: 'inline-block p-4 text-primary-600 border-b-2 border-primary-600 rounded-t-lg active dark:text-primary-500 dark:border-primary-500',
  inactive: 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
}

function isCurrentPathActive(path: string): string {
  const route = useRoute()

  return classNavigation[path === route.fullPath ? 'active':'inactive']
}

</script>
