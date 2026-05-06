<template>
  <div class="min-h-screen py-20 text-slate-900 transition-colors duration-300 dark:text-slate-100">
    <div class="mx-auto max-w-4xl px-6">
      <header class="mb-12">
        <h1 class="stagger-item text-4xl font-bold">About This Project</h1>
        <div class="stagger-item mt-2 h-1 w-20 bg-blue-600"></div>
      </header>

      <section class="grid gap-12 md:grid-cols-2">
        <div class="stagger-item">
          <h2 class="mb-4 text-2xl font-semibold">Our Mission</h2>
          <p class="leading-relaxed text-slate-600 dark:text-slate-400">
            這是一個基於頂尖技術棧構建的現代化作品集模板。 透過整合 PixiJS 的高效渲染與 GSAP
            的流暢動畫，我們致力於提供最極致的用戶體驗。
          </p>
        </div>

        <div class="stagger-item">
          <h2 class="mb-4 text-2xl font-semibold">Tech Stack</h2>
          <ul class="space-y-2">
            <li v-for="tech in techStack" :key="tech" class="flex items-center">
              <span class="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
              <span class="font-medium">{{ tech }}</span>
            </li>
          </ul>
        </div>
      </section>

      <footer class="stagger-item mt-16">
        <router-link to="/" class="text-blue-600 hover:underline">← Back to Home</router-link>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

const techStack = [
  'Vue 3 (Composition API)',
  'Vite',
  'TypeScript',
  'Tailwind CSS',
  'GSAP',
  'PixiJS',
  'Pinia',
]

onMounted(() => {
  gsap.from('.stagger-item', {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power2.out',
  })
})
</script>
