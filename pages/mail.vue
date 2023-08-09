<template>
  <div>
    <h1>{{ stateCondition }}
      <icons-circular-indicator v-if="isLoading" class="inline w-4 h-4 mr-3 text-white animate-spin"/>
    </h1>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";
import {checkToken} from "~/utils/functions";

const stateCondition = ref<string>('Loading...')
const isLoading = ref<boolean>(false)

onMounted(async () => {
  const route = useRoute()

  isLoading.value = true

  if (route.query.type !== 'unsubscribe') {
    stateCondition.value = 'Type unrecognized'
    isLoading.value = false

    return
  }

  if (!route.query.token) {
    stateCondition.value = 'Token is not found'
    isLoading.value = false

    return
  }

  const data: { circleUserId: string } = await checkToken(route.query.token as string)

  const {data: _, status} = await useFetch('/api/circleUsers/update.circleUsers', {
    method: 'POST',
    body: JSON.stringify({
      id: data.circleUserId,
      receiveReport: false
    })
  })

  if (status.value !== 'success') {
    stateCondition.value = 'Something went wrong, please contact admin.'
  } else {
    stateCondition.value = 'Unsubscribed'
  }

  isLoading.value = false
})




</script>
