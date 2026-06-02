<script setup lang="ts">
// 375px × 667px 的手机壳容器，用于在 PC 项目里模拟患者小程序和医生 APP
// 内含状态栏占位 + 内容滚动区。子页面按 375 宽度写即可。
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const terminal = computed<'patient' | 'doctor-app'>(() => {
  return (route.meta.group as string) === 'doctor-app' ? 'doctor-app' : 'patient'
})
const labelText = computed(() => (terminal.value === 'patient' ? '患者小程序' : '医生 APP'))
</script>

<template>
  <div class="phone-shell">
    <div class="phone-frame" :data-terminal="terminal">
      <div class="status-bar">
        <span class="time">9:41</span>
        <span class="indicators">
          <span>•••</span>
          <span>5G</span>
          <span>100%</span>
        </span>
      </div>
      <div class="phone-content">
        <slot />
      </div>
      <div class="home-indicator" />
    </div>
    <div class="terminal-label">{{ labelText }} · 375 × 667</div>
  </div>
</template>

<style scoped>
.phone-shell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.phone-frame {
  width: 375px;
  height: 667px;
  background: #fff;
  border-radius: 36px;
  border: 10px solid var(--color-phone-shell);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.phone-frame[data-terminal='doctor-app'] {
  border-color: #0050b3;
}

.status-bar {
  height: 24px;
  background: #f5f5f7;
  color: #303133;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 18px;
  font-size: 12px;
  flex-shrink: 0;
}

.status-bar .indicators {
  display: inline-flex;
  gap: 8px;
}

.phone-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--color-phone-bg);
}

.home-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  width: 100px;
  height: 4px;
  background: #303133;
  border-radius: 2px;
  transform: translateX(-50%);
  opacity: 0.3;
}

.terminal-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
