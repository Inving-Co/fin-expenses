<template>
  <general-modal id="modal-form-circle" title="Create Circle" subtitle="Circle mean to be your group"
    :is-has-close="isHasClose" @on-mounted="modalFormCircle = $event">
    <template #body>
      <form-circle @on-success="modalFormCircle?.hide(); refreshCircles().then(() => selected = $event.id);" />
    </template>
  </general-modal>

  <general-modal id="modal-form-circle-invitation" title="Invite Member"
    subtitle="Invite your family or friends to this circle" @on-mounted="modalFormCircleInvitation = $event">
    <template #body>
      <!--      <form-circle-invitation :circle-id="selected ?? undefined"/>-->
    </template>
  </general-modal>

  <general-modal id="modal-setting" title="Setting" subtitle="Change your circle settings here"
    @on-mounted="modalSetting = $event">
    <template #body>
      <form-circle-setting 
        @show-category-form="showCategoryForm"
        @show-delete-confirm="showDeleteConfirm"
        @show-archive-circle-confirm="showArchiveCircleConfirm"
        @category-created="onCategoryCreated"
        @category-updated="onCategoryUpdated" />
    </template>
  </general-modal>

  <general-modal id="modal-form-category-circle-settings" title="Form Category" 
    @on-mounted="modalFormCategory = $event"
    @on-modal-closed="selectedCategory = null; modalSetting?.show()">
    <template #body>
      <form-category 
        :edit-mode="editMode"
        :category="selectedCategory"
        source="circle-settings"
        @category-created="onCategoryCreated"
        @category-updated="onCategoryUpdated"/>
    </template>
  </general-modal>

  <general-modal id="modal-confirmation-archive-circle" title="Confirmation" @on-mounted="modalArchiveCircleConfirm = $event">
    <template #body>
      <p class="text-gray-500">Are you sure you want to archive this circle?</p>

      <div class="flex mt-4">
        <button
            type="button"
            class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            @click="cancelArchiveCircle">No, Cancel
        </button>
        <button
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click="confirmArchiveCircle">Yes, Archive
        </button>
      </div>
    </template>
  </general-modal>

  <general-modal id="modal-confirmation-delete" title="Confirmation" @on-mounted="modalConfDelete = $event">
    <template #body>
      <p class="text-gray-500">Are you sure you want to delete this category?</p>

      <div class="flex mt-4">
        <button
            type="button"
            class="text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
            @click="cancelDelete">No, Cancel
        </button>
        <button
            type="button"
            class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            @click="confirmDelete">Yes, Delete
        </button>
      </div>
    </template>
  </general-modal>

  <general-dropdown id="dropdownCircles">
    <template #trigger="{ activator }">
      <button
        class="h-[38px] inline-flex items-center text-gray-500 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600"
        type="button" @click="activator">
        <span class="sr-only">Circles button</span>
        {{ $circleUsers.selected?.name ?? "Circles" }}
        <svg class="w-2.5 h-2.5 ml-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
    </template>
    <template #content="{ activator }">
      <ul class="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
        <li v-for="circleUser in $circleUsers.data">
          <div class="flex justify-between">
            <div class="flex p-2 mr-4 w-full rounded hover:bg-gray-100 dark:hover:bg-gray-600">
              <div class="flex items-center h-5">
                <input :id="circleUser?.circleId + `-radio`" :name="circleUser?.circleId + `-radio`" type="radio"
                  :value="circleUser?.circleId" :checked="selected === circleUser?.circleId"
                  class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  @change="onCircleChange(circleUser?.circle);" />
              </div>
              <div class="ml-2 text-sm flex justify-between w-full gap-2">
                <label :for="circleUser?.circleId + `-radio`" class="font-medium text-gray-900 dark:text-gray-300">
                  <span>{{ capitalizeFirstLetter(circleUser?.circle?.name) }}</span>
                </label>
              </div>
            </div>
            <button v-if="$auth?.userId"
              class="rounded-md text-center text-gray-500 bg-white border-none focus:ring-transparent hover:bg-gray-100  focus:ring-4 focus:ring-gray-200 font-medium text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-900 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button" @click="onCircleChange(circleUser?.circle); modalSetting?.show()">
              <span class="sr-only">Setting</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49 1c-.22.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
              </svg>
            </button>
          </div>
        </li>
        <li>
          <button
            class="w-full mt-2 text-center text-gray-500 bg-white border-none focus:ring-transparent hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button" @click="isHasClose = true; modalFormCircle?.show()">
            <span class="sr-only">Create</span>
            Create
          </button>
        </li>
      </ul>
    </template>
  </general-dropdown>
</template>

<script setup lang="ts">
import { capitalizeFirstLetter } from "~/utils/functions";
import {Circle, CircleUser, ElementEvent} from "~/utils/types";
import FormCircleSetting from "~/components/FormCircleSetting.vue";
import FormCategory from "~/components/FormCategory.vue";
import { useCircleUsers } from "~/composables/circles";
import { useAuth } from "~/composables/auth";
import { useCategories } from "~/composables/categories";
import {useAsyncData} from "#app";
import { ref } from "vue";
import { toast } from 'vue3-toastify';

const emit = defineEmits(['on-mounted', 'circle-changed'])
let modalFormCircle: ElementEvent | null = null;
let modalFormCircleInvitation: ElementEvent | null = null;
let modalSetting: ElementEvent | null = null;
let modalFormCategory: ElementEvent | null = null;
let modalConfDelete: ElementEvent | null = null;
let modalArchiveCircleConfirm: ElementEvent | null = null;
const selectedCategory = ref<any>(null)
const selectedCircle = ref<any>(null)
const editMode = ref<boolean>(false)

