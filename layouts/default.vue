<template>
  <general-loading :is-loading="isLoading"/>

  <div class="my-4 sm:mx-16 mx-8">
    <slot />
  </div>
</template>

<script setup>
import {useCategories} from "~/composables/categories";
import {useCircleUsers} from "~/composables/circles";
import {useTransactions} from "~/composables/transactions";

const $categories = useCategories()
const $circleUsers = useCircleUsers()
const $transactions = useTransactions()

const isLoading = computed(() => $categories.value.isLoading || $circleUsers.value.isLoading || $transactions.value.isLoading)
</script>
