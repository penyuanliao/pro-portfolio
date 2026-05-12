<template xmlns="http://www.w3.org/1999/html">
  <div class="relative overflow-x-hidden text-slate-900 transition-colors duration-300 dark:text-white">
    <!-- PixiJS 容器 -->
    <div ref="pixiContainer" class="fixed inset-0"></div>

    <!-- 各個區塊組件化 -->
    <section
      class="hero-section relative z-10 flex min-h-screen flex-col items-center justify-center text-center"
    >
      <!-- ... Hero 內容 ... -->
      <div class="reveal-content">
        <h1 ref="title" class="mb-4 px-4 text-4xl font-bold opacity-0 md:text-6xl md:leading-tight">
          Hi, I'm <span class="text-blue-500">Benson</span>,<br />A Full-Stack Programmer
        </h1>
        <p ref="subtitle" class="mb-8 text-xl text-slate-500 opacity-0 dark:text-slate-400">
          with over 12 years of coding experience.
        </p>
        <div ref="cta" class="opacity-0">
          <router-link
            to="/about"
            class="rounded-full bg-blue-600 px-8 py-3 font-semibold transition-transform hover:scale-105 active:scale-95"
          >
            Explore More
          </router-link>
        </div>
      </div>
    </section>

    <ProjectsPreview :projects="projects" />

    <section class="relative z-10 flex h-screen items-center justify-center">
      <div class="scroll-final text-center">
        <h2 class="text-4xl font-bold md:text-6xl">Let's build something together.</h2>
        <p class="mt-6 text-xl text-slate-400">
          Currently available for freelance and full-time positions.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Application, Container, Graphics } from 'pixi.js'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectsPreview from '@/components/ProjectsPreview.vue'

// 註冊 ScrollTrigger
gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'Project 01',
    description: 'A brief description of your amazing project and the technology used.',
    tags: ['Vue 3', 'GSAP'],
    more: 'Read More',
    imageUrls: ['https://picsum.photos/seed/p1/800/600'],
  },
  {
    title: 'Project 02',
    description: 'Exploring the possibilities of WebGL and high-performance rendering.',
    tags: ['PixiJS', 'TypeScript'],
    more: 'Read More',
    imageUrls: ['https://picsum.photos/seed/p2/800/600'],
  },
  {
    title: 'Project 03',
    description: 'Building scalable applications with a focus on user experience.',
    tags: ['Tailwind', 'Vite'],
    more: 'Read More',
    imageUrls: ['https://picsum.photos/seed/p3/800/600'],
  },
]

const pixiContainer = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const subtitle = ref<HTMLElement | null>(null)
const cta = ref<HTMLElement | null>(null)
const pixiEnabled: boolean = false
let app: Application | null = null
let ctx: gsap.Context | null = null

// --- 對齊 CSS 網格的電路板邏輯 ---
const GRID_SIZE = 40 // 與 CSS 的佈局節奏對齊 (例如 40px)

const snapToGrid = (val: number) => Math.round(val / GRID_SIZE) * GRID_SIZE

class CircuitPulse {
  graphics: Graphics
  path: { x: number; y: number }[]
  progress: number
  speed: number

  constructor(path: { x: number; y: number }[], size: number = 2.5) {
    this.path = path
    this.graphics = new Graphics()
    this.progress = 0
    this.speed = 0.001 + Math.random() * 0.002

    // 繪製粒子 (光點)
    this.graphics.circle(0, 0, size)
    this.graphics.fill({ color: 0xffffff, alpha: 0.5 }) // 使用 blue-500
    // this.graphics.filters = [new BlurFilter({ strength: size * 0.8 })];
  }

  update(deltaTime: number) {
    this.progress += this.speed * deltaTime
    if (this.progress >= 1) this.progress = 0

    const totalSegments = this.path.length - 1
    const scaledProgress = this.progress * totalSegments
    const index = Math.floor(scaledProgress)
    const t = scaledProgress - index

    if (index < totalSegments) {
      const p1 = this.path[index]
      const p2 = this.path[index + 1]
      this.graphics.x = p1.x + (p2.x - p1.x) * t
      this.graphics.y = p1.y + (p2.y - p1.y) * t
    }
  }
}

