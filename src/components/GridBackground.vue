<template>
  <!-- 這裡的 bg-white 和 dark:bg-slate-900 負責全域底色 -->
  <div class="fixed inset-0 -z-10 bg-white transition-colors duration-300 dark:bg-slate-900">
    <!-- 網格圖案層 -->
    <div class="grid-pattern absolute inset-0 opacity-10 dark:opacity-20"></div>

    <!-- 裝飾光暈 -->
    <div
      class="absolute -top-[10%] left-[10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.grid-pattern {
  --mask-gradient: radial-gradient(60% 50% at 50% 0%, #000 70%, transparent 100%);

  /* URL-encode spaces and special characters to fix the "Mismatched property value" error */
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='40'%20height='40'%20viewBox='0%200%2040%2040'%3E%3Cpath%20d='M40%200L0%200%200%2040'%20fill='none'%20stroke='%23475569'%20stroke-width='0.5'/%3E%3C/svg%3E");
  background-size: 40px 40px;
  
  /* 加上瀏覽器前綴以支援 Safari */
  -webkit-mask-image: var(--mask-gradient);
  mask-image: var(--mask-gradient);
}

.fixed {
  pointer-events: none;
}
</style>
