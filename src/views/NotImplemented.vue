<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="not-implemented">
    <el-result icon="warning" title="路由尚未实现">
      <template #sub-title>
        <code>{{ route.path }}</code>
        <br />
        在 <code>src/router/nav-config.ts</code> 中找到对应条目，确认 view 字段指向 src/views 下的真实 .vue 文件。
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.not-implemented {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>
