<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import GridBackground from '@/components/GridBackground.vue'
</script>

<template>
  <GridBackground />
  <ThemeToggle />
  <RouterView v-slot="{ Component }">
    <Suspense>
      <template #default>
        <div>
          <component :is="Component" />
        </div>
      </template>
      <template #fallback> </template>
    </Suspense>
  </RouterView>
</template>