const $auth = useAuth()
const $circleUsers = useCircleUsers()
const $categories = useCategories()
const selected = ref<string | null>(null)
const isHasClose = ref<boolean>(false)

const { data: circleUsers, refresh: refreshCircles } = await useFetch('/api/circleUsers', {
  onRequest({ request, response }) {
    $circleUsers.value.isLoading = true
  },
  onResponse({ request, response, options }) {
    if (response.ok) {
      $circleUsers.value.data = response._data
    }

    $circleUsers.value.isLoading = false
  },
  server: false,
})

const checkCircleUser = async () => {
  const value = $circleUsers.value.data;

  if (value && value.length > 0) {
    const selectedCircle = useCookie('selected-circle').value as Circle | null | undefined

    if (!selectedCircle?.id) {
      onCircleChange(value[0].circle as Circle)
    }
  } else {
    modalFormCircle?.show();
  }
}

watch(() => selected.value, async (value) => {
  if (value) {
    $circleUsers.value.isLoading = true

    await activatorLoad(value)

    $circleUsers.value.isLoading = false
  }
})

watchEffect(() => {
  checkCircleUser()
})

const activatorLoad = async (value: string) => {
  const { data } = await useAsyncData('circleDetail', () => $fetch(`/api/circles/${value}`, {
    onResponse({ request, response, options }) {
      $circleUsers.value.isLoading = false
    },
    server: false,
  }))

  const circle = {
    ...data.value,
    assets: undefined,
    circleSetting: undefined,
    circleUsers: undefined,
  };

  const maxAge = 100 * 365 * 24 * 60 * 60
  useCookie('selected-circle', {
    secure: true,
    maxAge: maxAge,
    sameSite: 'lax',
  }).value = JSON.stringify(circle)

  $circleUsers.value.selected = data.value

  const myCircles = $circleUsers.value?.selected?.circleUsers?.filter((e: CircleUser) => e.userId === $auth.value?.userId) ?? []
  $circleUsers.value.selectedCircleUser = myCircles[0]

  $circleUsers.value.refreshSelected = activatorLoad

}

onMounted(() => {
  emit('on-mounted')
  const userId = useCookie('user-id').value

  if(!userId) {
    useCookie('selected-circle').value = undefined
    $auth.value = undefined
  }

  const value = useCookie('selected-circle').value as Circle | null | undefined

  if (value?.id) {
    $circleUsers.value.selected = value
    selected.value = value?.id
  } else {
    refreshCircles().then(() => checkCircleUser())
  }
})

function onCircleChange(value: Circle) {
  selected.value = value.id

  const messages = useMessages()
  messages.value = []
  /// I think the cookie itself was async, it means that when I put new value on circle
  /// It will still use the old value when I refresh the trx, so I need to delay some milliseconds
  /// to make it refresh later
  setTimeout(() => emit('circle-changed'), 50)
}

function showArchiveCircleConfirm(circle: Circle) {
  modalSetting?.hide()
  selectedCircle.value = circle
  modalArchiveCircleConfirm?.show()
}

function cancelArchiveCircle() {
  modalArchiveCircleConfirm?.hide()
  modalSetting?.show()
}

async function confirmArchiveCircle() {
  if (selectedCircle.value) {
    try {
      const { error, status } = await useFetch(`/api/circles/${selectedCircle.value.id}`, {
        method: 'DELETE',
      })

      if (status.value === 'success') {
        modalArchiveCircleConfirm?.hide()
        toast.success('Circle archived successfully')
        selectedCircle.value = null
        useCookie('selected-circle').value = undefined

        refreshCircles().then(() => checkCircleUser())
      } else {
        toast.error(error.value?.statusMessage ?? 'Failed to archive circle')
      }
    } catch (error) {
      console.error('Failed to archive circle:', error)
      toast.error('Failed to archive circle')
    }
  }
}

function showCategoryForm(category: any) {
  modalSetting?.hide()
  selectedCategory.value = category
  editMode.value = !!category
  modalFormCategory?.show()
}

function onCategoryCreated(data: any) {
  selectedCategory.value = null
  modalFormCategory?.hide()
  if (data.source === 'circle-settings') {
    modalSetting?.show()
  }
}

function onCategoryUpdated(data: any) {
  selectedCategory.value = null
  modalFormCategory?.hide()
  if (data.source === 'circle-settings') {
    modalSetting?.show()
  }
}

function showDeleteConfirm(category: any) {
  modalSetting?.hide()
  selectedCategory.value = category
  modalConfDelete?.show()
}

function cancelDelete() {
  modalConfDelete?.hide()
  modalSetting?.show()
}

async function confirmDelete() {
  if (selectedCategory.value) {
    try {
      const { error, status } = await useFetch('/api/categories/delete.category', {
        query: {
          id: selectedCategory.value.id,
        },
      })

      if (status.value === 'success') {
        $categories.value.data = $categories.value.data.filter((cat: any) => cat.id !== selectedCategory.value.id)
        toast.success('Category deleted successfully')
        modalConfDelete?.hide()
        modalSetting?.show()
        selectedCategory.value = null
      } else {
        toast.error(error.value?.statusMessage ?? 'Failed to delete category')
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    }
  }
}
</script>

<style scoped></style>
