<script setup lang="ts">
import Timeline from '@/components/Timeline.vue'
import { ref } from 'vue'

const data = {
  name: 'Benson Liao',
  title: '',
  describe: '',
  softSkills: [
    { title: 'Master\'s Project', icon: 'flashbuilder', start: '2009/06/01', company: 'N.U.T.C.', desc: '研究所論文'  },
    { title: 'Batteread (VS Blend + CSharp)', icon: 'vscode', start: '2011/06', company: 'Gamania' },
    { title: 'MMO Game (unreal)', icon: 'unreal', start: '2011/01/01', company: 'Gamania' },
    { title: 'Swapub (Objective-C)', icon: 'apple', start: '2013/06/01', company: 'Gamania' },
    { title: 'Vue 3', icon: 'vue', start: '2023/06/01' },
    { title: 'Vite', icon: 'vite', start: '2022/06/01' },
    { title: 'TypeScript', icon: 'typescript', start: '2021/06/01' },
    { title: 'PixiJS', icon: 'pixijs', start: '2020/06/01' },
    { title: 'Cocos2D', icon: 'cocos2d', start: '2018/06/01' },
  ],
  social: [],
}

const currentActive = ref<number>(0);

/**
 * 取得圖示的動態路徑
 * @param name 檔案名稱 (不含副檔名)
 */
const getIconUrl = (name: string) => {
  return new URL(`../assets/expertise/${name}.svg`, import.meta.url).href
}
/**
 * 格式化日期為英文月份 (例如: 2009/06 -> June 2009)
 */
const formatDate = (dateStr?: string) => {
  if (!dateStr) return ''
  if (dateStr.includes('/')) {
    const [year, month] = dateStr.split('/')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  }
  return dateStr // 如果只有年份則直接回傳
}
</script>

<template>
  <div class="min-h-screen overflow-x-hidden py-10 md:py-20 text-slate-900 transition-colors duration-300 dark:text-slate-100">
    <div class="mx-auto max-w-4xl px-6">
      <header class="mb-8 md:mb-12">
        <h1 class="stagger-item text-2xl font-bold md:text-4xl">About - {{ data.name }}</h1>
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
          <h2 class="mb-8 text-2xl font-semibold">Tech Journey</h2>

          <!-- 使用封裝後的元件 -->
          <Timeline :items="data.softSkills"
                    :get-icon-url="getIconUrl"
                    :scroll-track="true"
                    v-model:active-index="currentActive"
                    side="right">
            <!-- 你也可以透過插槽自定義卡片外觀 -->
            <template #default="{ item }">
              <div class="min-h-20 mt-2 rounded-xl border border-slate-100 bg-white/50 px-4 py-3 shadow-sm transition-all hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-800/50">

                <div class="flex flex-row gap-1 justify-between">
                  <div class="text-lg font-bold text-slate-800 dark:text-slate-200 text-left">{{ item.title }}</div>
                  <time class="mb-1 font-mono text-xs leading-7 text-blue-600 dark:text-blue-400 text-right text-nowrap">
                    {{ formatDate(item.start) }}
                  </time>
                </div>
                <div v-if="item.company" class="text-sm text-slate-500">{{ item.company }}</div>
              </div>
            </template>
          </Timeline>
        </div>
      </section>

      <footer class="stagger-item mt-16">
        <router-link to="/" class="text-blue-600 hover:underline">← Back to Home</router-link>
      </footer>
    </div>
  </div>
</template>