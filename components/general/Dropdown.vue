<template>
  <div>
    <slot name="trigger" :activator="() => { toggleDropdown(!isVisible); emit('on-trigger-click') }"/>
    <div :id="`${props.id}-wrapper-dropdown`" class="flex">
      <div :id="`${props.id}-background`" class="fixed bg-transparent z-10 hidden left-0 right-0 bottom-0 top-0"
           @click="toggleDropdown(false)"/>
      <div
          :id="props.id"
          class="z-20 hidden bg-white absolute divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
        <slot name="content" :activator="() => { toggleDropdown(!isVisible); }"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ElementEvent} from "~/utils/types";

const emit = defineEmits(['on-mounted', 'on-dropdown-closed', 'on-trigger-click'])
const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const isVisible = ref<boolean>(false)

let $dropdown: HTMLElement | null = null
let $dropdownBackground: HTMLElement | null = null

onMounted(() => {
  $dropdown = document.getElementById(props.id)
  $dropdownBackground = document.getElementById(`${props.id}-background`)

  emit('on-mounted', setDropdown)
})

const setDropdown: ElementEvent = {
  show: () => toggleDropdown(true),
  hide: () => toggleDropdown(false),
  toggle: () => toggleDropdown(!isVisible.value)
}

const toggleDropdown = (value: boolean) => {
  if (value) {
    $dropdown?.classList.add('animate-fade-in')
    $dropdown?.classList.remove('hidden')
    $dropdown?.classList.remove('animate-fade-out')

    $dropdownBackground?.classList.remove('hidden')
  } else {
    $dropdown?.classList.remove('animate-fade-in')
    $dropdown?.classList.add('animate-fade-out')
    setTimeout(() => {
          $dropdown?.classList.add('hidden')
          emit('on-dropdown-closed')
        }, 300
    )
    $dropdownBackground?.classList.add('hidden')
  }
  let $wrapper: HTMLElement | null = document.getElementById(`${props.id}-wrapper-dropdown`)

  const $isOverflow = isOverflownX($wrapper?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement?.parentElement as any)

  if($isOverflow) {
    $wrapper?.classList.toggle('justify-end')
  }

  isVisible.value = value
}

function isOverflownX(element: HTMLElement) {
  return element.scrollWidth > element.clientWidth;
}

</script>

<style scoped>

</style>
