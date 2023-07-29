<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <!--      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">-->
      <!--        <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">-->
      <!--        Inving-->
      <!--      </a>-->
      <div
          class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign in to your account
          </h1>
          <form class="space-y-4 md:space-y-6">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input v-model="email" type="email" name="email" id="email"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     placeholder="name@company.com" :required="true" @keyup.enter="onSubmitLogin">
            </div>
            <div>
              <label for="password"
                     class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input v-model="password" type="password" name="password" id="password" placeholder="••••••••"
                     class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                     :required="true" @keyup.enter="onSubmitLogin">
            </div>
            <div class="flex items-center justify-between">
              <a href="#" class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot
                password?</a>
            </div>
            <button type="button" :disabled="isLoadingSubmit"
                    class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                    @click="onSubmitLogin">
              <span v-if="isLoadingSubmit">
                <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin"/>
                Loading...
              </span>
              <span v-else>Sign In</span>
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?
              <nuxt-link to="/register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign
                up
              </nuxt-link>
            </p>
          </form>
        </div>
        <button type="button"
                class="w-full mt-4 text-gray-400 bg-transparent hover:bg-gray-100 border-transparent focus:border-transparent focus:ring-0 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                @click="() => navigateTo('/transactions')">
          <span>Access as Guest</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {supabase} from "~/utils/functions";
import {toast} from 'vue3-toastify';
import {navigateTo, useCookie, useNuxtApp} from "#app";

const email = ref<string>('')
const password = ref<string>('')

const isLoadingSubmit = ref<boolean>(false)

definePageMeta({
  middleware: ['guest']
})

async function onSubmitLogin() {
  isLoadingSubmit.value = true

  const {data, error} = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    toast.error(error.message);
  } else {
    const {data: result, status} = await useFetch(`/api/users/${data.user?.id}`, {
      method: 'POST',
      query: {
        email: data.user?.email
      }
    })
    useCookie('user-id', {
      secure: true,
      sameSite: 'lax',
    }).value = `${result.value?.id}`
    return navigateTo('/transactions')
  }


  isLoadingSubmit.value = false
}
</script>
