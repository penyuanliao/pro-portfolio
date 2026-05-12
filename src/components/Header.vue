<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import ThemeToggle from '@/components/ThemeToggle.vue'

const route = useRoute()
const menuRef = ref<HTMLElement | null>(null)
const underlineRef = ref<HTMLElement | null>(null)
const menuShow = ref<boolean>(false)
const isMobile = ref<boolean>(false)

/**
 * 移動底線到指定的元素位置
 * @param el 目標 HTML 元素
 * @param immediate 是否立即跳轉（無動畫）
 */
const moveUnderline = (el: HTMLElement | null, immediate = false) => {
  if (!underlineRef.value || !el) return

  isMobile.value = window.innerWidth < 768 // 對應 Tailwind 的 md 斷點

  const mobileDevice = isMobile.value

  gsap.to(underlineRef.value, {
    x: mobileDevice ? 0 : el.offsetLeft,
    y: mobileDevice ? el.offsetTop : el.offsetTop + el.offsetHeight - 8, // 8px 是微調原先 bottom-2 的位置
    width: mobileDevice ? 4 : el.offsetWidth, // 行動版變成 4px 寬的垂直線
    height: mobileDevice ? el.offsetHeight : 2, // 行動版跟隨項目高度，桌機版維持 2px
    opacity: 1,
    duration: immediate ? 0 : 0.5,
    ease: 'power3.out',
    overwrite: true,
  })
}

/**
 * 尋找目前路徑對應的啟動連結並更新底線
 */
const updatePosition = async (immediate = false) => {
  await nextTick() // 確保 DOM 已更新，router-link-active 已掛載
  let targetLink: HTMLElement | null = null

  // 優先尋找目前活躍的連結
  const activeLink = menuRef.value?.querySelector('.router-link-active') as HTMLElement
  if (activeLink) {
    targetLink = activeLink
  } else {
    // 如果沒有活躍連結 (例如，初始載入時或路由未匹配)，則預設為第一個導航連結 (Home)
    targetLink = menuRef.value?.querySelector('.nav-link') as HTMLElement
  }

  if (targetLink) {
    moveUnderline(targetLink, immediate)
  } else {
    // 如果連任何導航連結都找不到，則隱藏底線
    gsap.to(underlineRef.value, { opacity: 0, duration: 0.3 })
  }
}

const handleResize = () => {
  updatePosition(true)
}

onMounted(() => {
  updatePosition(true) // 初始化位置
  window.addEventListener('resize', handleResize)
  isMobile.value = window.innerWidth < 768
})

// 監聽路由變化，當使用者切換頁面時自動移動底線
watch(
  () => route.path,
  () => {
    updatePosition()
  },
)

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <header class="sticky inset-x-0 top-0 w-full">
    <div class="py-1 backdrop-blur-md">
      <div class="flex h-14 items-center justify-between gap-8 px-4 sm:px-6">
        <div class="flex items-center gap-4">
          <router-link class="shrink-0 text-3xl font-bold text-white" aria-label="Home" to="/">
            Benson
            <span class="text-blue-600">.</span>
          </router-link>
        </div>

        <div
          ref="menuRef"
          class="menu"
          :style="{ display: isMobile ? (menuShow ? 'flex' : 'none') : 'flex' }">
          <router-link
            class="nav-link max-md: flex h-10 items-center justify-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-white"
            to="/">
            Home
          </router-link>
          <router-link
            class="nav-link max-md: flex h-10 items-center justify-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-white"
            to="/about">
            About
          </router-link>
          <router-link
            class="nav-link max-md: flex h-10 items-center justify-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-white"
            to="/experience">
            Experience
          </router-link>
          <router-link
            class="nav-link max-md: flex h-10 items-center justify-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-white"
            to="/work">
            Work
          </router-link>
          <router-link
            class="nav-link max-md: flex h-10 items-center justify-center text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 dark:text-slate-300 dark:hover:text-white"
            to="/resume">
            Resume
          </router-link>
          <!-- 動態底線 -->
          <div
            ref="underlineRef"
            class="absolute left-0 top-0 bg-blue-600 opacity-0 will-change-transform" />
          <ThemeToggle class="md: hidden" />
        </div>
        <div class="flex items-center gap-2.5 md:hidden">
          <div
            class="popup-button"
            role="button"
            tabindex="0"
            aria-label="Navigation"
            @click="menuShow = !menuShow">
            <span
              class="-translate-1/2 pointer-fine:hidden absolute left-1/2 top-1/2 size-11"></span>
            <svg viewBox="0 0 16 16" fill="currentColor" class="size-4">
              <path
                d="M8 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM8 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM9.5 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.popup-button {
  @apply relative inline-grid size-7 cursor-pointer place-items-center rounded-md text-gray-950 hover:bg-gray-950/5 dark:text-white dark:hover:bg-white/10;
}
.menu {
  @apply relative flex items-center gap-6 max-md:absolute max-md:left-0 max-md:right-0 max-md:top-16 max-md:mx-3 max-md:hidden max-md:flex-col max-md:items-start max-md:gap-0 max-md:overflow-hidden max-md:rounded-2xl max-md:border max-md:border-slate-200/50 max-md:bg-white/80 max-md:p-4 max-md:backdrop-blur-md dark:max-md:border-white/10 dark:max-md:bg-slate-900/80;
}
</style>
