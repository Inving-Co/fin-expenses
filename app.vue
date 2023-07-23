<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>

import {initFlowbite} from "flowbite";

onMounted(() => {
  initFlowbite();
})

/// https://github.com/prisma/studio/issues/614#issuecomment-1022684456
BigInt.prototype.toJSON = function () {
  const int = Number.parseInt(this.toString());
  return int ?? this.toString();
};
</script>
