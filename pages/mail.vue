<template>
  <div>
    <h1>{{ stateCondition }}
      <icons-circular-indicator v-if="isLoading" class="inline w-4 h-4 mr-3 text-white animate-spin"/>
    </h1>
  </div>
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

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


import {base64url_decode} from "~/utils/functions";

const checkToken = async (jwt: string) => {

  const jwtParts = jwt.split(".");

  if (jwtParts.length !== 3) return;

  const textEncoder = (d: string) => new TextEncoder().encode(d)
  const textDecoder = (d: Uint8Array) => new TextDecoder().decode(d);

  const data = textEncoder(jwtParts[0] + '.' + jwtParts[1])
  const secretKey = useRuntimeConfig().public.APP_SECRET_KEY;

  const key = await crypto.subtle.importKey("raw", textEncoder(secretKey), {
    name: "HMAC",
    hash: "SHA-256"
  }, false, ["sign", "verify"]);


  if (await crypto.subtle.verify({name: "HMAC"}, key, base64url_decode(jwtParts[2]), data)) {
    return JSON.parse(textDecoder(base64url_decode(jwtParts[1])));
  }

  return
}

</script>
