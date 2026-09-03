<script setup lang="ts">
import Timeline from '@/components/Timeline.vue'
import { ref } from 'vue'
import { formatDate, getIconUrl } from '@/utils/timelineHelpers.ts'

const data = {
  name: 'Benson Liao',
  title: '',
  describe: '',
  softSkills: [
    {
      title: "Master's Project",
      icon: 'flashbuilder',
      start: '2009/06/01',
      company: 'N.U.T.C.',
      desc: '結合豐富性網際網路與多人連線虛擬環境學習平台。',
    },
    {
      title: 'Batteread (VS Blend + CSharp)',
      icon: 'vscode',
      start: '2011/06',
      company: 'Gamania',
      desc: 'window 版本漫畫書閱讀器。',
    },
    {
      title: 'MMO Game (unreal)',
      icon: 'unreal',
      start: '2011/01/01',
      company: 'Gamania',
      desc: '結合武俠墨水風+魔物獵人方式的動作多人線上遊戲。',
    },
    {
      title: 'Swapub (Objective-C)',
      icon: 'apple',
      start: '2013/06/01',
      company: 'Gamania',
      desc: '手機APP應用程式, 線上可以進行二手交易平台。',
    },
    { title: 'Live Casino Game', icon: 'nodejs', start: '2014/06/01', company: '中佑資訊視訊組' },
    { title: 'Casino Game', icon: 'pixijs', start: '2020/06/01', company: '中佑資訊機率組' },
    { title: '麻將胡了', icon: 'cocos2d', start: '2023/06/01', company: '中佑資訊' },
    { title: '遊戲活動抽獎', icon: 'vue', start: '2024/06/01', company: '中佑資訊' },
    { title: '圖片編輯器', icon: 'vite', start: '2025/06/01', company: '中佑資訊' },
  ],
  social: [],
}

const currentActive = ref<number>(0)
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden py-10 text-slate-900 transition-colors duration-300 md:py-20 dark:text-slate-100">
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
          <Timeline
            :items="data.softSkills"
            :get-icon-url="getIconUrl"
            :scroll-track="true"
            v-model:active-index="currentActive"
            :vertical-center="true"
            side="right">
            <!-- 你也可以透過插槽自定義卡片外觀 -->
            <template #default="{ item }">
              <div
                class="mt-2 min-h-20 rounded-xl border border-slate-100 bg-white/50 px-4 py-3 shadow-sm transition-all hover:scale-[1.02] dark:border-slate-800 dark:bg-slate-800/50">
                <div class="flex flex-row justify-between gap-1">
                  <div class="text-left text-lg font-bold text-slate-800 dark:text-slate-200">
                    <strong>{{ item.title }}</strong>
                  </div>
                  <time
                    class="mb-1 text-right font-mono text-xs leading-7 text-nowrap text-blue-600 dark:text-blue-400">
                    {{ formatDate(item.start) }}
                  </time>
                </div>
                <p class="text-left text-sm text-slate-600 dark:text-slate-400">{{ item.desc }}</p>
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