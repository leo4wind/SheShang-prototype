// 数据流转大屏 mock（P401）

// 流转图节点（ECharts graph）
export interface FlowNode {
  name: string
  category: number      // 0源 1网关 2通道 3存储 4消费
  value: number         // 今日吞吐量（条）
}

export const flowCategories = ['数据源', '边界网关', '冷热通道', '存储', '消费方']

export const flowNodes: FlowNode[] = [
  { name: '患者小程序', category: 0, value: 128 },
  { name: '120 出车', category: 0, value: 36 },
  { name: 'HIS', category: 0, value: 1820 },
  { name: 'LIS', category: 0, value: 942 },
  { name: 'PACS', category: 0, value: 213 },
  { name: '旧专病库', category: 0, value: 5600 },
  { name: '边界隔离网关', category: 1, value: 8739 },
  { name: '热通道', category: 2, value: 218 },
  { name: '冷通道', category: 2, value: 8521 },
  { name: '实时只读库', category: 3, value: 218 },
  { name: '专病库', category: 3, value: 8521 },
  { name: '对象存储 D2', category: 3, value: 1756 },
  { name: '急救接诊', category: 4, value: 54 },
  { name: 'MDT/共享', category: 4, value: 32 },
  { name: '随访陪护', category: 4, value: 88 },
  { name: '科研统计', category: 4, value: 12 }
]

export interface FlowLink { source: string; target: string }

export const flowLinks: FlowLink[] = [
  { source: '患者小程序', target: '边界隔离网关' },
  { source: '120 出车', target: '边界隔离网关' },
  { source: 'HIS', target: '边界隔离网关' },
  { source: 'LIS', target: '边界隔离网关' },
  { source: 'PACS', target: '边界隔离网关' },
  { source: '旧专病库', target: '边界隔离网关' },
  { source: '边界隔离网关', target: '热通道' },
  { source: '边界隔离网关', target: '冷通道' },
  { source: '热通道', target: '实时只读库' },
  { source: '冷通道', target: '专病库' },
  { source: '冷通道', target: '对象存储 D2' },
  { source: '实时只读库', target: '急救接诊' },
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
export const throughputHot = [4, 2, 6, 38, 52, 41, 48, 27]
export const throughputCold = [120, 80, 200, 1820, 942, 1530, 880, 2949]

// 通道健康
export const channelHealth = [
  { name: '热通道', latency: '0.8s', status: '正常', desc: '轻量清洗+脱敏→实时只读库' },
  { name: '冷通道', latency: '12min', status: '正常', desc: '完整治理→专病库' },
  { name: '边界网关', latency: '—', status: '正常', desc: '外网隔离，C 端不直连内网' }
]
