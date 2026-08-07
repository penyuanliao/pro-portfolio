<script setup lang="ts">
import { computed, onMounted, ref, watch, onUnmounted, type Component } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface TimelineItem {
  title: string
  icon: string
  start?: string
  end?: string
  desc?: string
  company?: string
  // 自定義圖示元件
  iconComponent?: Component
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
  // 內容垂直置中
  verticalCenter?: boolean
  // 開始圖示
  startIcon?: string
  // 結束圖示
  endIcon?: string
}>()

const SIDE_TYPE = {
  LEFT: 'left',
  RIGHT: 'right',
  ALTERNATE: 'alternate',
}

const emit = defineEmits(['update:activeIndex'])

const side = props.side || SIDE_TYPE.LEFT
const activeGradient = props.lineGradient || 'linear-gradient(to bottom, #3b82f6, #8b5cf6, #ec4899, #f59e0b)'
const timelineRef = ref(null)
const lineRef = ref<HTMLElement | null>(null)
const itemRefs = ref<HTMLElement[]>([]) // 用於取代 querySelectorAll

const lineItems = computed(() => {
  return [
    // 頂部裝飾節點
    {
      title: '',
      icon: props.startIcon ? props.startIcon : 'work',
      start: '',
    },
    ...props.items,
    {
      title: '',
      icon: props.endIcon ? props.endIcon : 'work',
      start: '',
    },
  ]
})

const setItemRef = (el: any) => {
  if (el) itemRefs.value.push(el as HTMLElement)
}

/**
 * 計算並更新彩色線條的高度
 */
const updateLineHeight = () => {
  if (!timelineRef.value || !lineRef.value) return
  const allItems = itemRefs.value

  // 獲取節點中心點的輔助函式
  const getCenterY = (el: HTMLElement) => {
    const iconEl = el.querySelector('.icon-container') as HTMLElement
    return el.offsetTop + (iconEl?.offsetHeight || 40) / 2
  }

  const startCenter = getCenterY(allItems[0])
  let targetHeight = 0

  // 只要 activeIndex 存在且大於等於 0
  if (props.activeIndex !== undefined && props.activeIndex >= 0 && allItems[props.activeIndex]) {
    targetHeight = getCenterY(allItems[props.activeIndex]) - startCenter
  }

  // 使用 GSAP 平滑動畫改變高度
  gsap.to(lineRef.value, {
    height: targetHeight,
    duration: 0.6,
    ease: 'power2.out',
  })
}

const iconPositionTimeline = (index: number) => {
  if (side.startsWith('alternate')) {
    return index % 2 === 0 ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2';
  } else if (side.startsWith('right')) {
    return 'right-0 translate-x-1/2'
  } else {
    return 'left-0 -translate-x-1/2'
  }
}

/**
 * 獲取項目的樣式類別
 */
const getItemClasses = (index: number) => {
  const isActive = index === props.activeIndex
  const baseClasses = 'stagger-item group relative transition-all duration-500'
  const activeClass = isActive ? 'is-active' : ''

  let layoutClass;
  if (side === 'alternate') {
    layoutClass = index % 2 === 0 ? 'item-right ml-auto w-1/2 pl-10' : 'item-left mr-auto w-1/2 pr-10 text-right'
  } else if (side === 'right') {
    layoutClass = 'pr-10 text-right'
  } else {
    layoutClass = 'pl-10'
  }

  return `${baseClasses} ${activeClass} ${layoutClass}`
}

let ctx: gsap.Context

onMounted(() => {
  if (!timelineRef.value) return

  ctx = gsap.context(() => {
    // const getStaggerX = (el: HTMLElement) => {
    //   if (side === 'right') return 20
    //   if (side === 'left') return -20
    //   return el.classList.contains('item-left') ? -20 : 20
    // }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    // 針對每個項目進行動畫，以便處理不同的 x 方向
    // const items = gsap.utils.toArray<HTMLElement>('.stagger-item')
    // items.forEach((item, i) => {
    //   tl.from(
    //     item,
    //     {
    //       opacity: 0,
    //       x: getStaggerX(item),
    //       duration: 0.8,
    //     },
    //     i === 0 ? '-=0.5' : '-=0.6',
    //   )
    // })

    // 滾輪追蹤邏輯
    if (props.scrollTrack) {
      const domItems = itemRefs.value
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
          onEnter: () => emit('update:activeIndex', index),
          onEnterBack: () => emit('update:activeIndex', index),
          onLeaveBack: isFirst ? () => emit('update:activeIndex', 0) : undefined,
        })
      })

      // 1. 處理回到最頂部：使用 ScrollTrigger 監控捲軸位置，確保靠近頂部時歸零
      ScrollTrigger.create({
        start: 0,
        end: 50, // 在頂部 50px 的範圍內
        onUpdate: (self) => {
          // 當捲軸回到非常靠近頂部的位置時，強制設為 0
          if (self.scroll() < 10) emit('update:activeIndex', 0)
        },
        onRefresh: () => {
          // 重新整理頁面時的檢查
          if (window.scrollY === 0) emit('update:activeIndex', 0)
        },
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

    tl.add(() => {
      updateLineHeight()
      ScrollTrigger.refresh()
    })

    if (window.scrollY === 0) emit('update:activeIndex', 0)
  }, timelineRef.value)
})

