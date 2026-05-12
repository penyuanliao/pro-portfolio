<script setup lang="ts">
</script>

<template>
  <div class="p-8 md:p-16">
    <div class="flex items-center">
      <p class="font-mono text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        <slot/><span class="cursor ml-1 inline-block h-[0.9em] w-[3px] bg-blue-600 align-middle dark:bg-blue-500 md:w-[5px]"></span>
      </p>
    </div>
  </div>
</template>

<style scoped></style>
