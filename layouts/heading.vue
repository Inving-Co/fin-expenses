<template>
  <general-loading :is-loading="isLoading || isLoadingRequest"/>

  <general-modal id="modal-about" title="About Inving" @on-mounted="modalAbout = $event">
    <template #body>
      <div class="flex w-full text-slate-500 text-[14px] mt-3 dark:text-gray-300">
        <span class="mr-1">
          Please read
        </span>
        <a
            class="underline-offset-1 font-semibold underline dark:text-gray-300"
            target="_blank"
            href="https://money.inving.co/privacy-policy">
          Our Privacy Policy
        </a>
      </div>
      <div class="flex flex-col justify-start	w-full text-slate-500 text-[14px] mt-3 dark:text-gray-300">
        Loading Paper Plane
        <span class="w-full text-slate-600 text-[14px] dark:text-gray-300">Animation by <a
            class="font-semibold"
            href="https://lottiefiles.com/zeffchris"
            target="_blank">Jeffrey Christopher</a> on <a
            class="font-semibold"
            href="https://lottiefiles.com/animations/loading-40-paperplane-pXSmJB5J2C"
            target="_blank">LottieFiles</a>
        </span>
      </div>
      <div class="flex flex-col justify-start	w-full text-slate-500 text-[14px] mt-3 dark:text-gray-300">
        Empty Animation
        <span class="w-full text-slate-600 text-[14px] dark:text-gray-300">Animation by <a
            class="font-semibold"
            href="https://lottiefiles.com/netebjj3gh"
            target="_blank">CorelleDesign</a> on <a
            class="font-semibold"
            href="https://lottiefiles.com/animations/empty-box-quj8cXrfR0"
            target="_blank">LottieFiles</a>
        </span>
      </div>
    </template>
  </general-modal>

  <div v-if="!isRoot"
       class="pt-5 bg-white dark:bg-gray-800 border-b h-[200px] sm:h-[130px] flex flex-col justify-between">
    <div class="flex justify-between flex-col sm:flex-row px-16 ">
      <div class="flex items-center">
        <NuxtImg class="h-8" src="/app_icon.png" alt="app icon"/>
        <span class="mx-2 text-gray-300">
                    <svg class="h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="1.5" d="M15 4L8 20"/>
                    </svg>
                </span>
        <circles-selector/>
      </div>
      <div class="flex align-center mt-3 sm:mt-0">
        <button @click="toggleDarkMode" id="theme-toggle" type="button"
                class="h-[45px] w-[45px] text-gray-500 dark:text-gray-400 mr-4 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5">
          <svg v-if="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" fill-rule="evenodd"
                  d="M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1ZM2 12a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm17 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1Zm-6 8a1 1 0 1 0-2 0v1a1 1 0 1 0 2 0v-1Zm5.364-3.05a1 1 0 1 0-1.414 1.414l.707.707a1 1 0 0 0 1.414-1.414l-.707-.707ZM4.929 4.929a1 1 0 0 1 1.414 0l.707.707A1 1 0 0 1 5.636 7.05l-.707-.707a1 1 0 0 1 0-1.414ZM7.05 18.364a1 1 0 1 0-1.414-1.414l-.707.707a1 1 0 1 0 1.414 1.414l.707-.707ZM19.071 4.929a1 1 0 0 1 0 1.414l-.707.707a1 1 0 1 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM7 12a5 5 0 1 1 10 0a5 5 0 0 1-10 0Z"
                  clip-rule="evenodd"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor"
                  d="m15.844 3.344l-1.428.781l1.428.781l.781 1.428l.781-1.428l1.428-.781l-1.428-.781l-.781-1.428l-.781 1.428Zm-5.432.814A8 8 0 1 0 18.93 16A9 9 0 0 1 10 7c0-.98.131-1.937.412-2.842ZM2 12C2 6.477 6.477 2 12 2h1.734l-.868 1.5C12.287 4.5 12 5.69 12 7a7 7 0 0 0 8.348 6.87l1.682-.327l-.543 1.626C20.162 19.137 16.417 22 12 22C6.477 22 2 17.523 2 12Zm18.5-5.584l.914 1.67l1.67.914l-1.67.914l-.914 1.67l-.914-1.67L17.916 9l1.67-.914l.914-1.67Z"/>
          </svg>

        </button>
        <general-dropdown id="dropdownActionMenuButton" class="w-full sm:mt-0 md:w-[100px]">
          <template #trigger="{ activator }">
            <button
                class="h-[45px] w-full inline-flex items-center justify-between text-gray-500 bg-white drop-shadow hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg dark:ring-2 dark:ring-gray-700 text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
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
              <span
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-default dark:hover:text-white">v{{
                  useRuntimeConfig().public.CLIENT_VERSION
                }}</span>
              </li>
              <li>
                <div class="block dark:hover:bg-gray-600">
                  <button
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      type="button" @click="modalAbout?.show()">
                    About
                  </button>
                </div>
              </li>
              <li v-if="isLoggedIn">
                <div class="block dark:hover:bg-gray-600">
                  <button
                      class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      type="button" @click="navigateTo('/change-password')">
                    Change Password
                  </button>
                </div>
              </li>
              <li>
                <general-signout class="block px-4 py-2 dark:hover:bg-gray-600"/>
              </li>
            </ul>
          </template>
        </general-dropdown>
      </div>
    </div>

    <div
        class="flex justify-between sm:px-16 px-0 text-sm font-medium text-center text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700 overflow-x-auto ">
      <ul class="flex flex-nowrap gap-2">
        <li>
          <span class="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg py-3">
            <nuxt-link to="/transactions"
                       :class="isCurrentPathActive('/transactions')">Transactions
            </nuxt-link>
          </span>
        </li>
        <li>
          <span class="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg py-3">
            <nuxt-link to="/assets"
                       :class="isCurrentPathActive('/assets')">Assets
            </nuxt-link>
          </span>
        </li>
        <li v-if="isLoggedIn">
          <span class="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg py-3">
            <nuxt-link to="/notes"
                       :class="isCurrentPathActive('/notes')">Notes
            </nuxt-link>
          </span>
        </li>

      </ul>
      <ul>
        <li>
          <span class="hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 rounded-lg py-3 relative">
            <a @click="openPage" :class="isCurrentPathActive('/feedback')" class="flex text-primary-500 font-bold">
              <span class="hidden sm:block mr-1">Give Us Your</span>
              Feedback!
            </a>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <div class="px-6 sm:px-16">
    <slot/>
  </div>
  <prompt-update/>

  <bubble-chat v-if="isLoggedIn" class="fixed bottom-0 right-0"/>
