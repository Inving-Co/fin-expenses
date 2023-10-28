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
                            Changes password of your account
                        </h1>
                        <form class="space-y-4 md:space-y-6">
                            <div>
                                <label for="newPassword"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    New Password</label>
                                <input v-model="newPassword" type="password" name="newPassword" id="newPassword"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="••••••••" :required="true">
                            </div>
                            <div>
                                <label for="confPassword"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirmation
                                    Password</label>
                                <input v-model="confPassword" type="password" name="confPassword" id="confPassword"
                                    placeholder="••••••••"
                                    class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    :required="true" @keyup.enter="onSubmitNewPassword">
                            </div>
                            <button type="button" :disabled="isLoadingSubmit"
                                class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                @click="onSubmitNewPassword">
                                <span v-if="isLoadingSubmit">
                                    <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
                                    Loading...
                                </span>
                                <span v-else>Change Password</span>
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
const newPassword = ref('')
const confPassword = ref('')

onMounted(async () => {
    const result = await supabase().auth.getSession()
    if (!result.data.session) {
        return navigateTo('/')
    }
})

async function onSubmitNewPassword() {
    isLoadingSubmit.value = true

    if (newPassword.value != confPassword.value) {
        toast.error('Confirmation password is not match');
        return;
    }

    const { data, error } = await supabase().auth.updateUser({
        password: newPassword.value
    })

    if (error) {
        toast.error(error.message);
    } else {
        toast.success('Password Updated');

        return navigateTo('/transactions')
    }

    isLoadingSubmit.value = false
}

</script>