const createSnappedPath = (width: number, height: number) => {
  const steps = 3 + Math.floor(Math.random() * 3)
  const path = []
  // 起點對齊網格
  let curX = snapToGrid(Math.random() * width)
  let curY = snapToGrid(Math.random() * height)
  path.push({ x: curX, y: curY })

  for (let i = 0; i < steps; i++) {
    if (i % 2 === 0) {
      curX = snapToGrid(curX + (Math.random() > 0.5 ? 1 : -1) * GRID_SIZE * 4)
    } else {
      curY = snapToGrid(curY + (Math.random() > 0.5 ? 1 : -1) * GRID_SIZE * 4)
    }
    path.push({ x: curX, y: curY })
  }
  return path
}
const setupPixijs = async () => {
  if (!pixiEnabled) return null
  // 1. 初始化 PixiJS
  app = new Application()
  await app.init({
    resizeTo: window,
    backgroundAlpha: 0,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    hello: false,
    powerPreference: 'high-performance',
  })

  app.ticker.maxFPS = 30
  if (pixiContainer.value) {
    pixiContainer.value.appendChild(app.canvas)
  }

  // 2. 繪製導線與粒子
  const bgLines = new Graphics()
  const pulseContainer = new Container()
  const pulses: CircuitPulse[] = []

  const initCircuits = () => {
    bgLines.clear()
    pulses.forEach((p) => pulseContainer.removeChild(p.graphics))
    pulses.length = 0

    const w = window.innerWidth
    const h = window.innerHeight

    // 繪製背景參考網格 (可選，幫助對齊)
    bgLines.beginPath()
    for (let x = 0; x < w; x += GRID_SIZE) {
      bgLines.moveTo(x, 0).lineTo(x, h)
    }
    for (let y = 0; y < h; y += GRID_SIZE) {
      bgLines.moveTo(0, y).lineTo(w, y)
    }
    bgLines.stroke({ color: 0x334155, width: 0.5, alpha: 0.1 }) // slate-700 淡淡的網格

    // 生成電路
    for (let i = 0; i < 12; i++) {
      const path = createSnappedPath(w, h)

      // 如果想隱藏路徑線條，只需註解掉下方的繪製邏輯
      /*
      bgLines.moveTo(path[0].x, path[0].y);
      for (let j = 1; j < path.length; j++) {
        bgLines.lineTo(path[j].x, path[j].y);
      }
      bgLines.stroke({ color: 0x475569, width: 1, alpha: 0.2 });
      */

      const pulse = new CircuitPulse(path, 0.6)
      pulses.push(pulse)
      pulseContainer.addChild(pulse.graphics)
    }
  }

  initCircuits()
  app.stage.addChild(bgLines)
  app.stage.addChild(pulseContainer)

  // 視窗縮放重新計算
  window.addEventListener('resize', initCircuits)

  app.ticker.add((time) => {
    pulses.forEach((p) => p.update(time.deltaTime))
  })
  return app
}

const setupGSAP = () => {
  // 2. 使用 GSAP Context 管理所有的動畫與 ScrollTrigger
  ctx = gsap.context(() => {
    // 首屏進場動畫
    // 優化點：force3D: true 確保使用硬體加速
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out', force3D: true },
    })

    tl.to(title.value, { opacity: 1, y: -20, duration: 1 })
      .to(subtitle.value, { opacity: 1, y: -10, duration: 0.8 }, '-=0.5')
      .to(cta.value, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')

    // Section 2 的動畫邏輯現在已移至 ProjectsPreview 組件中

    // Section 3: 滾動縮放效果
    gsap.from('.scroll-final', {
      scrollTrigger: {
        trigger: '.scroll-final',
        start: 'top 90%',
        scrub: 1, // 讓動畫跟隨捲動進度
      },
      scale: 0.8,
      opacity: 0,
    })
  })
}

onMounted(async () => {
  await setupPixijs()
  setupGSAP()
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {})
  if (ctx) ctx.revert() // 清除所有的 ScrollTrigger 與動畫
  if (app) {
    app.ticker.stop()
    app.destroy()
    app = null
  }
})
</script>

<style scoped>
/* 額外的自定義樣式可以在這裡添加 */
</style>
