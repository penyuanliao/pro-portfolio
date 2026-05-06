<template>
  <div
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-slate-900 transition-colors duration-300 dark:text-white"
  >
    <!-- PixiJS 容器 -->
    <div ref="pixiContainer" class="absolute inset-0 z-0"></div>

    <!-- 內容區域 -->
    <div class="z-10 text-center">
      <h1 ref="title" class="mb-4 text-6xl font-bold opacity-0">
        Creative <span class="text-blue-500">Portfolio</span>
      </h1>
      <p ref="subtitle" class="mb-8 text-xl text-slate-500 opacity-0 dark:text-slate-400">
        Built with Vue 3, Vite, PixiJS & GSAP
      </p>
      <div ref="cta" class="opacity-0">
        <router-link
          to="/about"
          class="rounded-full bg-blue-600 px-8 py-3 font-semibold transition-transform hover:scale-105 active:scale-95"
        >
          Explore More
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Application } from 'pixi.js'
import gsap from 'gsap'

const pixiContainer = ref<HTMLDivElement | null>(null)
const title = ref(null)
const subtitle = ref(null)
const cta = ref(null)
let app: Application | null = null

onMounted(async () => {
  // 1. 初始化 PixiJS 背景 (簡單範例)
  app = new Application()
  await app.init({ resizeTo: window, backgroundAlpha: 0 })
  pixiContainer.value?.appendChild(app.canvas)

  // 2. GSAP 進場動畫
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.to(title.value, { opacity: 1, y: -20, duration: 1 })
    .to(subtitle.value, { opacity: 1, y: -10, duration: 0.8 }, '-=0.5')
    .to(cta.value, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
})

onUnmounted(() => {
  if (app) {
    app.destroy(true, { children: true, texture: true })
  }
})
</script>

<style scoped>
/* 額外的自定義樣式可以在這裡添加 */
</style>
