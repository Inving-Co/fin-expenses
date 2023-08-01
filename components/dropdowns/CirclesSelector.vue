<template>

  <general-modal id="modal-form-circle" title="Create Circle" subtitle="Circle mean to be your group"
                 :is-has-close="isHasClose" @on-mounted="modalFormCircle = $event">
    <template #body>
      <form-circle @on-success="modalFormCircle?.hide(); refreshCircles(); "/>
    </template>
  </general-modal>

  <general-modal id="modal-form-circle-invitation" title="Invite Member"
                 subtitle="Invite your family or friends to this circle"
                 @on-mounted="modalFormCircleInvitation = $event">
    <template #body>
      <form-circle-invitation :circle-id="selected ?? undefined"/>
    </template>
  </general-modal>

  <general-dropdown id="dropdownCircles" class="mt-2">
    <template #trigger="{activator}">
      <button
          class="h-[38px] inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          type="button" @click="activator">
        <span class="sr-only">Circles button</span>
        Circles
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
             viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="m1 1 4 4 4-4"/>
        </svg>
      </button>
    </template>
    <template #content="{activator}">
      <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
        <li v-for="circleUser in circleUsers">
          <div class="flex justify-between">
            <div class="flex p-2 w-full rounded hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center h-5">
                <input :id="circleUser?.circleId + `-radio`" :name="circleUser?.circleId + `-radio`"
                       type="radio" :value="circleUser?.circleId"
                       :checked="selected === circleUser?.circleId"
                       class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                       @change="onCircleChange(circleUser?.circle);"/>
              </div>
              <div class="ml-2 text-sm flex justify-between w-full gap-2">
                <label :for="circleUser?.circleId + `-radio`" class="font-medium text-gray-900 dark:text-gray-300">
                  <span>{{ capitalizeFirstLetter(circleUser?.circle.name) }}</span>
                </label>
              </div>
            </div>
            <button
                class="text-center text-gray-500 bg-white border-none focus:ring-transparent hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                type="button" @click="onCircleChange(circleUser?.circle); modalFormCircleInvitation?.show()">
              <span class="sr-only"><icons-user-group-add/></span>
              <icons-user-group-add/>
            </button>
          </div>
        </li>
        <li>
          <button
              class="w-full mt-2 text-center text-gray-500 bg-white border-none focus:ring-transparent hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button" @click="isHasClose=true; modalFormCircle?.show()">
            <span class="sr-only">Create</span>
            Create
          </button>
        </li>
      </ul>
    </template>
  </general-dropdown>
</template>

<script setup lang="ts">
import {capitalizeFirstLetter} from "~/utils/functions";
import {useCookie} from "#app";
import {Circle, ElementEvent} from "~/utils/types";
import FormCircleInvitation from "~/components/FormCircleInvitation.vue";
import {useTimeout} from "@vueuse/shared";

const emit = defineEmits(['on-mounted', 'on-changed'])
let modalFormCircle: ElementEvent | null = null
let modalFormCircleInvitation: ElementEvent | null = null
let selected = ref<string | null>(null)
const isHasClose = ref<boolean>(false)

const {data: circleUsers, refresh: refreshCircles} = await useFetch('/api/circleUsers', {
  server: false,
})

onMounted(() => {
  emit('on-mounted')

  refreshCircles()
})

watch(() => circleUsers.value, (value) => {
  if (value && value.length > 0) {
    onCircleChange(value[0].circle as Circle)
  } else {
    modalFormCircle?.show();
  }
})

function onCircleChange(value: Circle) {
  useCookie('selected-circle', {
    secure: true,
    sameSite: 'lax',
  }).value = JSON.stringify(value)

  selected.value = value.id

  /// I think the cookie itself was async, it means that when I put new value on circle
  /// It will still use the old value when I refresh the trx, so I need to delay some milliseconds
  /// to make it refresh later
  setTimeout(() => emit('on-changed'), 50)
}
</script>

<style scoped>

</style>
