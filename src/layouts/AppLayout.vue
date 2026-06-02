<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { navTree, findGroupByPath } from '@/router/nav-config'
import { useAppStore, ROLE_LABEL, type DemoRole } from '@/stores/app'
import PhoneShell from '@/components/PhoneShell.vue'

const route = useRoute()
const appStore = useAppStore()
const { role, demoMode, pushCount, sidebarCollapsed } = storeToRefs(appStore)

const roleOptions = (Object.keys(ROLE_LABEL) as DemoRole[]).map((k) => ({ value: k, label: ROLE_LABEL[k] }))

const matched = computed(() => findGroupByPath(route.path))
const groupTitle = computed(() => matched.value?.group.title ?? (route.path === '/home' ? '总入口' : ''))
const subTitle = computed(() => matched.value?.sub.title ?? '')
const leafTitle = computed(() => {
  if (route.meta.title) return route.meta.title as string
  return matched.value?.leaf.title ?? ''
})

const isPhone = computed(() => route.meta.shell === 'phone')

const priorityTagType = computed(() => {
  const p = route.meta.priority as string | undefined
  if (p === 'v1') return 'success'
  if (p === 'v2') return 'warning'
  return 'info'
})
</script>

<template>
  <el-container class="app-layout">
    <el-aside :width="sidebarCollapsed ? '64px' : '280px'" class="aside">
      <div class="aside-header">
        <el-icon :size="22"><Avatar /></el-icon>
        <div v-if="!sidebarCollapsed" class="role-info">
          <div class="role-label">演示角色</div>
          <el-select v-model="role" size="small" placeholder="选择角色">
            <el-option v-for="o in roleOptions" :key="o.value" :value="o.value" :label="o.label" />
          </el-select>
        </div>
      </div>

      <el-menu
        :default-active="route.path"
        router
        class="aside-menu"
        :collapse="sidebarCollapsed"
        unique-opened
      >
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>总入口</template>
        </el-menu-item>

        <el-menu-item index="/version-roadmap">
          <el-icon><Flag /></el-icon>
          <template #title>版本规划</template>
        </el-menu-item>

        <el-sub-menu v-for="group in navTree" :key="group.key" :index="group.key">
          <template #title>
            <el-icon><component :is="group.icon" /></el-icon>
            <span>{{ group.title }}</span>
          </template>

          <el-sub-menu
            v-for="sub in group.children"
            :key="group.key + '-' + sub.title"
            :index="group.key + '-' + sub.title"
          >
            <template #title>
              <span>{{ sub.title }}</span>
            </template>
            <el-menu-item v-for="leaf in sub.children" :key="leaf.id" :index="leaf.menuPath">
              <span class="leaf-line">
                <span class="leaf-title">{{ leaf.title }}</span>
                <span class="priority-tag" :class="leaf.priority">{{ leaf.priority }}</span>
              </span>
            </el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="toggle" :size="18" @click="appStore.toggleSidebar()">
            <Expand v-if="sidebarCollapsed" />
            <Fold v-else />
          </el-icon>
          <el-breadcrumb separator="/" class="bc">
            <el-breadcrumb-item v-if="groupTitle">{{ groupTitle }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="subTitle">{{ subTitle }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ leafTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
          <el-tag v-if="route.meta.id" size="small" type="info">{{ route.meta.id }}</el-tag>
          <el-tag v-if="route.meta.priority" size="small" :type="priorityTagType">
            {{ route.meta.priority }}
          </el-tag>
          <el-tag v-if="route.meta.journey" size="small" effect="plain">{{ route.meta.journey }}</el-tag>
        </div>
        <div class="header-right">
          <span v-if="demoMode" class="push-counter">
            <el-icon><BellFilled /></el-icon>
            推送计数 {{ pushCount }}
          </span>
          <el-switch
            v-model="demoMode"
            inline-prompt
            active-text="演示模式"
            inactive-text="演示模式"
          />
        </div>
      </el-header>

      <el-main class="main">
        <div :class="['content', isPhone ? 'content-phone' : 'content-pc']">
          <template v-if="isPhone">
            <PhoneShell>
              <router-view />
            </PhoneShell>
          </template>
          <template v-else>
            <router-view />
          </template>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.app-layout {
  height: 100vh;
}

.aside {
  background: #001428;
  color: #fff;
  transition: width 0.2s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.aside-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
}

.role-info {
  flex: 1;
  min-width: 0;
}

.role-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.aside-menu {
  flex: 1;
  border-right: 0;
  overflow-y: auto;
  background: transparent;
}

.aside-menu :deep(.el-menu-item),
.aside-menu :deep(.el-sub-menu__title) {
  color: #c0c4cc;
}
.aside-menu :deep(.el-menu-item.is-active) {
  color: #fff;
  background: #1890ff;
}
.aside-menu :deep(.el-menu-item:hover),
.aside-menu :deep(.el-sub-menu__title:hover) {
  background: rgba(255, 255, 255, 0.05);
}
.aside-menu :deep(.el-sub-menu .el-menu) {
  background: rgba(0, 0, 0, 0.2);
}

.leaf-line {
  display: inline-flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.leaf-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toggle {
  cursor: pointer;
}

.bc {
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.push-counter {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  background: #fff7e6;
  color: #e6a23c;
  border: 1px solid #faecd8;
  padding: 4px 8px;
  border-radius: 4px;
}

.main {
  background: var(--color-bg);
  padding: 16px;
}

.content {
  min-height: calc(100vh - 60px - 32px);
}

.content-phone {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 16px;
}
</style>
