<script setup lang="ts">
import { onMounted } from 'vue'
import gsap from 'gsap'

onMounted(() => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } })
  
  tl.from('.header-content', { y: 30, opacity: 0 })
    .from('.section-contact', { x: -20, opacity: 0 }, '-=0.4')
    .from('.section-experience', { x: 20, opacity: 0 }, '-=0.6')
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 py-6 px-4 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100 md:h-screen md:overflow-hidden md:py-12 md:px-6 md:flex md:items-center md:justify-center">
    <div class="mx-auto max-w-5xl w-full overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-800 flex flex-col md:h-full md:max-h-[850px]">
      <!-- Header 區域 -->
      <div class="header-content shrink-0 relative bg-blue-600 px-8 py-10 text-white md:px-16 md:py-16">
        <div class="relative z-10">
          <h3 class="text-lg font-light tracking-widest opacity-90 uppercase md:text-xl">Liao</h3>
          <h1 class="mt-2 text-5xl font-black tracking-tight md:text-7xl">
            Benson
          </h1>
          <div class="mt-4 inline-block rounded-md bg-white/20 px-4 py-1 text-lg font-medium backdrop-blur-sm">
            Full-Stack Programmer
          </div>
        </div>
        <!-- 裝飾用的圓圈 -->
        <div class="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-500 opacity-20"></div>
      </div>

      <!-- 內容區域 -->
      <div class="grid gap-0 md:grid-cols-12 flex-1 overflow-hidden">
        <!-- 左側欄：聯絡資訊 -->
        <div class="section-contact border-b border-slate-100 p-8 md:col-span-4 md:border-b-0 md:border-r dark:border-slate-700 md:overflow-y-auto custom-scrollbar">
          <h3 class="mb-6 text-sm font-bold tracking-[0.2em] text-blue-600 uppercase">Contact</h3>
          <div class="space-y-4">
            <div class="flex items-center gap-3 group">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-100 dark:bg-slate-700">
                <img src="@/assets/pinDot.svg" class="size-5" alt="Location"/>
              </div>
              <span class="text-slate-600 dark:text-slate-300">Taichung, Taiwan</span>
            </div>
            
            <div class="flex items-center gap-3 group">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-100 dark:bg-slate-700">
                <img src="@/assets/phone.svg" class="size-5" alt="Phone"/>
              </div>
              <span class="text-slate-600 dark:text-slate-300">(+886) 911-111-111</span>
            </div>

            <div class="flex items-center gap-3 group">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-blue-100 dark:bg-slate-700">
                <img src="@/assets/envelope.svg" class="size-5" alt="Email"/>
              </div>
              <span class="break-all text-slate-600 dark:text-slate-300">benson_liao@gmail.com</span>
            </div>
          </div>

          <!-- 可以在這裡增加 Skills 區塊 -->
          <div class="mt-12">
            <h3 class="mb-6 text-sm font-bold tracking-[0.2em] text-blue-600 uppercase">Skills</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="s in ['Vue', 'TS', 'GSAP', 'PixiJS']" :key="s" class="rounded bg-slate-100 px-2 py-1 text-xs font-semibold dark:bg-slate-700">
                {{ s }}
              </span>
            </div>
          </div>

          <div class="mt-12">
            <h3 class="mb-6 text-sm font-bold tracking-[0.2em] text-blue-600 uppercase">SUMMERY</h3>
            <div class="flex flex-wrap gap-2">
              <p>
                Creative and user-focused Product Designer specializing in crafting engaging digital experiences and scalable design systems. Skilled at solving complex problems with innovative design solutions, focusing on user-centric approaches across diverse industries like e-commerce, cryptocurrency, and marketplaces.
              </p>
            </div>
          </div>

        </div>

        <!-- 右側欄：經歷 -->
        <div class="section-experience p-8 md:col-span-8 md:p-12 md:overflow-y-auto custom-scrollbar">
          <h3 class="mb-8 text-sm font-bold tracking-[0.2em] text-blue-600 uppercase">Experience</h3>
          
          <div class="relative space-y-12 pb-8 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
            <!-- 經歷項目內容保持不變... -->
            <div class="relative pl-12">
              <div class="absolute left-0 top-1.5 h-10 w-10 rounded-full border-4 border-white bg-blue-600 shadow-sm dark:border-slate-800"></div>
              <div>
                <span class="text-sm font-bold text-blue-500">2021 - Present</span>
                <h4 class="mt-1 text-xl font-bold">Senior Frontend Developer</h4>
                <p class="text-slate-500 dark:text-slate-400">Creative Studio Co.</p>
                <p class="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                  負責開發高性能的 Web 應用程式，使用 Vue 3 與動畫庫提升使用者互動體驗。
                </p>
              </div>
            </div>

            <div class="relative pl-12">
              <div class="absolute left-0 top-1.5 h-10 w-10 rounded-full border-4 border-white bg-slate-300 shadow-sm dark:border-slate-800"></div>
              <div>
                <span class="text-sm font-bold text-slate-400">2019 - 2021</span>
                <h4 class="mt-1 text-xl font-bold">Web Developer</h4>
                <p class="text-slate-500 dark:text-slate-400">Tech Innovation Lab</p>
                <p class="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                  參與多個電子商務平台的維護與功能開發，專注於介面優化。
                </p>
              </div>
            </div>

            <div class="relative pl-12">
              <div class="absolute left-0 top-1.5 h-10 w-10 rounded-full border-4 border-white bg-slate-300 shadow-sm dark:border-slate-800"></div>
              <div>
                <span class="text-sm font-bold text-slate-400">2019 - 2021</span>
                <h4 class="mt-1 text-xl font-bold">Web Developer</h4>
                <p class="text-slate-500 dark:text-slate-400">Tech Innovation Lab</p>
                <p class="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                  參與多個電子商務平台的維護與功能開發，專注於介面優化。
                </p>
              </div>
            </div>

            <div class="relative pl-12">
              <div class="absolute left-0 top-1.5 h-10 w-10 rounded-full border-4 border-white bg-slate-300 shadow-sm dark:border-slate-800"></div>
              <div>
                <span class="text-sm font-bold text-slate-400">2019 - 2021</span>
                <h4 class="mt-1 text-xl font-bold">Web Developer</h4>
                <p class="text-slate-500 dark:text-slate-400">Tech Innovation Lab</p>
                <p class="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                  參與多個電子商務平台的維護與功能開發，專注於介面優化。
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
/* 如果有特殊的漸層或動畫細節可以寫在這裡 */
.header-content {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

/* 自定義捲動條樣式 (針對桌面端) */
.custom-scrollbar {
  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;

  /* Chrome, Edge, Safari */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1; /* slate-300 */
    border-radius: 20px;
  }
  .dark &::-webkit-scrollbar-thumb {
    background-color: #475569; /* slate-600 */
  }
}
</style>