</template>

<script setup lang="ts">
import CirclesSelector from "~/components/dropdowns/CirclesSelector.vue";
import {useRoute} from "vue-router";

import {useAuth} from "~/composables/auth";
import {useCategories} from "~/composables/categories";
import {useCircleUsers} from "~/composables/circles";
import {useTransactions} from "~/composables/transactions";
import {useDarkMode, useLoading} from "~/composables/loading";
import {checkAuth} from "~/utils/functions";

let modalAbout: ElementEvent | null = null

onMounted(() => {
  checkAuth()
})

const isDarkMode = useDarkMode()

const isLoggedIn = computed(() => useCookie('user-id').value)

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;

  document.documentElement.classList.toggle('dark', isDarkMode.value);
  localStorage.setItem('dark-mode', JSON.stringify(isDarkMode.value));
  localStorage.setItem('nuxt-color-mode', isDarkMode.value ? 'dark' : 'light')

  if (isDarkMode.value) {
    document.documentElement.style.backgroundColor = '#101827';
  } else {
    document.documentElement.style.backgroundColor = '#f9fafb';
  }
};

onMounted(() => {
  const savedDarkMode = JSON.parse(localStorage.getItem('dark-mode') as any);
  if (savedDarkMode !== null) {
    isDarkMode.value = savedDarkMode;

    document.documentElement.classList.toggle('dark', isDarkMode.value);
  }
});

onUnmounted(() => {
  localStorage.setItem('dark-mode', JSON.stringify(isDarkMode.value));
});


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

function openPage() {
  umTrackEvent('cta-feedback-btn');
  window.open('https://invingco.canny.io/', '_blank');
}

function isCurrentPathActive(path: string): string {
  const route = useRoute();

  return classNavigation[path === route.fullPath ? "active" : "inactive"];
}

</script>

