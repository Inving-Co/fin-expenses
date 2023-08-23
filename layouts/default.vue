<template>
  <general-loading :is-loading="isLoading || isLoadingRequest" />
  <div class="sm:px-16">
    <slot />
  </div>
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
</script>
