<script setup lang="ts">
</script>

<template>
  <div class="transition-all duration-500 overflow-hidden rounded-2xl border border-slate-200 bg-white/50 shadow-2xl backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/60">
    <!-- 視窗標題列 -->
    <div class="flex items-center gap-2 border-b border-slate-200/50 bg-slate-100/50 px-5 py-3 dark:border-slate-700/50 dark:bg-slate-800/50">
      <div class="flex gap-1.5">
        <div class="h-3 w-3 rounded-full bg-red-400"></div>
        <div class="h-3 w-3 rounded-full bg-amber-400"></div>
        <div class="h-3 w-3 rounded-full bg-emerald-400"></div>
      </div>
      <div class="ml-4 text-xs font-mono text-slate-400 uppercase tracking-widest">Developer Status</div>
    </div>

    <!-- 內容區域 -->
    <div class="p-8 md:p-16">
      <div class="flex items-center">
        <p class="font-mono text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          <span class="text-blue-600 dark:text-blue-400 mr-2">></span>
          <slot/><span class="cursor ml-1 inline-block h-[0.9em] w-[3px] bg-blue-600 align-middle dark:bg-blue-500 md:w-[5px]"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}
</style>
