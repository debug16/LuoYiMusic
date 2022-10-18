import { ViteSSG } from 'vite-ssg'
import { setupLayouts } from 'virtual:generated-layouts'
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

import App from './App.vue'
import generatedRoutes from '~pages'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

// 获取playlist路由信息
const playlistRoute: RouteRecordRaw | any = generatedRoutes.find((route) => {
  if (route.name === 'playlist-id')
    return true
  return false
})
// 给playlist路由添加路由守卫
playlistRoute.beforeEnter = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: Function): void => {
  next()
}

const routes = setupLayouts(generatedRoutes)

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  { routes, base: import.meta.env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.globEager('./modules/*.ts')).forEach(i => i.install?.(ctx))
  },
)
