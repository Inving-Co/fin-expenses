import QuillEditor from '@vueup/vue-quill';
<template>
  <div class="mb-24">
    <div class="flex flex-col my-6">
      <span class="text-2xl text-gray-500">My Notes
        <icons-circular-indicator v-if="isLoading"
                                  class="inline w-4 h-4 ml-2 text-primary-500 animate-spin"/>
        <span v-else class="text-primary-500 font-bold text-sm ml-2">Saved!!</span>
      </span>

      <span class="text-md mt-2 text-gray-400">Write down your future financial strategies here</span>
    </div>
    <client-only>
      <quill-editor v-model:content="content" content-type="html" theme="snow"
                    placeholder="Put your note here..." style="height: 60vh;" class="dark:text-gray-300"/>
    </client-only>
  </div>

</template>

<script setup lang="ts">
import {QuillEditor} from '@vueup/vue-quill'
import {watchDebounced} from '@vueuse/shared';
import {CircleUser} from "~/utils/types";
import {useAuth} from "~/composables/auth";
import {useLoading} from "~/composables/loading";

const content = ref<string>('')
const $circleUsers = useCircleUsers()
const isLoading = ref<boolean>(true)
const isLoggedIn = computed(() => useAuth().value?.userId !== undefined)

onMounted(() => {
  if (!isLoggedIn) navigateTo('/transactions')

  if ($circleUsers.value.selectedCircleUser?.notes) {
    content.value = JSON.parse($circleUsers.value.selectedCircleUser?.notes)
  }

  setTimeout(() => isLoading.value = false, 1210)
})

watch(() => $circleUsers.value.selectedCircleUser?.notes, (val, oldValue) => {
  if (val != oldValue) {
    isLoading.value = true
  }

  const parsed = JSON.parse(val!)
  content.value = parsed ? parsed : ''

  setTimeout(() => isLoading.value = false, 1210)
})

watchDebounced(content, async (value, oldValue) => {
  if (!oldValue || isLoading.value) return

  isLoading.value = true

  const {data: result, status} = await useFetch('/api/circleUsers/update.notes.circleUsers', {
    method: 'POST',
    body: JSON.stringify({
      id: $circleUsers.value.selectedCircleUser?.id,
      notes: JSON.stringify(value)
    })
  })

  if (status.value === 'success') {
    $circleUsers.value.selectedCircleUser = result.value
  }

  isLoading.value = false
}, {debounce: 1200, immediate: false})

definePageMeta({
  title: "Notes",
  layout: 'heading',
});

</script>
