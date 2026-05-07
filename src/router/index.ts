import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Portfolio from '@/components/Portfolio.vue'

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
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio,
  },
]

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  routes,
})

export default router
