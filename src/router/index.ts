import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { navTree } from './nav-config'

// import.meta.glob 让 Vite 在打包时把 src/views 下的 .vue 文件按需引入
const viewModules = import.meta.glob('@/views/**/*.vue')

function loadView(viewPath: string) {
  const key = `/src/views/${viewPath}.vue`
  const loader = viewModules[key]
  if (!loader) {
    return () => import('@/views/NotImplemented.vue')
  }
  return loader as () => Promise<unknown>
}

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    component: () => import('@/views/HomePage.vue'),
    meta: { id: 'P000', title: '总入口', shell: 'pc', priority: 'v1', group: 'home', subGroup: '', journey: '', type: '工作台' }
  },
  {
    path: '/version-roadmap',
    component: () => import('@/views/VersionRoadmapPage.vue'),
    meta: { id: 'P002', title: '版本规划', shell: 'pc', priority: 'v1', group: 'planning', subGroup: '', journey: '', type: '详情' }
  }
]

for (const group of navTree) {
  for (const sub of group.children) {
    for (const leaf of sub.children) {
      routes.push({
        path: leaf.routePath,
        component: loadView(leaf.view),
        meta: {
          id: leaf.id,
          title: leaf.title,
          shell: leaf.shell,
          priority: leaf.priority,
          group: group.key,
          groupTitle: group.title,
          subGroup: sub.title,
          journey: leaf.journey,
          type: leaf.type,
          hidden: leaf.hidden,
          depends: leaf.depends
        }
      })
    }
  }
}

routes.push({
  path: '/:pathMatch(.*)*',
  component: () => import('@/views/NotFound.vue'),
  meta: { id: '404', title: '页面不存在', shell: 'pc', priority: 'v1', group: '', subGroup: '', journey: '', type: '' }
})

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
