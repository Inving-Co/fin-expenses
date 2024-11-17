<template>
  <div class="mb-24">
    <div class="flex flex-col sm:flex-row justify-between sm:items-end my-6">
      <div class="flex flex-col">
        <span class="text-2xl text-gray-500">My Notes
          <icons-circular-indicator v-if="isLoading"
                                    class="inline w-4 h-4 ml-2 text-primary-500 animate-spin"/>
          <span v-else class="text-primary-500 font-bold text-sm ml-2">Saved!!</span>
        </span>

        <span class="text-md mt-2 text-gray-400">Write down your future financial strategies here</span>
      </div>
      <client-only>
        <button type="button"
                :class="`mt-4 sm:mt-0 ${!isHasContent? 'bg-gray-500':'bg-primary-500 dark:bg-primary-700'} h-[38px] m-1 inline-flex items-center text-white dark:text-white drop-shadow-sm hover:drop-shadow-md focus:drop-shadow-md focus:outline-none font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:hover:bg-gray-700`"
                :disabled="!isHasContent"
                @click="onSave">
              <span v-if="isLoadingSaveToCircle">
                <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin"/>
                Loading...
              </span>
          <span class="flex items-center" v-else><icons-save class="mr-1"/>Save to Circle</span>
        </button>
      </client-only>
    </div>
    <div class="flex flex-col-reverse md:flex-row gap-4">
      <div class="w-full">
        <client-only>
          <quill-editor v-model:content="content" content-type="html" theme="snow"
                        placeholder="Put your note here..." style="height: 60vh;" class="dark:text-gray-300"/>
        </client-only>
      </div>
      <div class="w-full lg:w-4/5 h-100 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div v-for="(note, _) of notes ?? []">
          <div class="flex justify-end">
            <button type="button"
                    class="absolute z-30 h-[45px] w-[45px] text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
                    @click="onArchiveNote(note.id)"
            >
              <icons-archive/>
            </button>
          </div>
          <div
              class="w-full p-6 border border-gray-200 rounded-lg hover:bg-gray-100 hover:cursor-pointer dark:bg-gray-800 dark:border-gray-700"
              @click="onSelectNote(note)"
          >
            <div class="w-full mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {{ note.title }}
            </div>
            <div class="mb-3 font-normal text-gray-500 dark:text-gray-400" v-html="preProcessHtml(note.notes)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {QuillEditor} from '@vueup/vue-quill'
import {watchDebounced} from '@vueuse/shared';
import {useAuth} from "~/composables/auth";
import {toast} from "vue3-toastify";

const content = ref<string>('')
const $circleUsers = useCircleUsers()
const isLoading = ref<boolean>(true)
const isLoadingSaveToCircle = ref<boolean>(false)
const isLoggedIn = computed(() => useCookie('user-id').value)
const isHasContent = computed(() => extractContent(content.value).length > 0 && !isLoading.value)
const selectedCircle = computed(() => $circleUsers.value.selected)

onMounted(() => {
  if (!isLoggedIn) navigateTo('/transactions')

  if ($circleUsers.value.selectedCircleUser?.activeNote) {
    content.value = JSON.parse($circleUsers.value.selectedCircleUser?.activeNote)
  }

  setTimeout(() => isLoading.value = false, 1210)
})

watch(() => $circleUsers.value.selectedCircleUser?.activeNote, (val, oldValue) => {
  if (val != oldValue) {
    isLoading.value = true
  }

  try {
    if (!content.value) {
      const parsed = JSON.parse(val!)
      content.value = parsed ? parsed : '<p></p>'
    }
  } catch (e) {
    console.log('Invalid JSON')
    content.value = '<p></p>'
  }

  setTimeout(() => isLoading.value = false, 1210)
})

watchDebounced(content, async (value, oldValue) => {
  if (!oldValue || isLoading.value) return

  await onUpdateCircleNotes(value)

}, {debounce: 1200, immediate: false})

definePageMeta({
  title: "Notes",
  layout: 'heading',
});


const {
  data: notes,
  error: errorFetchNotes,
  pending: isLoadingNotes,
  refresh: refreshNotes,
} = await useFetch('/api/circleNotes', {
  query: {
    key: ''
  },
  watch: [selectedCircle]
})

function onSelectNote(note: any) {
  if (!note) return
  $circleUsers.value!.selectedCircleUser!.activeNoteId = note.id
  $circleUsers.value!.selectedCircleUser!.activeNote = note.notes
  content.value = preProcessHtml(note.notes, false)

  onUpdateCircleNotes(content.value)
}

async function onUpdateCircleNotes(value: string) {
  isLoading.value = true

  const curContent = extractContent(value)
  const {data: result, status} = await useFetch('/api/circleUsers/update.notes.circleUsers', {
    method: 'POST',
    body: JSON.stringify({
      id: $circleUsers.value.selectedCircleUser?.id,
      activeNote: curContent.length > 0 ? JSON.stringify(value) : undefined,
      activeNoteId: curContent.length > 0 ? $circleUsers.value!.selectedCircleUser!.activeNoteId : undefined
    })
  })

  if (status.value === 'success') {
    $circleUsers.value.selectedCircleUser = result.value
  }

  isLoading.value = false
}

async function onSave() {
  isLoadingSaveToCircle.value = true
  const contentResult = extractContent(content.value)

  const {data, status, error} = await useFetch('/api/circleNotes/save.circleNotes', {
    method: 'POST',
    body: JSON.stringify({
      title: contentResult.slice(0, 55),
      circleUserId: $circleUsers.value.selectedCircleUser?.id,
    })
  })

  if (status.value === 'success') {
    $circleUsers.value!.selectedCircleUser!.activeNote = '<p></p>'
    $circleUsers.value!.selectedCircleUser!.activeNoteId = undefined
    content.value = '<p></p>'

    toast.success(data.value.message)

    await onUpdateCircleNotes(content.value)
    await refreshNotes()
  } else {
    toast.error(error.value?.statusMessage ?? '')
  }

  isLoadingSaveToCircle.value = false
}

async function onArchiveNote(circleNoteId: string) {
  isLoadingSaveToCircle.value = true

  const {status, error} = await useFetch('/api/circleNotes/archive.circleNotes', {
    method: 'PATCH',
    query: {
      circleNoteId: circleNoteId
    }
  })

  if (status.value === 'success') {
    await refreshNotes()
  } else {
    toast.error(error.value?.statusMessage ?? '')
  }

  isLoadingSaveToCircle.value = false
}

function extractContent(s: any) {
  let span = document.createElement('span');
  span.innerHTML = s;
  return span.textContent || span.innerText;
}

function preProcessHtml(note: string | undefined, isSliced = true) {
  if (!note) return ''
  return note.slice(1, note.length - 1).slice(0, isSliced ? 300 : note.length - 1).replace(/\\t/g, '      ')
}

</script>
