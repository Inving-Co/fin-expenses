<template>
    <section class="dark:bg-gray-900">
        <div class="flex md:flex-row flex-col-reverse items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <!--      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">-->
            <!--        <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">-->
            <!--        Inving-->
            <!--      </a>-->
            <div>
                <div
                    class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1
                            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Forgot password
                        </h1>
                        <span class="text-sm font-light leading-tight tracking-tight text-gray-900 md:text-xl dark:text-white">
                            Fill your email and we will send the link to reset password
                        </span>
                        <form class="space-y-4 md:space-y-6">
                            <div>
                                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                                email</label>
                                <input v-model="email" type="email" name="email" id="email"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="name@company.com" :required="true">
                            </div>
                            <button type="button" :disabled="isLoadingSubmit"
                                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                @click="onSubmit">
                                <span v-if="isLoadingSubmit">
                                    <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
                                    Loading...
                                </span>
                                <span v-else>Send Email</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { toast } from 'vue3-toastify';

const isLoadingSubmit = ref(false)
const email = ref('')

onMounted(async () => {
    const result = await supabase().auth.getSession()
    if (result.data.session) {
        return navigateTo('/transactions')
    }
})

async function onSubmit() {
    isLoadingSubmit.value = true

    if (!email.value) {
        toast.error('Email can\'t be empty');
        return;
    }

    const { data, error } = await supabase().auth.resetPasswordForEmail(email.value, {
        redirectTo: `${window.location.origin}/`
    })

    if (error) {
        toast.error(error.message);
    } else {
        toast.success('Please check your email');
        email.value = ''
    }

    isLoadingSubmit.value = false
}

</script>
