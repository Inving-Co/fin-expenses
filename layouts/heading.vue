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
                  d="M12 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1ZM2 12C2 6.477 6.477 2 12 2h1.734l-.868 1.5C12.287 4.5 12 5.69 12 7a7 7 0 0 0 8.348 6.87l1.682-.327l-.543 1.626C20.162 19.137 16.417 22 12 22C6.477 22 2 17.523 2 12Zm18.5-5.584l.914 1.67l1.67.914l-1.67.914l-.914 1.67l-.914-1.67L17.916 9l1.67-.914l.914-1.67ZM7 12a5 5 0 1 1 10 0a5 5 0 0 1-10 0ZM7 12a5 5 0 1 1 10 0a5 5 0 0 1-10 0Z"
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
      <ul class="hidden sm:flex flex-nowrap gap-2">
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
        <li v-if="isLoggedIn">
          <span class="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg py-3">
            <nuxt-link to="/subscriptions"
                       :class="isCurrentPathActive('/subscriptions')">Subscriptions
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
  <div class="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
    <div class="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
      <NuxtLink to="/transactions" 
        class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
        <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500">Transactions</span>
      </NuxtLink>
      <NuxtLink to="/assets" 
        class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
        </svg>
        <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500">Assets</span>
      </NuxtLink>
      <NuxtLink to="/notes" 
        class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
        <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500">Notes</span>
      </NuxtLink>
      <NuxtLink to="/subscriptions" 
        class="inline-flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 group">
        <svg class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span class="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500">Subscriptions</span>
      </NuxtLink>
    </div>
  </div>

  <!-- Mobile User Menu -->
  <div v-if="isMobileUserMenuOpen" 
    class="md:hidden fixed bottom-16 right-0 z-50 my-4 mr-4 w-60 text-base list-none bg-white rounded-lg shadow-lg dark:bg-gray-700">
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
      <p class="text-sm text-gray-900 dark:text-white">{{ $auth.user?.name }}</p>
      <p class="text-sm font-medium text-gray-500 truncate dark:text-gray-400">{{ $auth.user?.email }}</p>
    </div>
    <ul class="py-2">
      <li>
        <NuxtLink to="/settings" 
          class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">
          <svg class="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Settings
        </NuxtLink>
      </li>
      <li>
        <button @click="handleSignOut" 
          class="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-500 dark:hover:bg-gray-600">
          <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign out
        </button>
      </li>
    </ul>
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

const isMobileUserMenuOpen = ref(false)

function toggleMobileUserMenu() {
  isMobileUserMenuOpen.value = !isMobileUserMenuOpen.value
}

// Close mobile menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (!target.closest('.mobile-user-menu') && !target.closest('[data-mobile-menu-toggle]')) {
      isMobileUserMenuOpen.value = false
    }
  })
})
</script>
