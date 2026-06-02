<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { diagnosisHistory } from '@/mock/clinical'
import type { EChartsOption } from 'echarts'

const total = diagnosisHistory.length
const adopted = computed(() => diagnosisHistory.filter((d) => d.adopted).length)
const rate = computed(() => Math.round((adopted.value / total) * 100))

const pieOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie', radius: ['45%', '70%'],
    data: [
      { name: '采纳 Agent 首选', value: adopted.value },
      { name: '医生调整', value: total - adopted.value }
    ],
    color: ['#67c23a', '#e6a23c'],
    label: { fontSize: 12 }
  }]
}))
</script>

<template>
  <div class="dh-page">
    <div class="page-head">
      <div>
        <h2>历史判定复盘</h2>
        <p class="sub">Agent 蛇种判定建议 vs 医生最终诊断，采纳率回流为模型优化依据</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16">
      <el-col :span="6"><div class="stat"><div class="n">{{ total }}</div><div class="l">复盘病例</div></div></el-col>
      <el-col :span="6"><div class="stat"><div class="n ok">{{ rate }}%</div><div class="l">Agent 采纳率</div></div></el-col>
      <el-col :span="6"><div class="stat"><div class="n warn">{{ total - adopted }}</div><div class="l">医生调整</div></div></el-col>
      <el-col :span="6">
        <el-card shadow="never" class="pie-card"><BaseChart :option="pieOption" height="120px" /></el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="table-card">
      <template #header><span class="bt">判定明细</span></template>
      <el-table :data="diagnosisHistory" style="width:100%">
        <el-table-column prop="caseId" label="病例号" width="140" />
        <el-table-column prop="patientName" label="患者" width="100" />
        <el-table-column label="Agent 首选" min-width="160">
          <template #default="{ row }">{{ row.agentTop }} <span class="conf">({{ row.agentConfidence }}%)</span></template>
        </el-table-column>
        <el-table-column prop="doctorFinal" label="医生最终" min-width="120" />
        <el-table-column label="是否采纳" width="110">
          <template #default="{ row }">
            <el-tag size="small" :type="row.adopted ? 'success' : 'warning'">{{ row.adopted ? '采纳' : '调整' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="90" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.stat { background: #fff; border-radius: 8px; padding: 16px; text-align: center; }
.stat .n { font-size: 26px; font-weight: 700; color: #409eff; }
.stat .n.ok { color: #67c23a; }
.stat .n.warn { color: #e6a23c; }
.stat .l { font-size: 13px; color: #909399; margin-top: 4px; }
.pie-card { padding: 0; }
.bt { font-weight: 600; }
.table-card { margin-top: 16px; }
.conf { color: #909399; font-size: 12px; }
</style>
