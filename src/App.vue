<script setup lang="ts">
import { ref, provide } from 'vue'
import { RouterView } from 'vue-router'

import { UiStatusMapKey } from '@/services/provideKey'

provide(UiStatusMapKey, ref({
  isLoading: false,
}))
</script>

<template>
  <RouterView />
</template>

<style></style>
