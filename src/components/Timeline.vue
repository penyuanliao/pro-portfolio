<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TimelineItem {
  title: string
  icon: string
  start?: string
  end?: string
  [key: string]: any
}

const props = defineProps<{
  items: TimelineItem[]
  // 允許外部傳入取得圖片的函式，因為路徑可能因引用位置而異
  getIconUrl: (name: string) => string
  // 支援參數：'left' | 'alternate' | 'right'
  side?: 'left' | 'alternate' | 'right'
  // 自定義彩色線條的漸層色彩 (CSS linear-gradient)
  lineGradient?: string
  // 指定哪一個索引為「活動中」或「目標」狀態
  activeIndex?: number
  // 是否開啟滾輪追蹤功能
  scrollTrack?: boolean
}>()

const emit = defineEmits(['update:activeIndex'])

const side = props.side || 'left'
const defaultGradient = 'linear-gradient(to bottom, #3b82f6, #8b5cf6, #ec4899, #f59e0b)'
const activeGradient = props.lineGradient || defaultGradient
const timelineRef = ref(null)
const lineRef = ref(null)

const lineItems = computed(() => {
  return [
    // 頂部裝飾節點
    {
      title: '',
      icon: 'work',
      start: '',
    },
    ...props.items,
    {
      title: '',
      icon: 'work',
      start: ''
    }
  ]
})

/**
 * 計算並更新彩色線條的高度
 */
const updateLineHeight = () => {
  if (!timelineRef.value || !lineRef.value) return
  const allItems = (timelineRef.value as HTMLElement).querySelectorAll('.stagger-item')

  // 獲取節點中心點的輔助函式
  const getCenterY = (el: HTMLElement) => {
    // icon 容器高度為 40px (h-10)，其中心點在 offsetTop + 20px
    return el.offsetTop + 20
  }

  const startCenter = getCenterY(allItems[0] as HTMLElement)
  let targetHeight = 0

  // 只有當 activeIndex 大於 0 且對應的項目存在時才計算高度
  if (props.activeIndex !== undefined && props.activeIndex > 0 && allItems[props.activeIndex]) {
    const index = props.activeIndex
    const endCenter = getCenterY(allItems[index] as HTMLElement)
    targetHeight = endCenter - startCenter
  }

  // 使用 GSAP 平滑動畫改變高度
  gsap.to(lineRef.value, {
    height: targetHeight,
    duration: 0.6,
    ease: 'power2.out',
  })
}

onMounted(() => {


  console.log(`window height`, document.body.clientHeight)


  const timeline = timelineRef.value

  if (!timeline) return

  gsap.context(() => {
    // 進場動畫執行

    // 根據 side 決定動畫位移方向
    const getStaggerX = (el: HTMLElement) => {
      if (side === 'right') return 20
      if (side === 'left') return -20
      return el.classList.contains('item-left') ? -20 : 20
    }

    const tl = gsap.timeline()

    // 針對每個項目進行動畫，以便處理不同的 x 方向
    const items = gsap.utils.toArray<HTMLElement>('.stagger-item')
    items.forEach((item, i) => {
      tl.from(
        item,
        {
          opacity: 0,
          x: getStaggerX(item),
          duration: 0.8,
          ease: 'power2.out',
        },
        i === 0 ? '-=0.5' : '-=0.6',
      )
    })

    // 滾輪追蹤邏輯
    if (props.scrollTrack) {
      const domItems = (timeline as HTMLElement).querySelectorAll('li.stagger-item')
      // 我們跳過第一個裝飾點和最後一個佔位點，只偵測中間的 v-for 項目
      domItems.forEach((item, index) => {
        if (index === 0 || index === domItems.length - 1) return
        const isFirst = index === 1 // 第一個實際技能項目的 DOM 索引應該是 1
        // const isLast = index === items.length - 2

        ScrollTrigger.create({
          trigger: item,
          // 第一個項目只要進入視窗 80% 就觸發，其他的維持螢幕中心
          start: isFirst ? 'top 80%' : 'top center',
          end: 'bottom center', // 當元素底部離開螢幕中心
          preventOverlaps: true,
          fastScrollEnd: true,
          onEnter: () => emit('update:activeIndex', index), // 直接發送 DOM 索引
          onEnterBack: () => emit('update:activeIndex', index), // 直接發送 DOM 索引
          onLeaveBack: isFirst ? () => emit('update:activeIndex', 0) : undefined,
        })
      })

      // --- 全域邊界處理 ---

      // 1. 處理回到最頂部
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        onEnterBack: () => emit('update:activeIndex', 0),
      })

      // 2. 處理滾動到最底部
      const lastItem = domItems[domItems.length - 2]
      ScrollTrigger.create({
        trigger: lastItem,
        start: 'top 60%',
        end: 'bottom bottom',
        onEnter: () => emit('update:activeIndex', lineItems.value.length - 1),
      })
    }

    // 重要：當進場動畫與佈局穩定後，再計算線條高度並刷新 ScrollTrigger
    tl.add(() => {
      updateLineHeight()
      ScrollTrigger.refresh()
    })
  }, timeline)
})

