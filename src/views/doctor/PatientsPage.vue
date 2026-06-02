<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import BaseChart from '@/components/BaseChart.vue'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { patientCareRows, type PatientCareRow } from '@/mock/care'
import type { EChartsOption } from 'echarts'

const router = useRouter()

const groups: { key: PatientCareRow['status']; color: string }[] = [
  { key: '依从良好', color: '#67c23a' },
  { key: '需关注', color: '#e6a23c' },
  { key: '失访风险', color: '#f56c6c' }
]
function rows(status: PatientCareRow['status']) {
  return patientCareRows.filter((r) => r.status === status)
}

const option = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 60, right: 16, top: 16, bottom: 24 },
  xAxis: { type: 'value', max: 100, axisLabel: { formatter: '{value}%' } },
  yAxis: { type: 'category', data: patientCareRows.map((r) => r.name) },
  series: [{
    type: 'bar',
    data: patientCareRows.map((r) => ({
      value: r.adherence,
      itemStyle: { color: r.adherence >= 70 ? '#67c23a' : r.adherence >= 50 ? '#e6a23c' : '#f56c6c' }
    })),
    label: { show: true, position: 'right', formatter: '{c}%' },
    barWidth: 18
  }]
}))

function open(id: string) {
  router.push(`/doctor/patient360/${id}`)
}
</script>

<template>
  <div class="patients-page">
    <div class="page-head">
      <div>
        <h2>我的患者（群组视图）</h2>
        <p class="sub">按随访依从情况分组，及时干预失访风险</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6" v-for="g in groups" :key="g.key">
        <div class="stat" :style="{ borderTopColor: g.color }">
          <div class="n" :style="{ color: g.color }">{{ rows(g.key).length }}</div>
          <div class="l">{{ g.key }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat" style="border-top-color:#409eff">
          <div class="n" style="color:#409eff">{{ patientCareRows.length }}</div>
          <div class="l">在管患者</div>
        </div>
      </el-col>
    </el-row>

    <el-card shadow="never" class="chart-card">
      <template #header><span class="ct">用药依从率分布</span></template>
      <BaseChart :option="option" height="200px" />
    </el-card>

    <div class="groups">
      <div v-for="g in groups" :key="g.key" class="group">
        <div class="g-title"><span class="dot" :style="{ background: g.color }" />{{ g.key }}（{{ rows(g.key).length }}）</div>
        <div class="cards">
          <div v-for="r in rows(g.key)" :key="r.patientId" class="pcard" @click="open(r.patientId)">
            <div class="pc-top">
              <b>{{ r.name }}</b>
              <span class="adh" :style="{ color: g.color }">{{ r.adherence }}%</span>
            </div>
            <div class="pc-diag">{{ r.diagnosis }}</div>
            <div class="pc-meta">最近活跃 {{ r.lastActive }} · {{ r.nextFollowup }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.stat-row { margin-bottom: 16px; }
.stat { background: #fff; border-radius: 8px; border-top: 3px solid; padding: 16px; text-align: center; }
.stat .n { font-size: 26px; font-weight: 700; }
.stat .l { font-size: 13px; color: #909399; margin-top: 4px; }
.chart-card { margin-bottom: 16px; }
.ct { font-weight: 600; }
.groups { display: flex; flex-direction: column; gap: 16px; }
.g-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.pcard { background: #fff; border-radius: 8px; padding: 14px; cursor: pointer; transition: box-shadow .2s; }
.pcard:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
.pc-top { display: flex; justify-content: space-between; align-items: center; }
.pc-top b { font-size: 15px; }
.adh { font-weight: 700; }
.pc-diag { font-size: 13px; color: #606266; margin: 4px 0; }
.pc-meta { font-size: 12px; color: #c0c4cc; }
</style>
