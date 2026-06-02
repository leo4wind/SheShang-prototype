<script setup lang="ts">
// ECharts 包装组件：按需注册图表类型，页面只需传 option
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart, RadarChart, HeatmapChart, SankeyChart } from 'echarts/charts'
import {
  GridComponent, TooltipComponent, LegendComponent,
  TitleComponent, VisualMapComponent, CalendarComponent, PolarComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

use([
  CanvasRenderer,
  LineChart, BarChart, PieChart, RadarChart, HeatmapChart, SankeyChart,
  GridComponent, TooltipComponent, LegendComponent,
  TitleComponent, VisualMapComponent, CalendarComponent, PolarComponent
])

defineProps<{ option: EChartsOption; height?: string }>()
</script>

<template>
  <v-chart class="base-chart" :option="option" autoresize :style="{ height: height || '300px' }" />
</template>

<style scoped>
.base-chart { width: 100%; }
</style>
