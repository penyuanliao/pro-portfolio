import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Resume from '@/components/Resume.vue'
import Experience from '@/components/Experience.vue'
import Work from '@/components/Work.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/experience',
    name: 'Experience',
    component: Experience,
  },
  {
    path: '/work',
    name: 'Work',
    component: Work,
  },
  {
    path: '/resume',
    name: 'Resume',
    component: Resume,
  },
]

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes,
})

export default router
