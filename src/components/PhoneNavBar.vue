<script setup lang="ts">
// 手机页面内的顶部导航条（标题 + 可选返回）
import { useRouter } from 'vue-router'

defineProps<{
  title: string
  back?: string       // 返回目标路由；不传则不显示返回箭头
  theme?: 'light' | 'primary' | 'danger'
}>()

const router = useRouter()
</script>

<template>
  <div class="phone-nav" :class="theme ?? 'light'">
    <div class="left">
      <el-icon v-if="back" class="back" @click="router.push(back)"><ArrowLeft /></el-icon>
    </div>
    <div class="title">{{ title }}</div>
    <div class="right">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.phone-nav {
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
}
.phone-nav .left,
.phone-nav .right {
  width: 40px;
  display: flex;
  align-items: center;
}
.phone-nav .right {
  justify-content: flex-end;
}
.phone-nav .title {
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.back {
  cursor: pointer;
  font-size: 18px;
}
.light {
  background: #fff;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
}
.primary {
  background: #409eff;
  color: #fff;
}
.danger {
  background: #f56c6c;
  color: #fff;
}
</style>
