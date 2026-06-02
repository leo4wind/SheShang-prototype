<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { storageBuckets } from '@/mock/analytics'
import type { EChartsOption } from 'echarts'

const totalSize = computed(() => storageBuckets.reduce((a, b) => a + b.sizeGB, 0))
const totalCount = computed(() => storageBuckets.reduce((a, b) => a + b.count, 0))
const structuredSize = computed(() =>
  storageBuckets.filter((b) => b.kind === '结构化').reduce((a, b) => a + b.sizeGB, 0)
)

const pieOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} GB ({d}%)' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie', radius: ['45%', '70%'],
    data: storageBuckets.map((b) => ({ name: b.name, value: b.sizeGB })),
    label: { fontSize: 11 }
  }]
}))

const barOption = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 120, right: 30, top: 10, bottom: 24 },
  xAxis: { type: 'value', name: '近7日增长%' },
  yAxis: { type: 'category', data: storageBuckets.map((b) => b.name) },
  series: [{
    type: 'bar', barWidth: 16,
    data: storageBuckets.map((b) => b.growth7d),
    label: { show: true, position: 'right', formatter: '{c}%' },
    itemStyle: { color: '#409eff' }
  }]
}))
</script>

<template>
  <div class="storage-page">
    <div class="page-head">
      <div>
        <h2>数据落库总览</h2>
        <p class="sub">专病库分桶存储概览 · 结构化与非结构化（D2 对象存储）分离</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6"><div class="stat"><div class="n">{{ totalCount.toLocaleString() }}</div><div class="l">总记录数</div></div></el-col>
      <el-col :span="6"><div class="stat"><div class="n">{{ totalSize.toFixed(1) }} GB</div><div class="l">总存储</div></div></el-col>
      <el-col :span="6"><div class="stat"><div class="n">{{ structuredSize.toFixed(1) }} GB</div><div class="l">结构化</div></div></el-col>
      <el-col :span="6"><div class="stat"><div class="n">{{ (totalSize - structuredSize).toFixed(1) }} GB</div><div class="l">非结构化 D2</div></div></el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="10">
        <el-card shadow="never"><template #header><span class="bt">存储占比（按容量）</span></template>
          <BaseChart :option="pieOption" height="260px" />
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-card shadow="never"><template #header><span class="bt">近 7 日增长</span></template>
          <BaseChart :option="barOption" height="260px" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never" class="table-card">
      <el-table :data="storageBuckets" style="width:100%">
        <el-table-column prop="name" label="数据桶" min-width="180" />
        <el-table-column label="类型" width="110">
          <template #default="{ row }">
            <el-tag size="small" :type="row.kind === '结构化' ? 'success' : 'warning'" effect="plain">{{ row.kind }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="记录数" width="120">
          <template #default="{ row }">{{ row.count.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="sizeGB" label="容量(GB)" width="110" />
        <el-table-column prop="growth7d" label="7日增长" width="100">
          <template #default="{ row }">{{ row.growth7d }}%</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.stat-row { margin-bottom: 16px; }
.stat { background: #fff; border-radius: 8px; padding: 16px; text-align: center; }
.stat .n { font-size: 22px; font-weight: 700; color: #409eff; }
.stat .l { font-size: 13px; color: #909399; margin-top: 4px; }
.bt { font-weight: 600; }
.table-card { margin-top: 16px; }
</style>
