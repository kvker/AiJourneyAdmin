<script setup lang="ts">
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'
import ChatBox from '@/components/Common/ChatBox.vue'

import { UiStatusMapKey } from '@/services/provideKey'

provide(UiStatusMapKey, ref({
  isLoading: false,
}))
</script>

<template>
  <RouterView />
  <ChatBox />
</template>

<style></style>
