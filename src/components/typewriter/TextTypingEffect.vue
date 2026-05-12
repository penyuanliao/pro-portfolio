<script setup lang="ts">
import { onMounted, onUnmounted, type PropType, ref } from 'vue'
import gsap from 'gsap'
import TerminalWindow from '@/components/typewriter/TerminalWindow.vue'
import TransparentWindow from '@/components/typewriter/TransparentWindow.vue'

// 定義 Props，讓外部可以傳入文字
const props = defineProps({
  words: {
    type: Array as PropType<string[]>,
    default: () => ['I,m Developer', 'I,m Designer', 'I,m Creative'],
  },
  showFrame: {
    type: Boolean,
    default: false,
  },
})

const animatedText = ref(props.words[0] || '') // 初始化顯示陣列中的第一個文字
let ctx: gsap.Context | null = null // 用於管理 GSAP 動畫的上下文
let timeline: gsap.core.Timeline | null = null

// 自動計算共同前綴的邏輯
const getCommonPrefix = (str1: string, str2: string) => {
  let i = 0
  while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
    i++
  }
  return str1.substring(0, i)
}

onMounted(() => {
  const { words } = props
  if (words.length < 2) return

  // 使用 GSAP Context 來管理動畫，方便在組件卸載時清理
  ctx = gsap.context(() => {
    timeline = gsap.timeline({
      repeat: -1, // 無限循環
      defaults: { ease: 'none' }, // 確保文字變化是線性的，沒有加速減速
    })

    // 遍歷所有單字，建立循環動畫
    words.forEach((currentWord, index) => {
      const nextWord = words[(index + 1) % words.length]
      const commonPrefix = getCommonPrefix(currentWord, nextWord)

      const charsToDelete = currentWord.length - commonPrefix.length
      const charsToType = nextWord.length - commonPrefix.length

      // 階段 1: 刪除當前單字多餘的部分
      timeline?.to(
        {},
        {
          duration: 0.6,
          onUpdate: function () {
            const progress = this.progress()
            const deleteCount = Math.round(progress * charsToDelete)
            animatedText.value = currentWord.substring(0, currentWord.length - deleteCount)
          },
        },
      )

      // 階段 2: 輸入下一個單字的部分
      timeline?.to(
        {},
        {
          duration: 0.8,
          onUpdate: function () {
            const progress = this.progress()
            const typeCount = Math.round(progress * charsToType)
            animatedText.value =
              commonPrefix +
              nextWord.substring(commonPrefix.length, commonPrefix.length + typeCount)
          },
        },
      )

      // 階段 3: 停頓一下讓使用者閱讀
      timeline?.to({}, { duration: 1.5 })
    })
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert() // 在組件卸載時清理所有 GSAP 動畫和 ScrollTrigger
})
</script>

<template>
  <!-- 仿終端機/編輯器外框 -->
  <Component :is="showFrame ? TerminalWindow : TransparentWindow">{{ animatedText }}</Component>
</template>

<style scoped>
.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from,
  to {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* 當文字在變動時，可以考慮讓游標停止閃爍，或者保持閃爍，視視覺需求而定 */
.parallax-card {
  will-change: transform, opacity;
}
</style>
