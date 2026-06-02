<script setup lang="ts">
// 在列表 / 详情顶部加一个"Mock 数据"水印徽章
defineProps<{ text?: string }>()
</script>

<template>
  <span class="mock-data-label">
    <el-icon><Warning /></el-icon>
    {{ text ?? 'Mock 数据 · 仅供原型演示' }}
  </span>
</template>

<style scoped>
.mock-data-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #e6a23c;
  background: #fdf6ec;
  border: 1px dashed #e6a23c;
  padding: 2px 8px;
  border-radius: 10px;
}
</style>
