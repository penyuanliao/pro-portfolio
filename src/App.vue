<script setup lang="ts">
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Suspense>
      <template #default>
        <div>
          <component :is="Component" />
        </div>
      </template>
      <template #fallback>
      </template>
    </Suspense>
  </RouterView>
</template>
