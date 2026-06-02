<script setup lang="ts">
import { useRouter } from 'vue-router'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { cleaningTasks } from '@/mock/governance'

const router = useRouter()
const statusType: Record<string, string> = { 已完成: 'success', 运行中: 'warning', 失败: 'danger' }
</script>

<template>
  <div class="cl-page">
    <div class="page-head">
      <div>
        <h2>清洗任务列表</h2>
        <p class="sub">冷通道完整治理第 2 步：脱敏后进入清洗（去重 / 空值 / 单位 / 编码）</p>
      </div>
      <MockDataLabel />
    </div>

    <el-card shadow="never">
      <el-table :data="cleaningTasks" style="width:100%">
        <el-table-column prop="id" label="任务号" width="90" />
        <el-table-column prop="source" label="数据源" min-width="160" />
        <el-table-column label="输入 / 输出 / 丢弃" min-width="180">
          <template #default="{ row }">
            <span class="io">{{ row.inputRows }}</span> →
            <span class="io ok">{{ row.outputRows }}</span> ·
            <span class="io drop">丢 {{ row.dropped }}</span>
          </template>
        </el-table-column>
        <el-table-column label="清洗规则" min-width="220">
          <template #default="{ row }">
            <el-tag v-for="r in row.rules" :key="r" size="small" effect="plain" class="rule-tag">{{ r }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="statusType[row.status] as any">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="finishedAt" label="完成" width="90" />
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="router.push(`/intranet/cleaning/${row.id}`)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.io { font-weight: 600; }
.io.ok { color: #67c23a; }
.io.drop { color: #f56c6c; }
.rule-tag { margin: 2px 4px 2px 0; }
</style>
