<template>
  <button
    @click="themeStore.toggleTheme"
    class="fixed right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 active:scale-95 dark:bg-slate-800"
    aria-label="Toggle Theme"
  >
    <!-- 太陽圖標 (Light Mode) -->
    <span v-if="!themeStore.isDark" class="text-xl text-amber-500">☀️</span>
    <!-- 月亮圖標 (Dark Mode) -->
    <span v-else class="text-xl text-blue-400">🌙</span>
  </button>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped>
button {
  /* 簡單的過渡效果 */
  transition:
    background-color 0.3s ease,
    transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
