<template>
  <button
    @click="themeStore.toggleTheme"
    class="right-6 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:scale-110 active:scale-95 dark:bg-slate-800"
    aria-label="Toggle Theme"
  >
    <!-- 太陽圖標 (Light Mode) -->
    <span v-if="!themeStore.isDark" class="text-xl text-amber-500">
      <svg width="24" height="24" viewBox="0 0 1.35 1.35" xmlns="http://www.w3.org/2000/svg">
        <title>sun-line</title>
        <path
          d="M0.675 0.237a0.037 0.037 0 0 0 0.037 -0.037v-0.128a0.037 0.037 0 0 0 -0.075 0v0.128a0.037 0.037 0 0 0 0.037 0.037"
          class="clr-i-outline clr-i-outline-path-1"
        />
        <path
          d="M0.675 1.113a0.037 0.037 0 0 0 -0.037 0.037v0.128a0.037 0.037 0 0 0 0.075 0v-0.128a0.037 0.037 0 0 0 -0.037 -0.037"
          class="clr-i-outline clr-i-outline-path-2"
        />
        <path
          d="M0.312 0.365A0.037 0.037 0 0 0 0.337 0.375a0.037 0.037 0 0 0 0.027 -0.011 0.037 0.037 0 0 0 0 -0.053L0.275 0.222a0.037 0.037 0 0 0 -0.053 0.053Z"
          class="clr-i-outline clr-i-outline-path-3"
        />
        <path
          d="M1.038 0.985a0.037 0.037 0 1 0 -0.053 0.053l0.09 0.09a0.037 0.037 0 0 0 0.027 0.011 0.037 0.037 0 0 0 0.026 -0.011 0.037 0.037 0 0 0 0 -0.053Z"
          class="clr-i-outline clr-i-outline-path-4"
        />
        <path
          d="M0.237 0.675a0.037 0.037 0 0 0 -0.037 -0.037h-0.128a0.037 0.037 0 0 0 0 0.075h0.128a0.037 0.037 0 0 0 0.037 -0.037"
          class="clr-i-outline clr-i-outline-path-5"
        />
        <path
          d="M1.278 0.637h-0.128a0.037 0.037 0 1 0 0 0.075h0.128a0.037 0.037 0 0 0 0 -0.075"
          class="clr-i-outline clr-i-outline-path-6"
        />
        <path
          d="m0.312 0.985 -0.09 0.09a0.037 0.037 0 0 0 0.026 0.064 0.037 0.037 0 0 0 0.027 -0.011l0.09 -0.09a0.037 0.037 0 1 0 -0.053 -0.053"
          class="clr-i-outline clr-i-outline-path-7"
        />
        <path
          d="M1.012 0.375a0.037 0.037 0 0 0 0.027 -0.011l0.09 -0.09a0.037 0.037 0 0 0 0 -0.053 0.037 0.037 0 0 0 -0.053 0l-0.09 0.09a0.037 0.037 0 0 0 0 0.053A0.037 0.037 0 0 0 1.012 0.375"
          class="clr-i-outline clr-i-outline-path-8"
        />
        <path
          d="M0.68 0.291a0.38 0.38 0 1 0 0.375 0.38 0.378 0.378 0 0 0 -0.375 -0.38m0 0.684a0.305 0.305 0 1 1 0.3 -0.304 0.303 0.303 0 0 1 -0.3 0.304"
          class="clr-i-outline clr-i-outline-path-9"
        />
        <path fill="none" d="M0 0h1.35v1.35H0z" />
      </svg>
    </span>
    <!-- 月亮圖標 (Dark Mode) -->
    <span v-else class="text-xl text-blue-400">
      <svg width="24" height="24" viewBox="0 0 1.35 1.35" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#FFF"
          d="M1.163 1.02a0.042 0.042 0 0 0 -0.037 -0.021h-0.032a0.413 0.413 0 0 1 -0.158 -0.788 0.037 0.037 0 0 0 0.022 -0.037 0.042 0.042 0 0 0 -0.025 -0.034 0.583 0.583 0 0 0 -0.188 -0.033 0.567 0.567 0 0 0 0 1.134 0.558 0.558 0 0 0 0.413 -0.18 0.042 0.042 0 0 0 0.005 -0.04m-0.417 0.147a0.492 0.492 0 0 1 0 -0.984 0.833 0.833 0 0 1 0.075 0.006 0.487 0.487 0 0 0 0.214 0.882 0.475 0.475 0 0 1 -0.289 0.096"
        />
      </svg>
    </span>
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
