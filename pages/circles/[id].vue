<template>
  <general-modal id="modal-confirm-join" title="Join Confirmation" subtitle="Are you sure want to join this circle?"
                 @on-mounted="modalConfirmJoin = $event">
    <template #body>
      <div class="flex justify-center w-full gap-4">
        <button type="button"
                class="hover:text-primary w-full h-12 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                @click="modalConfirmJoin?.hide()">
          No
        </button>
        <button type="button"
                class="text-white w-full h-12 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                @click="onSubmitJoin">
          <span v-if="isLoadingSubmit">
            <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin"/>
            Loading...
          </span>
          <span v-else>Yes</span>
        </button>
      </div>
    </template>
  </general-modal>

  <div class="flex flex-col items-center justify-center mx-auto md:h-screen lg:py-0">
    <div
        class="w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <div class="flex justify-between align-middle">
        <div>
          <h5 class="text-2xl tracking-tight font-light text-gray-700 dark:text-white">Join<span
              class="ml-2 font-bold text-gray-900"> {{ capitalizeFirstLetter(circle?.name) }}</span></h5>
          <small class="text-sm font-normal mb-3 text-gray-500 dark:text-gray-400">{{
              isHasJoined ? 'You have joined with this circle' : 'You\'re invited to join Circle\'s'
            }}</small>
        </div>
        <button v-if="userId && !isHasJoined" data-tooltip-target="tooltip-join" type="button"
                class="text-white w-12 h-12 bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                @click="modalConfirmJoin?.show()">
          <icons-login/>
          <span class="sr-only">Join Circle</span>
        </button>

        <span v-else-if="!userId" class="text-sm font-light text-gray-500 dark:text-gray-400">
              You're not logged in, please <nuxt-link to="/register"
                                                      class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</nuxt-link>
        </span>


        <div id="tooltip-join" role="tooltip"
             class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
          Join the circle
          <div class="tooltip-arrow" data-popper-arrow></div>
        </div>
      </div>
      <div class="border"/>
      <div class="font-normal py-2 text-gray-700">There's <span class="font-bold">{{
          circle?.circleUsers.length
        }}</span> user in the circle
      </div>

      <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
        <li v-for="circleUser in circle?.circleUsers">
          {{ circleUser.user.name ?? circleUser.user.email }}
        </li>
      </ul>
    </div>
    <div class="flex w-1/2 justify-end">
      <button v-if="userId" data-tooltip-target="tooltip-back-to-trx" type="button"
              class="rounded-lg mt-2 text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm p-2.5 text-center items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click="navigateTo('/transactions')">
        <icons-transaction/>
        <span class="sr-only">Back to Transaction</span>
      </button>
      <div id="tooltip-back-to-trx" role="tooltip"
           class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
        Back to Transaction
        <div class="tooltip-arrow" data-popper-arrow></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
import lodash from "lodash";
import {navigateTo, useCookie} from "#app";
import {initTooltips} from "flowbite";
import {ElementEvent} from "~/utils/types";
import {toast} from "vue3-toastify";

const {map, includes} = lodash

onMounted(() => {
  initTooltips()
})

let modalConfirmJoin: ElementEvent | null = null
const isLoadingSubmit = ref<boolean>(false)
const userId = useCookie('user-id')
const route = useRoute()
const {data: circle} = await useFetch(`/api/circles/${route.params.id}`, {
  watch: [isLoadingSubmit],
},)

const isHasJoined = computed(() => includes(map(circle.value?.circleUsers, (val: any) => val.userId), userId.value));

async function onSubmitJoin() {
  isLoadingSubmit.value = true

  const {data: result, status} = await useFetch('/api/circles/join.circle', {
    method: 'POST',
    body: JSON.stringify({
      circleId: circle.value?.id
    })
  })

  if (status.value === 'success') {
    toast.success('Success join the circle')

    modalConfirmJoin?.hide()
  }


  isLoadingSubmit.value = false
}
</script>
