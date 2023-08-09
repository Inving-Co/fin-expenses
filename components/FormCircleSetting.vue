<template>
  <div>
    <div class="font-semibold text-2xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-500 from-lime-600">{{
        capitalizeFirstLetter(circle?.name)
      }}
    </div>

    <label class="my-2 mt-4 relative inline-flex items-center cursor-pointer" @click.prevent="onToggleEmailReportChange(!circleUser?.receiveReport)">
      <input type="checkbox" :checked="circleUser?.receiveReport" class="sr-only peer">
      <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
      <span class="ml-3 text-sm font-semibold text-gray-900 dark:text-gray-300">Receive email report</span>
      <svg v-if="isLoadingToggle" aria-hidden="true" class="ml-2 w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-600"
           viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"/>
        <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"/>
      </svg>
    </label>


    <div class="flex block my-2">
      <input :value="copiedLink"
             ref="elink"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
             type="text"
             readonly/>

      <button
          class="ml-2 rounded-md text-center text-gray-500 bg-white border-none focus:ring-transparent hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          type="button" @click="copyText">
        <span class="sr-only"><icons-user-group-add/></span>
        <icons-copy/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Circle, CircleUser} from "~/utils/types";
import {toast} from "vue3-toastify";

const circle = ref<Circle | null>(null)
const circleUser = ref<CircleUser | null>(null)
const copiedLink = ref<string | null>(null)
const elink = ref<string | null>(null)
const isLoadingToggle = ref<boolean>(false)

const auth = useAuth()

const props = defineProps({
  circleId: {
    type: String,
  }
})

watch(() => props.circleId, async (value) => {
  if (value) {
    await activatorLoad(value)
    copiedLink.value = `${window.location.origin}/circles/${circle.value?.id}`
  }
})


const activatorLoad = async (value: string) => {
  const {data} = await useFetch(`/api/circles/${value}`, {
    server: false,
  })

  circle.value = data.value as any
  const myCircles = circle.value?.circleUsers.filter((e: CircleUser) => e.userId === auth.value?.userId) ?? []

  circleUser.value = myCircles.length > 0 ? myCircles[0] : null
}

function copyText() {
  const element = elink.value as any;
  element.select();
  element.setSelectionRange(0, 99999);
  document.execCommand('copy');

  toast.success('Copied to clipboard!')
}

async function onToggleEmailReportChange(receiveReport: boolean) {
  isLoadingToggle.value = true


  if (circleUser.value) {
    circleUser.value.receiveReport = receiveReport

    const {data: result, status} = await useFetch('/api/circleUsers/update.circleUsers', {
      method: 'POST',
      body: JSON.stringify({
        id: circleUser.value?.id,
        receiveReport
      })
    })

    if (status.value !== 'success') {
      circleUser.value.receiveReport = !receiveReport
    }
  }

  isLoadingToggle.value = false
}

</script>
