<script setup lang="ts">
import { computed, onMounted, onUnmounted, type PropType, ref, watch } from 'vue'
import gsap from 'gsap'
import TerminalWindow from '@/components/typewriter/TerminalWindow.vue'
import TransparentWindow from '@/components/typewriter/TransparentWindow.vue'
import EditTextWindow from '@/components/typewriter/EditTextWindow.vue'

// 定義 Props，讓外部可以傳入文字
const props = defineProps({
  words: {
    type: Array as PropType<string[]>,
    default: () => [
      'I,m <span class="text-blue-500">Developer</span>', 'I,m Designer', 'I,m Creative'],
  },
  mode: {
    type: String as PropType<'terminal' | 'edit' | 'transparent'>,
    default: 'transparent',
  },
  loop: {
    type: Boolean,
    default: true,
  },
  delay: {
    type: Number,
    default: 2.5,
  },
  finish: {
    type: String as PropType<'start' | 'end' | 'clear'>,
    default: 'end',
  }
})
// 動態對應顯示模式的組件
const modeComponents = {
  terminal: TerminalWindow,
  edit: EditTextWindow,
  transparent: TransparentWindow,
}
const animatedText = ref(props.words[0] || '') // 初始化顯示陣列中的第一個文字
let ctx: gsap.Context | null = null // 用於管理 GSAP 動畫的上下文
let timeline: gsap.core.Timeline | null = null

const activeComponent = computed(() => modeComponents[props.mode] || modeComponents.transparent)

// 將字串拆解成標籤與文字的陣列 (Tokens)
const tokenize = (str: string) => {
  // 這個正則表達式會匹配 HTML 標籤或是單個字元
  return str.match(/<[^>]*>|[^<]/g) || []
}

// 比較兩個 Token 陣列，找出共同前綴
const getCommonPrefixTokens = (tokens1: string[], tokens2: string[]) => {
  let i = 0
  while (i < tokens1.length && i < tokens2.length && tokens1[i] === tokens2[i]) {
    i++
  }
  return tokens1.slice(0, i)
}

const initAnimation = () => {
  const { words, loop, finish } = props
  if (words.length < 2) return

  // 使用 GSAP Context 來管理動畫，方便在組件卸載時清理
  ctx = gsap.context(() => {
    timeline = gsap.timeline({
      repeat: loop ? -1 : 0, // 無限循環
      defaults: { ease: 'none' }, // 確保文字變化是線性的，沒有加速減速
    })

    // 遍歷所有單字，建立循環動畫
    words.forEach((currentWord, index) => {
      const isLastWord = index === words.length - 1
      const nextIndex = (index + 1) % words.length

      // 處理結束邏輯
      if (isLastWord && !loop && finish === 'end') return

      const nextWord = isLastWord && !loop && finish === 'clear' ? '' : words[nextIndex]

      const currentTokens = tokenize(currentWord)
      const nextTokens = tokenize(nextWord)
      const commonTokens = getCommonPrefixTokens(currentTokens, nextTokens)

      const stepsToDelete = currentTokens.length - commonTokens.length
      const stepsToType = nextTokens.length - commonTokens.length
      const commonPart = commonTokens.join('')

      // 階段 1: 刪除當前單字多餘的部分
      timeline?.to(
        {},
        {
          // 動態計算刪除時間：字元越多，時間越長。設定約每秒刪除 25 個字元
          duration: Math.max(0.5, stepsToDelete * 0.04),
          onUpdate: function () {
            const progress = this.progress()
            const deleteCount = Math.round(progress * stepsToDelete)
            animatedText.value = currentTokens.slice(0, currentTokens.length - deleteCount).join('')
          },
        },
      )

      // 階段 2: 輸入下一個單字的部分
      timeline?.to(
        {},
        {
          // 動態計算輸入時間：輸入通常比刪除慢一點，設定約每秒輸入 15 個字元
          duration: Math.max(0.8, stepsToType * 0.07),
          onUpdate: function () {
            const progress = this.progress()
            const typeCount = Math.round(progress * stepsToType)
            const typedPart = nextTokens
              .slice(commonTokens.length, commonTokens.length + typeCount)
              .join('')

            animatedText.value = commonPart + typedPart
          },
        },
      )

      // 階段 3: 停頓一下讓使用者閱讀
      // 增加停頓時間，讓讀者有足夠時間看完內容
      timeline?.to({}, { duration: props.delay })
    })
  })
}

onMounted(() => {
  initAnimation()
})

// 監聽參數變化，自動重啟動畫
watch([() => props.words, () => props.loop, () => props.finish], () => {
  initAnimation()
}, { deep: true })

onUnmounted(() => {
  if (ctx) ctx.revert() // 在組件卸載時清理所有 GSAP 動畫和 ScrollTrigger
})
</script>

<template>
  <!-- 仿終端機/編輯器外框 -->
  <component :is="activeComponent">
    <span v-html="animatedText"></span>
  </component>
</template>

<style scoped lang="scss">

/* 當文字在變動時，可以考慮讓游標停止閃爍，或者保持閃爍，視視覺需求而定 */
.parallax-card {
  will-change: transform, opacity;
}
</style>
