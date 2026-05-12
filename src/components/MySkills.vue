<script setup lang="ts">
  // 定義 Props 介面
  export interface SkillItem {
    name: string;
    icon: string;
  }

  withDefaults(defineProps<{
    expertise?: SkillItem[]
  }>(), {
    expertise: () => []
  })
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-white py-10">
    <!-- 
      使用 writing-mode 讓瀏覽器正確計算垂直高度
      whitespace-nowrap 防止文字換行
    -->
    <span class="text-sm font-bold tracking-widest [writing-mode:vertical-lr] whitespace-nowrap">
      MY EXPERTISE
    </span>

    <div class="h-10 w-px bg-white/50 mb-4" />

    <div v-for="item in expertise" :key="item.name"
      class="index group relative size-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex justify-center items-center transition-all hover:bg-white hover:scale-110">
      <img class="size-7 object-contain" :src="item.icon" :alt="item.name"/>
    </div>
  </div>
</template>
<style scoped></style>
