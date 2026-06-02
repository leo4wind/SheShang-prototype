<script setup lang="ts">
import { computed } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import {
  flowNodes, flowLinks, realtimeMetrics,
  throughputHours, throughputHot, throughputCold, channelHealth
} from '@/mock/dashboard'
import type { EChartsOption } from 'echarts'

const catColor = ['#5b8ff9', '#f6bd16', '#ff7c7c', '#5ad8a6', '#945fb9']

function linkVal(target: string) {
  const v = flowNodes.find((n) => n.name === target)?.value ?? 80
  return Math.max(80, Math.min(v, 1500))
}

const sankeyOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'item', triggerOn: 'mousemove' },
  series: [{
    type: 'sankey',
    left: 8, right: 110, top: 10, bottom: 10,
    nodeWidth: 14, nodeGap: 10,
    data: flowNodes.map((n) => ({ name: n.name, itemStyle: { color: catColor[n.category], borderColor: 'transparent' } })),
    links: flowLinks.map((l) => ({ source: l.source, target: l.target, value: linkVal(l.target) })),
    lineStyle: { color: 'gradient', opacity: 0.35 },
    label: { color: '#dbe7ff', fontSize: 11 },
    emphasis: { focus: 'adjacency' }
  }]
}))

const throughputOption = computed<EChartsOption>(() => ({
  backgroundColor: 'transparent',
  tooltip: { trigger: 'axis' },
  legend: { data: ['热通道', '冷通道'], textStyle: { color: '#9db4d8' }, top: 0 },
  grid: { left: 44, right: 16, top: 30, bottom: 24 },
  xAxis: { type: 'category', data: throughputHours, axisLabel: { color: '#9db4d8' }, axisLine: { lineStyle: { color: '#2c4a7a' } } },
  yAxis: { type: 'value', axisLabel: { color: '#9db4d8' }, splitLine: { lineStyle: { color: '#13294d' } } },
  series: [
    { name: '热通道', type: 'line', smooth: true, data: throughputHot, itemStyle: { color: '#ff7c7c' } },
    { name: '冷通道', type: 'line', smooth: true, data: throughputCold, itemStyle: { color: '#5b8ff9' }, areaStyle: { opacity: 0.12 } }
  ]
}))
</script>

<template>
  <div class="dash">
    <div class="dash-head">
      <h2>蛇伤专病库 · 数据流转大屏</h2>
      <span class="live"><i class="dot" /> 实时 · {{ new Date().toLocaleDateString('zh-CN') }}</span>
    </div>

    <div class="metrics">
      <div class="metric" v-for="m in realtimeMetrics" :key="m.label">
        <div class="m-val">{{ m.value }}<span class="m-unit">{{ m.unit }}</span></div>
        <div class="m-label">{{ m.label }}</div>
        <div class="m-trend" :class="{ up: m.trend > 0 }">▲ {{ m.trend }}%</div>
      </div>
    </div>

    <div class="panel flow-panel">
      <div class="p-title">数据流转（源 → 边界网关 → 冷热通道 → 存储 → 消费）</div>
      <BaseChart :option="sankeyOption" height="340px" />
    </div>

    <div class="bottom">
      <div class="panel">
        <div class="p-title">24h 接入吞吐</div>
        <BaseChart :option="throughputOption" height="220px" />
      </div>
      <div class="panel">
        <div class="p-title">通道健康</div>
        <div class="ch-list">
          <div class="ch" v-for="c in channelHealth" :key="c.name">
            <div class="ch-top">
              <span class="ch-name">{{ c.name }}</span>
              <span class="ch-status">{{ c.status }}</span>
            </div>
            <div class="ch-desc">{{ c.desc }}</div>
            <div class="ch-lat">延迟 {{ c.latency }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash { background: #0a1b3d; border-radius: 12px; padding: 20px; color: #dbe7ff; min-height: 600px; }
.dash-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.dash-head h2 { margin: 0; font-size: 22px; letter-spacing: 2px; background: linear-gradient(90deg, #5b8ff9, #5ad8a6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.live { font-size: 13px; color: #9db4d8; display: flex; align-items: center; gap: 6px; }
.live .dot { width: 8px; height: 8px; border-radius: 50%; background: #5ad8a6; display: inline-block; box-shadow: 0 0 8px #5ad8a6; }

.metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 16px; }
.metric { background: linear-gradient(135deg, rgba(91,143,249,0.15), rgba(91,143,249,0.04)); border: 1px solid #1f3a66; border-radius: 8px; padding: 16px; }
.m-val { font-size: 30px; font-weight: 700; color: #fff; }
.m-unit { font-size: 13px; color: #9db4d8; margin-left: 4px; }
.m-label { font-size: 13px; color: #9db4d8; margin-top: 4px; }
.m-trend { font-size: 12px; color: #5ad8a6; margin-top: 6px; }

.panel { background: rgba(16,35,70,0.6); border: 1px solid #1f3a66; border-radius: 8px; padding: 14px; margin-bottom: 16px; }
.p-title { font-size: 14px; font-weight: 600; color: #cbd9f5; margin-bottom: 8px; }
.bottom { display: grid; grid-template-columns: 3fr 2fr; gap: 16px; }
.bottom .panel { margin-bottom: 0; }
.ch-list { display: flex; flex-direction: column; gap: 10px; }
.ch { background: rgba(91,143,249,0.08); border-radius: 6px; padding: 10px 12px; }
.ch-top { display: flex; justify-content: space-between; }
.ch-name { font-weight: 600; }
.ch-status { color: #5ad8a6; font-size: 12px; }
.ch-desc { font-size: 12px; color: #9db4d8; margin: 4px 0; }
.ch-lat { font-size: 12px; color: #cbd9f5; }
</style>
