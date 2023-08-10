<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
<!--      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">-->
<!--        <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">-->
<!--        Inving-->
<!--      </a>-->
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Sign up your account
          </h1>
          <form class="space-y-4 md:space-y-6">
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input v-model="email" type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" :required="true" @keyup.enter="onSubmitRegister">
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input v-model="password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" :required="true" @keyup.enter="onSubmitRegister">
            </div>
            <div>
              <label for="passwordConf" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password Confirmation</label>
              <input v-model="passwordConf" type="password" name="password" id="passwordConf" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" :required="true" @keyup.enter="onSubmitRegister">
            </div>
            <button type="button" :disabled="isLoadingSubmit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" @click="onSubmitRegister">
              <span v-if="isLoadingSubmit">
                <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
                Loading...
              </span>
              <span v-else>Sign Up</span>
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account? <nuxt-link  to="/" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</nuxt-link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {supabase} from "~/utils/functions";
import { toast } from 'vue3-toastify';
import {navigateTo} from "#app";
import va from '@vercel/analytics';

const email = ref<string>('')
const password = ref<string>('')
const passwordConf = ref<string>('')

const isLoadingSubmit = ref<boolean>(false)

definePageMeta({
  middleware: ['guest']
})

async function onSubmitRegister() {
  isLoadingSubmit.value = true

  va.track('Signup');

  try {
    if (password.value !== passwordConf.value) {
      throw 'Password Confirmation Invalid'
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      }
    })

    if(error) {
      throw error.message
    }

    const {data: _, status} = await useFetch('/api/users/create.user', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        id: data.user?.id
      })
    })

    if (status.value === 'success') {
      email.value = ''
      password.value = ''
      passwordConf.value = ''
    }

    toast.success('Register success, please check your email.')
    return navigateTo('/')
  } catch (e: any) {
    if(typeof(e) === "string") {
      toast.error(e)
    }
  }

  isLoadingSubmit.value = false
}
</script>
