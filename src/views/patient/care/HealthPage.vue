<script setup lang="ts">
import { computed } from 'vue'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import BaseChart from '@/components/BaseChart.vue'
import { healthTrendDates, woundHealing, painScore, adherenceTrend } from '@/mock/care'
import type { EChartsOption } from 'echarts'

const option = computed<EChartsOption>(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['伤口愈合 %', '疼痛评分', '依从率 %'], bottom: 0, textStyle: { fontSize: 11 }, itemWidth: 14 },
  grid: { left: 36, right: 12, top: 20, bottom: 44 },
  xAxis: { type: 'category', data: healthTrendDates, axisLabel: { fontSize: 10 } },
  yAxis: [
    { type: 'value', max: 100, axisLabel: { fontSize: 10 } },
    { type: 'value', max: 10, show: false }
  ],
  series: [
    { name: '伤口愈合 %', type: 'line', smooth: true, data: woundHealing, itemStyle: { color: '#67c23a' }, areaStyle: { opacity: 0.1 } },
    { name: '疼痛评分', type: 'line', smooth: true, yAxisIndex: 1, data: painScore, itemStyle: { color: '#f56c6c' } },
    { name: '依从率 %', type: 'line', smooth: true, data: adherenceTrend, itemStyle: { color: '#409eff' } }
  ]
}))

const latest = {
  wound: woundHealing[woundHealing.length - 1],
  pain: painScore[painScore.length - 1],
  adh: adherenceTrend[adherenceTrend.length - 1]
}
</script>

<template>
  <div class="health-page">
    <PhoneNavBar title="我的健康" back="/patient/care/timeline" />
    <div class="body">
      <div class="cards">
        <div class="hc green"><div class="n">{{ latest.wound }}%</div><div class="l">伤口愈合</div></div>
        <div class="hc red"><div class="n">{{ latest.pain }}</div><div class="l">疼痛评分</div></div>
        <div class="hc blue"><div class="n">{{ latest.adh }}%</div><div class="l">用药依从</div></div>
      </div>

      <div class="card">
        <div class="card-title">康复趋势（出院后 90 天）</div>
        <BaseChart :option="option" height="260px" />
      </div>

      <el-alert
        type="success" :closable="false" show-icon
        title="恢复良好"
        description="伤口已基本愈合、疼痛消失。继续保持随访，第 180 天复查凝血与肾功能。"
      />
    </div>
  </div>
</template>

<style scoped>
.health-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.cards { display: flex; gap: 10px; }
.hc { flex: 1; border-radius: 10px; padding: 14px 6px; text-align: center; color: #fff; }
.hc.green { background: linear-gradient(135deg, #67c23a, #529b2e); }
.hc.red { background: linear-gradient(135deg, #f56c6c, #e53935); }
.hc.blue { background: linear-gradient(135deg, #409eff, #337ecc); }
.hc .n { font-size: 22px; font-weight: 700; }
.hc .l { font-size: 12px; opacity: 0.9; margin-top: 4px; }
.card { background: #fff; border-radius: 10px; padding: 14px; }
.card-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
</style>
