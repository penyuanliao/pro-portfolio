<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import GridBackground from '@/components/GridBackground.vue'
import Header from '@/components/Header.vue'
import MySkills, { type SkillItem } from '@/components/MySkills.vue'
import ReviewBox from '@/components/ReviewBox.vue'

const expertise = ref<SkillItem[]>([
  { name: 'Node.js', icon: '/src/assets/expertise/nodejs.svg' },
  { name: 'PixiJS', icon: '/src/assets/expertise/pixijs.svg' },
  { name: 'Vue.js', icon: '/src/assets/expertise/vue.svg' },
  { name: 'TypeScript', icon: '/src/assets/expertise/typescript.svg' },
])
</script>

<template>
  <Header class="z-30" />
  <GridBackground />
  <MySkills :expertise="expertise" class="absolute right-6 top-20 z-20" />
  <ReviewBox />
  <!--  <ThemeToggle class="fixed" />-->
  <RouterView v-slot="{ Component }">
    <Suspense>
      <template #default>
        <div>
          <component :is="Component" />
        </div>
      </template>
      <template #fallback></template>
    </Suspense>
  </RouterView>
</template>
