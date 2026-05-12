<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCard from './ProjectCard.vue'

gsap.registerPlugin(ScrollTrigger)

defineProps<{
  projects: Array<{
    title: string
    description: string
    tags: string[]
    more: string
    imageUrls?: string[]
  }>
}>()

let ctx: gsap.Context | null = null

onMounted(() => {
  ctx = gsap.context(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.parallax-card')
    if (cards.length === 0) return

    cards.forEach((card, i) => {
      // 為每張卡片建立獨立的視差效果
      gsap.fromTo(
        card,
        {
          y: i % 2 === 0 ? 50 : 100, // 初始位置偏移
          opacity: 0.8,
        },
        {
          y: i % 2 === 0 ? -50 : -100, // 結束位置偏移（比捲動快或慢）
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            fastScrollEnd: true, // 快速滾動時直接跳到結尾
            trigger: card,
            start: 'top bottom', // 當卡片頂部進入視窗底部時開始
            end: 'bottom top', // 當卡片底部離開視窗頂部時結束
            scrub: true, // 鎖定捲動進度
            markers: true,
          },
        },
      )
    })
  })
})
onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <section class="project-section relative z-10 flex flex-col items-center py-32">
    <h2 class="scroll-title relative z-30 mb-12 text-3xl font-bold md:text-5xl">Featured Works</h2>

    <!-- 視差卡片容器 -->
    <div class="project-list flex w-full max-w-5xl flex-col gap-24 px-4 md:gap-40">
      <div
        v-for="(project, index) in projects"
        :key="index"
        class="parallax-card flex w-full justify-center"
        :class="index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'">
        <div class="w-full md:w-2/3 lg:w-1/2">
          <ProjectCard
            class="shadow-xl transition-shadow hover:shadow-2xl"
            v-bind="project"
            :index="index" />
        </div>
      </div>
    </div>

    <!-- 背景裝飾物 (可強化視差感) -->
    <div class="absolute left-10 top-1/4 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl"></div>
    <div
      class="absolute bottom-1/4 right-10 h-96 w-96 rounded-full bg-purple-400/10 blur-3xl"></div>
  </section>
</template>

<style scoped>
.parallax-card {
  will-change: transform, opacity;
}
</style>