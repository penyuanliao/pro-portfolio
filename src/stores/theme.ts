import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 初始化：優先檢查 LocalStorage，其次檢查系統偏好
  const isDark = ref(
    localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  )

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // 監聽變化並應用到 DOM 與 LocalStorage
  watchEffect(() => {
    const root = document.documentElement
    const theme = isDark.value ? 'dark' : 'light'
    root.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', theme)
  })

  return { isDark, toggleTheme }
})
