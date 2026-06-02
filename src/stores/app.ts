import { defineStore } from 'pinia'
import { ref } from 'vue'

// 当前演示角色（用于左菜单顶部展示和未来的权限模拟）
export type DemoRole =
  | 'patient'        // 蛇伤患者
  | 'doctor'         // 接诊医生
  | 'expert'         // 多中心专家
  | 'data-admin'     // 数据管理员
  | 'researcher'     // 科研人员
  | 'sys-admin'      // 系统管理员

export const ROLE_LABEL: Record<DemoRole, string> = {
  patient: '蛇伤患者 / 家属',
  doctor: '接诊医生',
  expert: '多中心专家',
  'data-admin': '数据管理员',
  researcher: '科研人员',
  'sys-admin': '系统管理员'
}

export const useAppStore = defineStore('app', () => {
  const role = ref<DemoRole>('doctor')
  const demoMode = ref(false)
  const pushCount = ref(0)         // 演示模式下记录推送次数（呼应 journey-4 的频次控制可视化）
  const sidebarCollapsed = ref(false)

  function setRole(r: DemoRole) {
    role.value = r
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

  return { role, demoMode, pushCount, sidebarCollapsed, setRole, toggleDemoMode, incrementPush, toggleSidebar }
})
