<template>
  <slot name="trigger" :activator="() => { toggleModal(true); emit('on-trigger-click') }" />
  <div :id=props.id tabindex="-1" aria-hidden="true"
    class="backdrop-blur-sm fixed flex justify-center items-center align-center top-0 left-0 right-0 bottom-0 z-50 hidden bg-black bg-opacity-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full"
    style="z-index: 99999999;">
    <div :class="`relative w-full ${classModal} max-h-full`">
      <div class="relative bg-white rounded-lg shadow dark:bg-gray-700 p-4">
        <div class="w-full mb-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-300">
              {{ props.title }}
            </h3>
            <button v-if="props.isHasClose" type="button"
              class="top-9 right-8 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
              @click.prevent="toggleModal(false)">
              <icons-close />
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <h5 v-if="props.subtitle" class="text-md text-gray-900 dark:text-gray-300">
            {{ props.subtitle }}
          </h5>
        </div>
        <div class="w-full overflow-x-hidden p-2">
          <slot name="body" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ElementEvent } from "~/utils/types";
import { useModal } from '../../composables/modal';

const emit = defineEmits(['on-mounted', 'on-modal-closed', 'on-trigger-click'])
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
  },
  isHasClose: {
    type: Boolean,
    default: true
  },
  classModal: {
    type: String,
    default: 'max-w-md'
  }
})
const isVisible = ref<boolean>(false)

let $modal: HTMLElement | null = null

onMounted(() => {
  $modal = document.getElementById(props.id)

  emit('on-mounted', setModal)
})

const setModal: ElementEvent = {
  show: () => toggleModal(true),
  hide: () => toggleModal(false),
  toggle: () => toggleModal(!isVisible.value)
}

const toggleModal = (value: boolean) => {
  if (value) {
    $modal?.classList.add('animate-fade-in')
    $modal?.classList.remove('hidden')
    $modal?.classList.remove('animate-fade-out')

  } else {
    $modal?.classList.remove('animate-fade-in')
    $modal?.classList.add('animate-fade-out')
    setTimeout(() => {
      $modal?.classList.add('hidden')
      emit('on-modal-closed')
    }, 300
    )
  }

  isVisible.value = value
  useModal().value = !useModal().value
}


</script>

<style scoped></style>
