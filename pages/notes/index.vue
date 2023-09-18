import QuillEditor from '@vueup/vue-quill';
<template>
  <div>
    <div class="flex flex-col my-6">
      <span class="text-2xl text-gray-500">My Notes
        <icons-circular-indicator v-if="isLoading"
                                  class="inline w-4 h-4 ml-2 text-primary-500 animate-spin"/>
        <span v-else class="text-primary-500 font-bold text-sm ml-2">Saved!!</span>
      </span>

      <span class="text-md mt-2 text-gray-400">Write down your future financial strategies here</span>
    </div>
    <client-only>
      <quill-editor :content="content" @update:content="(val) => content = val" content-type="html" theme="snow"
                    placeholder="Put your note here..." style="height: 60vh;"/>
    </client-only>
  </div>

</template>

<script setup lang="ts">
import {QuillEditor} from '@vueup/vue-quill'
import {watchDebounced} from '@vueuse/shared';
import {CircleUser} from "~/utils/types";

const content = ref<string>('')
const $circleUsers = useCircleUsers()
const isLoading = ref<boolean>(false)

onMounted(() => {
  if ($circleUsers.value.selectedCircleUser?.notes) {
    content.value = JSON.parse($circleUsers.value.selectedCircleUser?.notes)
  }
})

watch(() => $circleUsers.value.selectedCircleUser?.notes, (val) => {
  if (val) {
    content.value = JSON.parse(val)
  }
})

watchDebounced(content, async (value, oldValue) => {
  if(!oldValue) return

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
}, {debounce: 800, immediate: false, deep: true})

definePageMeta({
  title: "Notes",
  layout: 'heading',
});

</script>
