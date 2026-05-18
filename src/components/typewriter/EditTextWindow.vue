<script setup lang="ts">
</script>

<template>
  <div class="flex items-center justify-center p-8 md:p-16">
    <!-- Adobe Style Text Transform Box -->
    <div class="relative inline-block group border border-blue-500/40 p-2 md:p-4">
      
      <!-- Corner Handles (Adobe Style) -->
      <div class="edit-handles -top-1.5 -left-1.5"></div>
      <div class="edit-handles -top-1.5 -right-1.5"></div>
      <div class="edit-handles -bottom-1.5 -left-1.5"></div>
      <div class="edit-handles -bottom-1.5 -right-1.5"></div>

      <!-- Optional: Center Handles for even more Adobe feel -->
      <div class="edit-handles top-1/2 -translate-y-1/2 -left-1.5"></div>
      <div class="edit-handles top-1/2 -translate-y-1/2 -right-1.5"></div>

      <div class="flex items-center">
        <p class="font-mono text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          <slot/><span class="cursor ml-1 inline-block h-[0.8em] w-[2px] bg-blue-600 align-middle dark:bg-blue-400 md:w-[4px]"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@reference "@/style.css";

.edit-handles {
  @apply absolute size-2.5 bg-white border border-blue-500 shadow-sm z-10;
  /* 模擬 Adobe 的藍色選取點 */
}

.cursor {
  animation: adobe-blink 1s step-end infinite;
}

@keyframes adobe-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