// 監聽 activeIndex 變化，隨時調整線條高度
watch(
  () => props.activeIndex,
  () => {
    updateLineHeight()
  },
)
</script>

<template>
  <div ref="timelineRef" class="relative">
    <ol
      :class="['relative', side === 'alternate' ? 'mx-auto' : side === 'right' ? 'mr-3' : 'ml-3']">
      <!-- 動態背景線 -->
      <div
        :class="[
          'absolute top-5 bottom-5 w-[2px] opacity-20 dark:opacity-10',
          side === 'alternate'
            ? 'left-1/2 -translate-x-1/2'
            : side === 'right'
              ? 'right-[-1px]'
              : 'left-[-1px]',
        ]"
        :style="{ background: activeGradient }"></div>
      <div
        ref="lineRef"
        :class="[
          'timeline-line absolute top-5 w-[2px] h-0 origin-top shadow-[0_0_8px_rgba(59,130,246,0.5)]',
          side === 'alternate'
            ? 'left-1/2 -translate-x-1/2' // 這裡的定位是正確的，不需要修改
            : side === 'right'
              ? 'right-[-1px]'
              : 'left-[-1px]',
        ]"
        :style="{ background: activeGradient }"></div>
      <li
        v-for="(item, index) in lineItems"
        :key="index"
        :class="[
          'stagger-item group relative',
          index === activeIndex ? 'is-active' : '',
          side === 'alternate' // 這裡的 class 判斷是正確的，不需要修改
            ? index % 2 === 0
              ? 'item-right ml-auto w-1/2 pl-10'
              : 'item-left mr-auto w-1/2 pr-10 text-right'
            : side === 'right'
              ? 'pr-10 text-right'
              : 'pl-10',
        ]">
        <!-- 節點圖示容器：精確對齊線條中心 -->
        <div
          :class="[
            'absolute top-0 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-300 p-2 shadow-sm transition-all duration-300 dark:border-slate-500 dark:bg-slate-700',
            'group-[.is-active]:scale-125 group-[.is-active]:border-emerald-200 group-[.is-active]:bg-emerald-500 group-[.is-active]:shadow-[0_0_15px_rgba(16,185,129,0.5)]',
            side === 'alternate'
              ? index % 2 === 0
                ? 'left-0 -translate-x-1/2'
                : 'right-0 translate-x-1/2'
              : side === 'right'
                ? 'right-0 translate-x-1/2'
                : 'left-0 -translate-x-1/2',
          ]">
          <!-- 特殊處理 Cocos2D 單色圖示 -->
          <div
            v-if="item.icon === 'cocos2d'"
            :style="{ maskImage: `url(${getIconUrl(item.icon)})` }"
            class="h-full w-full bg-slate-700 mask-contain mask-center mask-no-repeat dark:bg-blue-400"></div>
          <!-- 其他彩色圖示 -->
          <img
            v-else
            :src="getIconUrl(item.icon)"
            :alt="item.title"
            class="h-full w-full object-contain" />
        </div>
        <div :style="{
          visibility: `${!!item.title ? 'visible' : 'hidden'}`,
          minHeight: `${ index === lineItems.length -1 ? '40px' : '200px'}`
        }">
          <!-- 內容卡片插槽：讓父元件決定卡片長什麼樣子 -->
          <slot :item="item">
            <div
              class="mt-2 flex items-center gap-4 rounded-xl border border-slate-100 bg-white/50 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-800/50">
              <span class="text-lg font-bold text-slate-800 dark:text-slate-200">
                {{ item.title }}
              </span>
            </div>
          </slot>
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.mask-contain {
  mask-size: contain;
}
.mask-center {
  mask-position: center;
}
.mask-no-repeat {
  mask-repeat: no-repeat;
}
</style>