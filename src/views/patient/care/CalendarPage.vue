<script setup lang="ts">
import { computed } from 'vue'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import BaseChart from '@/components/BaseChart.vue'
import { calendarHeat } from '@/mock/care'
import type { EChartsOption } from 'echarts'

const done = calendarHeat.filter((d) => d[1] > 0).length
const total = calendarHeat.length
const rate = Math.round((done / total) * 100)

const option = computed<EChartsOption>(() => ({
  tooltip: { formatter: (p: any) => `${p.value[0]}<br/>完成度 ${p.value[1]}/4` },
  visualMap: {
    min: 0, max: 4, type: 'piecewise', orient: 'horizontal',
    left: 'center', bottom: 0, itemWidth: 11, itemHeight: 11, itemGap: 6,
    pieces: [
      { value: 0, label: '未', color: '#ebedf0' },
      { value: 1, label: '差', color: '#c6e48b' },
      { value: 2, label: '中', color: '#7bc96f' },
      { value: 3, label: '良', color: '#239a3b' },
      { value: 4, label: '优', color: '#196127' }
    ],
    textStyle: { fontSize: 10 }
  },
  calendar: {
    top: 20, left: 24, right: 12, cellSize: ['auto', 26], range: '2026-06',
    itemStyle: { borderWidth: 2, borderColor: '#fff' },
    yearLabel: { show: false }, monthLabel: { show: false },
    dayLabel: { nameMap: 'cn', fontSize: 10 }
  },
  series: { type: 'heatmap', coordinateSystem: 'calendar', data: calendarHeat }
}))
</script>

<template>
  <div class="cal-page">
    <PhoneNavBar title="打卡日历" back="/patient/care/checkin" />
    <div class="body">
      <div class="summary">
        <div class="s-item"><div class="n">{{ done }}</div><div class="l">已打卡天数</div></div>
        <div class="s-item"><div class="n">{{ rate }}%</div><div class="l">坚持率</div></div>
        <div class="s-item"><div class="n">{{ total - done }}</div><div class="l">缺卡</div></div>
      </div>

      <div class="card">
        <div class="card-title">本月打卡热力</div>
        <BaseChart :option="option" height="240px" />
      </div>

      <el-alert
        type="success" :closable="false" show-icon
        title="坚持就是胜利"
        description="连续打卡可获得康复积分，缺卡当天系统会推送提醒（频次受控，每日最多 1 次）。"
      />
    </div>
  </div>
</template>

<style scoped>
.cal-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.summary { background: #fff; border-radius: 10px; padding: 16px; display: flex; }
.s-item { flex: 1; text-align: center; }
.s-item .n { font-size: 22px; font-weight: 700; color: #67c23a; }
.s-item .l { font-size: 12px; color: #909399; margin-top: 4px; }
.card { background: #fff; border-radius: 10px; padding: 14px; }
.card-title { font-size: 14px; font-weight: 600; margin-bottom: 8px; }
</style>
