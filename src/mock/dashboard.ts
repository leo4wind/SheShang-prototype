// 数据流转大屏 mock（P401）

// 流转图节点（ECharts sankey）
export interface FlowNode {
  name: string
  category: number      // 0源 1边界 2统一接入 3存储 4消费
  value: number         // 今日吞吐量（条）
}

export const flowCategories = ['数据源', '内外网边界', '统一接入', '存储', '消费方']

export const flowNodes: FlowNode[] = [
  { name: '患者小程序', category: 0, value: 128 },
  { name: '120 出车', category: 0, value: 36 },
  { name: 'HIS', category: 0, value: 1820 },
  { name: 'LIS', category: 0, value: 942 },
  { name: 'PACS', category: 0, value: 213 },
  { name: '旧专病库', category: 0, value: 5600 },
  { name: '外网应用接口', category: 1, value: 128 },
  { name: '内网统一接入', category: 2, value: 8739 },
  { name: '专病库', category: 3, value: 8739 },
  { name: '对象存储 D2', category: 3, value: 1756 },
  { name: '急救接诊', category: 4, value: 54 },
  { name: 'MDT/共享', category: 4, value: 32 },
  { name: '随访陪护', category: 4, value: 88 },
  { name: '科研统计', category: 4, value: 12 }
]

export interface FlowLink { source: string; target: string }

export const flowLinks: FlowLink[] = [
  { source: '患者小程序', target: '外网应用接口' },
  { source: '外网应用接口', target: '内网统一接入' },
  { source: '120 出车', target: '内网统一接入' },
  { source: 'HIS', target: '内网统一接入' },
  { source: 'LIS', target: '内网统一接入' },
  { source: 'PACS', target: '内网统一接入' },
  { source: '旧专病库', target: '内网统一接入' },
  { source: '内网统一接入', target: '专病库' },
  { source: '内网统一接入', target: '对象存储 D2' },
  { source: '专病库', target: '急救接诊' },
  { source: '对象存储 D2', target: '急救接诊' },
  { source: '专病库', target: 'MDT/共享' },
  { source: '专病库', target: '随访陪护' },
  { source: '专病库', target: '科研统计' },
  { source: '对象存储 D2', target: '科研统计' }
]

// 实时指标卡
export interface Metric { label: string; value: number; unit: string; trend: number }
export const realtimeMetrics: Metric[] = [
  { label: '今日求救', value: 18, unit: '起', trend: 12 },
  { label: '接诊完成', value: 54, unit: '人次', trend: 8 },
  { label: '入库记录', value: 8739, unit: '条', trend: 5 },
  { label: '质控通过率', value: 96, unit: '%', trend: 2 }
]

// 24h 接入吞吐（折线）
export const throughputHours = ['00', '03', '06', '09', '12', '15', '18', '21']
export const throughputUnified = [124, 82, 206, 1858, 994, 1571, 928, 2976]

// 链路健康
export const pipelineHealth = [
  { name: '外网应用接口', latency: '待技术确认', status: '占位', desc: '患者小程序不直连内网，接口/隔离方案待确认' },
  { name: '内网统一接入', latency: '12min', status: '正常', desc: '统一同步进入专病库，统一口径展示接入进度' },
  { name: '前端展示脱敏', latency: '—', status: '正常', desc: '后端保留复核能力，页面展示做脱敏处理' }
]
