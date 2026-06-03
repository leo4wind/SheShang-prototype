import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Priority } from '@/router/nav-config'

// 版本视图：控制菜单显示哪些版本的页面
export type ViewVersion = 'v1' | 'v2' | 'v3'

export const VERSION_LABEL: Record<ViewVersion, string> = {
  v1: 'V1 · 急救闭环',
  v2: 'V1 + V2 · 协同随访',
  v3: '全部（V1 + V2 + V3）'
}

const VERSION_HIERARCHY: Record<ViewVersion, Priority[]> = {
  v1: ['v1'],
  v2: ['v1', 'v2'],
  v3: ['v1', 'v2', 'v3']
}

export const useAppStore = defineStore('app', () => {
  const viewVersion = ref<ViewVersion>('v3')
  const demoMode = ref(false)
  const pushCount = ref(0)         // 演示模式下记录推送次数（呼应 journey-4 的频次控制可视化）
  const sidebarCollapsed = ref(false)

  // 当前版本允许的优先级列表
  const allowedPriorities = computed(() => VERSION_HIERARCHY[viewVersion.value])

  function isPriorityAllowed(p: Priority): boolean {
    return allowedPriorities.value.includes(p)
  }

  function toggleDemoMode() {
    demoMode.value = !demoMode.value
    if (!demoMode.value) pushCount.value = 0
  }

  function incrementPush() {
    pushCount.value += 1
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return { viewVersion, allowedPriorities, isPriorityAllowed, demoMode, pushCount, sidebarCollapsed, toggleDemoMode, incrementPush, toggleSidebar }
})
