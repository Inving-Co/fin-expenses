<template>
  <div>
    <div>
      <input v-model="name" ref="inputRef" name="circle-name" id="circle-name"
             class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
             type="text"
             placeholder="Fill the circle name" required v-on:keydown.enter="onSave"/>
    </div>

    <button type="button"
            class="w-full mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            @click="onSave">
      <span v-if="isLoadingSubmit">
          <icons-circular-indicator class="inline w-4 h-4 mr-3 text-white animate-spin" />
          Loading...
        </span>
      <span v-else>Save</span>
    </button>
  </div>
</template>

<script setup lang="ts">

const name = ref<string>('Personal Circle\'s')
const isLoadingSubmit = ref<boolean>(false)

const emit = defineEmits(['setted', 'on-success'])

async function onSave() {
  isLoadingSubmit.value = true

  if (name.value) {
    const {data: result, status} = await useFetch('/api/circles/create.circle', {
      method: 'POST',
      body: JSON.stringify({
        name: name.value
      })
    })

    if (status.value === 'success') {
      name.value = ''

      emit('on-success', result)
    }
  }
}
</script>

<style scoped>

</style>
