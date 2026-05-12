<script setup lang="ts">
import { ref } from 'vue'
withDefaults(defineProps<{
  title: string
  description: string
  tags: string[]
  index: number
  more: string
  link?: string
  imageUrls?: string[]
}>(), {
  index: 0,
  more: 'Read More',
  // 建議使用可直接訪問的圖片位址，或是本地 public 資料夾下的路徑
  imageUrls: () => []
});
const isLoaded = ref(false)
</script>

<template>
  <div class="scroll-card inset-4 md:inset-6
  mb-8
  flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 will-change-transform dark:border-white/10 dark:bg-slate-800 md:flex-row hover:border-blue-500/50">

    <!-- 圖片區域：固定比例 -->
    <div class="group/img relative m-2 h-48 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-700 md:h-auto md:w-1/2">
      <img
        v-for="(url, i) in imageUrls"
        :key="i"
        :src="url"
        :alt="title"
        loading="lazy"
        decoding="async"
        @load="isLoaded = true"
        class="h-full w-full object-cover transition-all duration-700 group-hover/img:scale-110"
        :class="[isLoaded ? 'opacity-100' : 'opacity-0 scale-95']"
      />
      <div class="absolute inset-0 bg-blue-600/0 transition-colors group-hover/img:bg-blue-600/10"></div>
    </div>

    <!-- 文字內容區域 -->
    <div class="flex flex-col p-8 md:w-1/2">
      <h3 class="text-2xl font-bold md:text-3xl">{{ title }}</h3>
      <p class="mt-4 leading-relaxed text-slate-500 dark:text-slate-400">
        {{ description }}
      </p>

      <!-- 標籤區域 -->
      <div class="mt-6 flex flex-wrap gap-2">
        <span v-for="tag in tags" :key="tag"
          class="rounded-full bg-slate-100 px-4 py-1 text-xs font-medium dark:bg-slate-700">
          {{ tag }}
        </span>
      </div>

      <!-- 優化後的 More 按鈕 -->
      <a
        :href="link || '#'"
        class="group/btn mt-auto flex items-center gap-2 self-end pt-8 text-sm font-bold uppercase tracking-wider text-blue-600 transition-all hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        <span>{{ more }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"
          class="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  </div>
</template>