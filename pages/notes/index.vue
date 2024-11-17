<template>
  <div class="container mx-auto px-4 mb-24">
    <div class="flex flex-col sm:flex-row justify-between sm:items-end my-8">
      <div class="flex flex-col">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
          My Notes
            <icons-circular-indicator v-if="isLoading"
                                    class="w-5 h-5 text-primary-500 animate-spin"/>
            <span v-else class="text-sm px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
              Saved
            </span>
        </h1>
        <p class="text-md mt-3 text-gray-500 dark:text-gray-400">Capture your financial strategies and insights</p>
      </div>
      <client-only>
        <button type="button"
                :class="`mt-4 sm:mt-0 transition-all duration-200 ease-in-out ${!isHasContent ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} bg-primary-500 dark:bg-primary-700 h-[42px] inline-flex items-center text-white drop-shadow-sm hover:drop-shadow-lg focus:drop-shadow-lg focus:outline-none font-medium rounded-lg text-sm px-4 py-2`"
                :disabled="!isHasContent"
                @click="onSave">
          <div class="w-[115px] flex justify-center items-center">
            <span v-if="isLoadingSaveToCircle" class="flex items-center gap-2">
              <icons-circular-indicator class="w-4 h-4 text-white animate-spin"/>
              Saving...
            </span>
            <span v-else class="flex items-center gap-2">
              <icons-save class="w-4 h-4"/>
              Save to Circle
            </span>
          </div>
        </button>
      </client-only>
    </div>

    <div class="flex flex-col-reverse lg:flex-row gap-6">
      <!-- Editor Section -->
      <div class="w-full lg:w-3/5">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <client-only>
            <quill-editor 
              v-model:content="content" 
              content-type="html" 
              theme="snow"
              placeholder="Start writing your notes here..." 
              class="min-h-[70vh] prose max-w-none dark:prose-invert focus:outline-none"
            />
          </client-only>
        </div>
      </div>

      <!-- Notes List Section -->
      <div class="w-full lg:w-2/5">
        <div class="sticky top-24">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Saved Notes</h2>
          <div class="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div v-for="(note, index) of notes ?? []" :key="index" 
                 class="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
              <button type="button"
                      class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                      @click.stop="onArchiveNote(note.id)"
                      title="Archive Note">
                <icons-archive class="w-4 h-4 text-gray-500 dark:text-gray-400"/>
              </button>
              <div class="p-4 cursor-pointer" @click="onSelectNote(note)">
                <h3 class="font-medium text-gray-900 dark:text-white line-clamp-1 pr-8">
                  {{ note.title }}
                </h3>
                <div class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-3" 
                     v-html="preProcessHtml(note.notes)">
                </div>
              </div>
            </div>
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

function extractTitle(content: string): string {
  const span = document.createElement('span');
  span.innerHTML = content;
  const text = span.textContent || span.innerText;
  
  // Split by newlines and get the first non-empty line
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  if (lines.length === 0) return 'Untitled Note';
  
  // Use the first line as title, truncate if too long
  const title = lines[0];
  return title.length > 50 ? title.substring(0, 47) + '...' : title;
}

async function onSave() {
  isLoadingSaveToCircle.value = true
  const title = extractTitle(content.value)

  const {data, status, error} = await useFetch('/api/circleNotes/save.circleNotes', {
    method: 'POST',
    body: JSON.stringify({
      title: title,
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

<style>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

:deep(.ql-toolbar) {
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;
  border-color: rgb(229, 231, 235) !important;
}

:deep(.ql-container) {
  border-bottom-left-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  border-color: rgb(229, 231, 235) !important;
}

.dark :deep(.ql-toolbar),
.dark :deep(.ql-container) {
  border-color: rgb(55, 65, 81) !important;
}

:deep(.ql-editor) {
  min-height: 70vh;
  font-size: 1rem;
  line-height: 1.75;
}

.dark :deep(.ql-toolbar .ql-stroke) {
  stroke: #9ca3af;
}

.dark :deep(.ql-toolbar .ql-fill) {
  fill: #9ca3af;
}

.dark :deep(.ql-toolbar .ql-picker) {
  color: #9ca3af;
}

.dark :deep(.ql-editor.ql-blank::before) {
  color: #6b7280;
}
</style>