onUnmounted(() => {
  if (ctx) ctx.revert() // 清除所有 GSAP 動畫與 ScrollTrigger
})

watch(
  () => props.activeIndex,
  () => updateLineHeight(),
)
</script>

<template>
  <div ref="timelineRef" class="relative">
    <ol
      :class="['relative', side === 'alternate' ? 'mx-auto' : side === 'right' ? 'mr-3' : 'ml-3']">
      <!-- 動態背景線 -->
      <div
        :class="[
          'absolute top-5 bottom-5 w-0.5 opacity-20 dark:opacity-10',
          side === 'alternate'
            ? 'left-1/2 -translate-x-1/2'
            : side === 'right'
              ? '-right-px'
              : '-left-px',
        ]"
        :style="{ background: activeGradient }"></div>
      <div
        ref="lineRef"
        :class="[
          'timeline-line absolute top-5 h-0 w-0.5 origin-top shadow-[0_0_8px_rgba(59,130,246,0.5)]',
          side === 'alternate'
            ? 'left-1/2 -translate-x-1/2'
            : side === 'right'
              ? '-right-px'
              : '-left-px',
        ]"
        :style="{ background: activeGradient }"></div>
      <li
        v-for="(item, index) in lineItems"
        :key="index"
        :ref="setItemRef"
        :class="getItemClasses(index)">
        <!-- 節點圖示容器：精確對齊線條中心 -->
        <div
          v-if="item.icon"
          :class="[
            'icon-container absolute top-0 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white bg-slate-300 p-2 shadow-sm transition-all duration-300 dark:border-slate-500 dark:bg-slate-700',
            'group-[.is-active]:scale-125 group-[.is-active]:border-emerald-200 group-[.is-active]:bg-emerald-500 group-[.is-active]:shadow-[0_0_15px_rgba(16,185,129,0.5)]',
            side === 'alternate'
              ? index % 2 === 0
                ? 'left-0 -translate-x-1/2'
                : 'right-0 translate-x-1/2'
              : side === 'right'
                ? 'right-0 translate-x-1/2'
                : 'left-0 -translate-x-1/2',
          ]">
          <slot name="icon" :item="item">
            <div v-if="item.iconComponent" class="h-full w-full mask-contain mask-center">
              <component :is="item.iconComponent" name="star" />
            </div>
            <!-- 特殊處理 Cocos2D 單色圖示 -->
            <div
              v-else-if="item.icon === 'cocos2d'"
              :style="{ maskImage: `url(${getIconUrl(item.icon)})` }"
              class="h-full w-full bg-slate-700 mask-contain mask-center mask-no-repeat dark:bg-blue-400"></div>
            <!-- 其他彩色圖示 -->
            <img
              v-else-if="item.icon"
              :src="getIconUrl(item.icon)"
              :alt="item.title"
              class="h-full w-full object-contain text-white" />
            <div v-else></div>
          </slot>
        </div>
        <!-- 沒有圖示的情況 -->
        <div v-else
             :class="['absolute top-1 z-10 flex shrink-0 items-center justify-center translate-y-1/2', iconPositionTimeline(index)]"
        >
          <span class="relative flex size-3">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
            <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
          </span>
        </div>
        <div
          :class="[verticalCenter ? 'flex -translate-y-1/2 flex-col justify-center pt-6.25' : '']"
          :style="{
            visibility: `${!!item.title ? 'visible' : 'hidden'}`,
            minHeight: `${index === lineItems.length - 1 ? '20px' : '200px'}`,
            maxHeight: `${index === lineItems.length - 1 ? '20px' : 'auto'}`,
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