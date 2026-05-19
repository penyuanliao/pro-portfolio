<script setup lang="ts">
import TextTypingEffect from '@/components/typewriter/TextTypingEffect.vue'
import { markRaw, ref } from 'vue'
import Timeline from '@/components/Timeline.vue'
import { formatDate, getIconUrl } from '@/utils/timelineHelpers.ts'
import Symbols from '@/components/Symbols.vue'

const history = ref([
  {
    title: '中科大多媒體設計碩士班',
    icon: 'star',
    start: '2010/06/01',
    company: 'N.U.T.C.',
    desc: '',
    // 使用自定義圖示元件: markRaw 避免響應式開銷
    // iconComponent: markRaw(Symbols),
  },
  {
    title: '中科大多媒體設計碩士班',
    icon: '',
    start: '2010/06/01',
    company: 'N.U.T.C.',
    desc: '',
    // 使用自定義圖示元件: markRaw 避免響應式開銷
    // iconComponent: markRaw(Symbols),
  },
])
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden py-10 text-slate-900 transition-colors duration-300 md:py-20 dark:text-slate-100">
    <div class="mx-auto max-w-4xl px-6">
      <TextTypingEffect v-show="false" mode="terminal" />
      <Timeline
        :items="history"
        :get-icon-url="getIconUrl"
        :scroll-track="true"
        :vertical-center="true"
        start-icon="point"
        end-icon="time"
        side="alternate">
        <template #icon="{ item }">
          <Symbols v-if="item.icon === 'star'" name="star"/>
        </template>
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
  </div>
</template>

<style scoped></style>
