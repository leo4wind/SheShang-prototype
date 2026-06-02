<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { statsMonths, casesBySnake, severityDist, serumUsage, treatLeadTime } from '@/mock/analytics'
import type { EChartsOption } from 'echarts'

const casesOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  grid: { left: 36, right: 16, top: 16, bottom: 40 },
  xAxis: { type: 'category', data: statsMonths },
  yAxis: { type: 'value' },
  series: casesBySnake.map((s) => ({ name: s.name, type: 'bar', stack: 'total', data: s.data }))
}))

const severityOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, textStyle: { fontSize: 11 } },
  series: [{
    type: 'pie', radius: ['40%', '68%'],
    data: severityDist,
    color: ['#67c23a', '#e6a23c', '#f56c6c', '#c45656'],
    label: { fontSize: 11 }
  }]
}))

const serumOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 140, right: 30, top: 10, bottom: 24 },
  xAxis: { type: 'value' },
  yAxis: { type: 'category', data: serumUsage.map((s) => s.name) },
  series: [{
    type: 'bar', barWidth: 16, data: serumUsage.map((s) => s.value),
    label: { show: true, position: 'right' }, itemStyle: { color: '#5a4fcf' }
  }]
}))

const leadOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'category', data: statsMonths },
  yAxis: { type: 'value', name: '分钟' },
  series: [{
    type: 'line', smooth: true, data: treatLeadTime,
    areaStyle: { opacity: 0.15 }, itemStyle: { color: '#409eff' }
  }]
}))
</script>

<template>
  <div class="stats-page">
    <div class="page-head">
      <div>
        <h2>统计分析</h2>
        <p class="sub">蛇伤病例多维统计 · 数据来自专病库（脱敏）</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never" class="cc"><template #header><span class="bt">各蛇种月度病例（堆叠）</span></template>
          <BaseChart :option="casesOption" height="280px" />
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never" class="cc"><template #header><span class="bt">严重程度分布</span></template>
          <BaseChart :option="severityOption" height="280px" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never" class="cc"><template #header><span class="bt">血清消耗（支）</span></template>
          <BaseChart :option="serumOption" height="240px" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="cc"><template #header><span class="bt">平均救治时长趋势</span></template>
          <BaseChart :option="leadOption" height="240px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.cc { margin-bottom: 16px; }
.bt { font-weight: 600; }
</style>
