<template>
  <general-loading :is-loading="isLoading || isLoadingRequest" />
  <div :class="`${route.path === '/' ? '':'sm:px-16'}`">
    <slot />
  </div>
  <prompt-update />
</template>

<script setup lang="ts">
import { useCategories } from "~/composables/categories";
import { useCircleUsers } from "~/composables/circles";
import { useTransactions } from "~/composables/transactions";
import { useLoading } from "~/composables/loading";

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

const route = computed(() => useRouter().currentRoute.value)
</script>
