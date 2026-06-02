<script setup lang="ts">
// 用来标注"算法接入点"：蛇伤图像识别、NLP 抽取、Agent 初诊建议、对话理解、推送策略等
// 在该区域用黄色高亮 + 标签，让评审者一眼看到"这里以后接 AI"
defineProps<{
  title?: string
  kind?: 'agent' | 'nlp' | 'cv' | 'recommend' | 'rule'
  description?: string
}>()

const kindLabel: Record<string, string> = {
  agent: 'Agent',
  nlp: 'NLP',
  cv: '图像识别',
  recommend: '推荐',
  rule: '规则引擎'
}
</script>

<template>
  <div class="algo-placeholder">
    <div class="head">
      <el-icon><MagicStick /></el-icon>
      <span class="label">算法接入点</span>
      <el-tag v-if="kind" size="small" effect="dark">{{ kindLabel[kind] ?? kind }}</el-tag>
      <span v-if="title" class="title">· {{ title }}</span>
    </div>
    <div v-if="description" class="desc">{{ description }}</div>
    <div class="body">
      <slot>
        <span class="placeholder-text">（此处展示算法返回的 mock 结果）</span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.algo-placeholder {
  background: linear-gradient(135deg, #fffae6 0%, #fff7d6 100%);
  border: 1px dashed #e6a23c;
  border-radius: 6px;
  padding: 12px;
  margin: 12px 0;
}

.head {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #b88200;
  font-size: 13px;
  font-weight: 500;
}

.label {
  font-weight: 600;
}

.title {
  color: #606266;
  font-weight: 400;
}

.desc {
  margin: 6px 0 0;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.body {
  margin-top: 8px;
  color: var(--color-text);
}

.placeholder-text {
  color: #b88200;
  font-size: 13px;
  font-style: italic;
}
</style>
