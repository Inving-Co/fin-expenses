<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="font-semibold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-500 from-lime-600">
        {{ capitalizeFirstLetter(circle?.name) }}
      </div>
      <div class="relative inline-block text-left">
        <button type="button" class="inline-flex justify-center w-full text-sm font-medium text-primary-600 border border-primary-600 rounded-lg px-4 py-2 hover:bg-primary-600 hover:text-white focus:ring-4 focus:ring-primary-300" @click="openDropdown = !openDropdown">
          Actions
          <svg xmlns="http://www.w3.org/2000/svg" class="-mr-1 ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06 0L10 10.58l3.71-3.37a.75.75 0 111.06 1.06l-4.25 3.75a.75.75 0 01-1.06 0l-4.25-3.75a.75.75 0 010-1.06z" clip-rule="evenodd" />
          </svg>
        </button>

        <div v-if="openDropdown" class="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
          <div class="py-1" role="none">
            <button type="button" class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="emit('show-archive-circle-confirm', circle)">
              Archive
            </button>
            <button type="button" :disabled="isLoadingExport" class="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="exportCircle(circle)">
              Export 
              <icons-circular-indicator v-if="isLoadingExport" class="inline w-3 h-3 ml-1 text-primary-500 self-center animate-spin"/>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Management Section -->
    <div class="mt-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your expense and income categories</p>
        </div>
        <button type="button"
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200"
                @click="onAddCategory">
          <icons-plus class="w-4 h-4 mr-2"/>
          Add Category
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
        <div v-for="(category, index) of $categories.data.filter((cat: any) => cat.type !== 'receive' && cat.type !== 'transfer' && cat.circleId === circle?.id)" 
             :key="category.id"
             class="relative transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
          <div class="flex items-start justify-between py-2.5 px-4">
            <div class="min-w-0 flex-1">
              <span class="text-sm font-medium text-gray-900 dark:text-white truncate block">
                {{ capitalizeFirstLetter(category.name) }}
              </span>
              <span class="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': category.type === 'income',
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300': category.type === 'expense',
                      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300': category.type === 'debt'
                    }">
                {{ capitalizeFirstLetter(category.type) }}
              </span>
            </div>
            <div class="flex items-center gap-1 ml-4">
              <button type="button"
                      class="p-1 text-gray-500 hover:text-purple-600 rounded-lg transition-colors duration-200"
                      @click="onEditCategory(category)"
                      title="Edit Category">
                <icons-edit class="w-4 h-4"/>
              </button>
              <button type="button"
                      class="p-1 text-gray-500 hover:text-red-600 rounded-lg transition-colors duration-200"
                      @click="showDeleteConfirm(category)"
                      title="Delete Category">
                <icons-trash class="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
        <div v-if="$categories.data.filter((cat: any) => cat.type !== 'receive' && cat.type !== 'transfer' && cat.circleId === circle?.id).length === 0"
             class="py-3 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No categories found. Click "Add Category" to create one.
        </div>
      </div>
    </div>

    <!-- Email Report Toggle -->
    <div class="flex flex-col mt-8">
      <label class="my-2 relative inline-flex items-center cursor-pointer"
             @click.prevent="onToggleEmailReportChange(!circleUser?.receiveReport)">
        <input type="checkbox" :checked="circleUser?.receiveReport" class="sr-only peer">
        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600">
        </div>
        <span class="ml-3 text-sm font-semibold text-gray-900 dark:text-gray-300">Receive email report</span>
        <svg v-if="isLoadingToggle" aria-hidden="true"
             class="ml-2 w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-primary-600" viewBox="0 0 100 101"
             fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"/>
          <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"/>
        </svg>
      </label>
    </div>

    <!-- Invite Link Section -->
    <div class="flex block my-6">
      <input :value="copiedLink" ref="elink"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-gray-300"
             type="text" readonly/>
      <button class="ml-2 rounded-md text-center text-gray-500 bg-white border-none focus:ring-transparent hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button" @click="copyText">
        <span class="sr-only">
          <icons-user-group-add/>
        </span>
        <icons-copy/>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {Circle, CircleUser, Category} from "~/utils/types";
import {toast} from "vue3-toastify";

const circle = ref<Circle | null>(null)
const circleUser = ref<CircleUser | null>(null)
const copiedLink = ref<string | null>(null)
const elink = ref<string | null>(null)
const isLoadingToggle = ref<boolean>(false)
const selectedCategory = ref<any>(null)
const isLoadingExport = ref<boolean>(false)
const openDropdown = ref<boolean>(false)

const $circleUsers = useCircleUsers()
const $categories = useCategories()
const $auth = useAuth()

const emit = defineEmits(['show-category-form', 'show-delete-confirm', 'show-archive-circle-confirm'])

watch(() => $circleUsers.value.selected, ((val) => {
  circle.value = val
  copiedLink.value = `${window.location.origin}/circles/${val?.id}`
  const myCircles = $circleUsers.value?.selected?.circleUsers?.filter((e: CircleUser) => e.userId === $auth.value?.userId) ?? []
  circleUser.value = myCircles.length > 0 ? myCircles[0] : null
}))

async function exportCircle() {
  isLoadingExport.value = true
  const {data: result, status} = await useFetch('/api/records/export')

  if (status.value === 'success') {
    const blob = new Blob([result.value], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'records.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  isLoadingExport.value = false
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

function showDeleteConfirm(category: any) {
  emit('show-delete-confirm', category)
}

function onAddCategory() {
  emit('show-category-form', null)
}

function onEditCategory(category: any) {
  emit('show-category-form', category)
}
</script>
