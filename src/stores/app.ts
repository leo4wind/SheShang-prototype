import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Priority } from '@/router/nav-config'

export type VersionView = Priority

export const VERSION_VIEW_LABEL: Record<VersionView, string> = {
  v1: 'V1 最小闭环',
  v2: 'V2 含协同随访',
  v3: 'V3 全部能力'
}

export const useAppStore = defineStore('app', () => {
  const versionView = ref<VersionView>('v3')
  const demoMode = ref(false)
  const pushCount = ref(0)         // 演示模式下记录推送次数（呼应 journey-4 的频次控制可视化）
  const sidebarCollapsed = ref(false)

  function setVersionView(v: VersionView) {
    versionView.value = v
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

  return {
    versionView,
    demoMode,
    pushCount,
    sidebarCollapsed,
    setVersionView,
    toggleDemoMode,
    incrementPush,
    toggleSidebar
  }
})
