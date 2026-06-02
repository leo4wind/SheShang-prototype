<script setup lang="ts">
// 通用页面占位骨架。用于 v1 阶段的所有空白页：
// 1. 顶部 chips 显示 ID / 主线 / 终端 / 类型 / 优先级
// 2. 中间一段说明文字 + 文档链接，便于点开就知道这页要做什么
// 3. slot 留给后续填充
import { useRoute } from 'vue-router'
import { computed } from 'vue'

defineProps<{
  id?: string
  title?: string
  journey?: string
  terminal?: string
  type?: string
  priority?: string
  description?: string
}>()

const route = useRoute()

const fallback = computed(() => ({
  id: route.meta.id as string | undefined,
  title: route.meta.title as string | undefined,
  journey: route.meta.journey as string | undefined,
  type: route.meta.type as string | undefined,
  priority: route.meta.priority as string | undefined,
  terminal: route.meta.groupTitle as string | undefined,
  subGroup: route.meta.subGroup as string | undefined
}))
</script>

<template>
  <div class="page-skeleton">
    <div class="head">
      <h2 class="title">
        <span class="id">{{ id ?? fallback.id }}</span>
        <span>{{ title ?? fallback.title }}</span>
      </h2>
      <div class="chips">
        <el-tag v-if="terminal ?? fallback.terminal" size="small" type="info">
          {{ terminal ?? fallback.terminal }}
        </el-tag>
        <el-tag v-if="fallback.subGroup" size="small" effect="plain">
          {{ fallback.subGroup }}
        </el-tag>
        <el-tag v-if="journey ?? fallback.journey" size="small" effect="plain">
          {{ journey ?? fallback.journey }}
        </el-tag>
        <el-tag v-if="type ?? fallback.type" size="small" effect="plain">
          {{ type ?? fallback.type }}
        </el-tag>
        <el-tag
          v-if="priority ?? fallback.priority"
          size="small"
          :type="(priority ?? fallback.priority) === 'v1' ? 'success' : (priority ?? fallback.priority) === 'v2' ? 'warning' : 'info'"
        >
          {{ priority ?? fallback.priority }}
        </el-tag>
      </div>
    </div>

    <el-alert
      v-if="description"
      :title="description"
      type="info"
      :closable="false"
      show-icon
      class="desc"
    />

    <slot>
      <el-empty description="此页面待填充">
        <template #image>
          <el-icon :size="64" color="#c0c4cc"><Document /></el-icon>
        </template>
        <div class="hint">
          <p>填充本页时请参考：</p>
          <ul>
            <li>
              <code>docs/page-inventory.md</code> — 找到
              <strong>{{ id ?? fallback.id }}</strong> 行
            </li>
            <li v-if="(journey ?? fallback.journey)">
              <code>docs/journeys/journey-{{ journeyToFile(journey ?? fallback.journey) }}.md</code>
              — 该页在主线里的位置
            </li>
            <li><code>docs/information-architecture.md</code> — 跨终端跳转约定</li>
          </ul>
        </div>
      </el-empty>
    </slot>
  </div>
</template>

<script lang="ts">
function journeyToFile(j?: string): string {
  if (!j) return '?'
  const first = j.charAt(1)
  if (first === '1') return '1-emergency'
  if (first === '2') return '2-data'
  if (first === '3') return '3-doctor'
  if (first === '4') return '4-care'
  return '?'
}
export { journeyToFile }
</script>

<style scoped>
.page-skeleton {
  background: #fff;
  border-radius: 6px;
  padding: 20px;
  min-height: 400px;
}

/* phone shell 内 padding 缩小 */
:deep(.phone-content) .page-skeleton {
  border-radius: 0;
  padding: 16px;
  min-height: 100%;
}

.head {
  margin-bottom: 16px;
}

.title {
  margin: 0 0 8px;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.id {
  font-family: ui-monospace, Menlo, monospace;
  font-size: 13px;
  background: #f0f2f5;
  color: #606266;
  padding: 2px 8px;
  border-radius: 4px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.desc {
  margin-bottom: 16px;
}

.hint {
  font-size: 13px;
  color: var(--color-text-secondary);
  text-align: left;
}

.hint ul {
  list-style: disc;
  padding-left: 18px;
  margin: 6px 0 0;
}

.hint li {
  margin: 4px 0;
}
</style>
