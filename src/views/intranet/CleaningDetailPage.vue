<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCleaningTask, cleaningTasks, cleaningSample } from '@/mock/governance'

const route = useRoute()
const router = useRouter()
const task = computed(() => {
  const id = route.params.id as string
  return getCleaningTask(id && id !== 'demo' ? id : cleaningTasks[0].id) ?? cleaningTasks[0]
})
const keepRate = computed(() => Math.round((task.value.outputRows / task.value.inputRows) * 100))
</script>

<template>
  <div class="cd-page">
    <el-page-header @back="router.push('/intranet/cleaning')" class="ph">
      <template #content><span class="title">清洗任务 {{ task.id }} · {{ task.source }}</span></template>
    </el-page-header>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6"><div class="stat"><div class="n">{{ task.inputRows }}</div><div class="l">输入行</div></div></el-col>
      <el-col :span="6"><div class="stat"><div class="n ok">{{ task.outputRows }}</div><div class="l">输出行</div></div></el-col>
      <el-col :span="6"><div class="stat"><div class="n drop">{{ task.dropped }}</div><div class="l">丢弃行</div></div></el-col>
      <el-col :span="6"><div class="stat"><div class="n">{{ keepRate }}%</div><div class="l">保留率</div></div></el-col>
    </el-row>

    <el-card shadow="never" class="rules">
      <template #header><span class="bt">应用的清洗规则</span></template>
      <el-tag v-for="r in task.rules" :key="r" effect="plain" class="rule-tag">{{ r }}</el-tag>
    </el-card>

    <el-card shadow="never">
      <template #header><span class="bt">清洗前后对比（样例）</span></template>
      <el-table :data="cleaningSample" style="width:100%">
        <el-table-column prop="field" label="字段" width="140" />
        <el-table-column label="清洗前" min-width="180">
          <template #default="{ row }"><span class="before">{{ row.before }}</span></template>
        </el-table-column>
        <el-table-column label="清洗后" min-width="180">
          <template #default="{ row }"><span class="after">{{ row.after }}</span></template>
        </el-table-column>
        <el-table-column prop="rule" label="规则" width="160" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.ph { margin-bottom: 16px; }
.title { font-size: 18px; font-weight: 700; }
.stat-row { margin-bottom: 16px; }
.stat { background: #fff; border-radius: 8px; padding: 16px; text-align: center; }
.stat .n { font-size: 24px; font-weight: 700; color: #409eff; }
.stat .n.ok { color: #67c23a; }
.stat .n.drop { color: #f56c6c; }
.stat .l { font-size: 13px; color: #909399; margin-top: 4px; }
.bt { font-weight: 600; }
.rules { margin-bottom: 16px; }
.rule-tag { margin: 2px 6px 2px 0; }
.before { color: #f56c6c; text-decoration: line-through; }
.after { color: #67c23a; font-weight: 500; }
</style>
