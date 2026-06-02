// 专病库数据治理 / 统计分析 mock（P302/P303/P311/P312）

// ───── 同步异常详情（P302）─────
export interface IngestError {
  id: string
  source: string
  occurredAt: string
  type: string
  message: string
  stack: string[]
  payload: string
  retryCount: number
  status: '待处理' | '重试中' | '已解决'
}

export const ingestErrors: IngestError[] = [
  {
    id: 'ie-01', source: '旧专病库迁移', occurredAt: '2026-06-02 08:14',
    type: '字段映射失败', message: '源字段 snake_kind 无法映射到标准字典 snake_type_id',
    stack: [
      'at MappingPipeline.map (mapping.ts:142)',
      'at DictResolver.resolve (dict.ts:58)',
      'throw new UnmappedValueError("青竹蛇")'
    ],
    payload: '{ "patient_id": "old-88231", "snake_kind": "青竹蛇", "bite_time": "2019/07/11" }',
    retryCount: 3, status: '待处理'
  },
  {
    id: 'ie-02', source: 'HIS（病案/医嘱）', occurredAt: '2026-06-02 09:02',
    type: '脱敏校验未通过', message: '身份证号字段未按规则脱敏，已拦截入库',
    stack: ['at DesensitizeGate.check (desensitize.ts:77)', 'throw new SensitiveLeakError("id_card")'],
    payload: '{ "name": "**", "id_card": "3607...（明文）", "visit_no": "H2026..." }',
    retryCount: 1, status: '重试中'
  }
]

// ───── 数据落库总览（P303）─────
export interface StorageBucket {
  name: string
  kind: '结构化' | '非结构化'
  count: number
  sizeGB: number
  growth7d: number      // 近 7 日增长 %
}

export const storageBuckets: StorageBucket[] = [
  { name: '患者主索引', kind: '结构化', count: 12840, sizeGB: 0.6, growth7d: 2.1 },
  { name: '就诊/诊断记录', kind: '结构化', count: 38600, sizeGB: 3.2, growth7d: 4.5 },
  { name: '化验/检验结果', kind: '结构化', count: 91200, sizeGB: 7.8, growth7d: 5.2 },
  { name: '伤口/蛇照片（D2）', kind: '非结构化', count: 6420, sizeGB: 42.5, growth7d: 8.7 },
  { name: '语音/录音（D2）', kind: '非结构化', count: 2180, sizeGB: 11.3, growth7d: 6.0 },
  { name: 'PACS 影像（D2）', kind: '非结构化', count: 1530, sizeGB: 88.9, growth7d: 3.4 }
]

// ───── 统计分析（P312，喂给 ECharts）─────
export const statsMonths = ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月']

// 各蛇种月度病例（堆叠柱）
export const casesBySnake = [
  { name: '竹叶青', data: [12, 9, 15, 22, 31, 18] },
  { name: '五步蛇', data: [4, 3, 6, 8, 11, 7] },
  { name: '蝮蛇', data: [8, 6, 10, 13, 17, 10] },
  { name: '银环蛇', data: [1, 0, 2, 3, 4, 2] }
]

// 严重程度分布（饼）
export const severityDist = [
  { name: '轻', value: 142 },
  { name: '中', value: 86 },
  { name: '重', value: 38 },
  { name: '危重', value: 11 }
]

// 血清消耗（柱）
export const serumUsage = [
  { name: '抗蝮蛇毒血清', value: 320 },
  { name: '抗五步蛇毒血清', value: 96 },
  { name: '抗银环蛇毒血清', value: 28 },
  { name: '抗眼镜蛇毒血清', value: 41 }
]

// 平均救治时长趋势（折线，分钟）
export const treatLeadTime = [186, 172, 165, 150, 138, 129]

// ───── 多维查询导出（P311）─────
export interface QueryDimension {
  key: string
  label: string
  options: string[]
}

export const queryDimensions: QueryDimension[] = [
  { key: 'snake', label: '蛇种', options: ['竹叶青', '五步蛇', '蝮蛇', '银环蛇', '眼镜蛇'] },
  { key: 'severity', label: '严重程度', options: ['轻', '中', '重', '危重'] },
  { key: 'hospital', label: '收治医院', options: ['县人民医院', '中医院', '市第一医院'] },
  { key: 'outcome', label: '转归', options: ['治愈', '好转', '转院', '死亡'] },
  { key: 'year', label: '年份', options: ['2024', '2025', '2026'] }
]

export interface QueryResultRow {
  caseId: string
  snake: string
  severity: string
  hospital: string
  outcome: string
  los: number          // 住院天数
}

export const queryResults: QueryResultRow[] = [
  { caseId: 'C-2026-0312', snake: '竹叶青', severity: '中', hospital: '县人民医院', outcome: '治愈', los: 4 },
  { caseId: 'C-2026-0298', snake: '五步蛇', severity: '重', hospital: '市第一医院', outcome: '好转', los: 9 },
  { caseId: 'C-2026-0277', snake: '银环蛇', severity: '危重', hospital: '市第一医院', outcome: '转院', los: 12 },
  { caseId: 'C-2026-0261', snake: '蝮蛇', severity: '轻', hospital: '中医院', outcome: '治愈', los: 3 },
  { caseId: 'C-2026-0240', snake: '竹叶青', severity: '中', hospital: '县人民医院', outcome: '治愈', los: 5 }
]
