// 数据治理 mock（P304/305 清洗、P306 脱敏、P307 映射、P308/309 质控、P313 CRF）

// ───── 清洗任务（P304/P305）─────
export interface CleaningTask {
  id: string
  source: string
  inputRows: number
  outputRows: number
  dropped: number
  status: '已完成' | '运行中' | '失败'
  finishedAt: string
  rules: string[]
}

export const cleaningTasks: CleaningTask[] = [
  { id: 'cl-01', source: 'HIS 病案/医嘱', inputRows: 1820, outputRows: 1786, dropped: 34, status: '已完成', finishedAt: '08:30', rules: ['去重', '空值填充', '单位标准化', '日期归一'] },
  { id: 'cl-02', source: 'LIS 化验结果', inputRows: 942, outputRows: 940, dropped: 2, status: '已完成', finishedAt: '08:42', rules: ['异常值过滤', '单位标准化'] },
  { id: 'cl-03', source: '旧专病库迁移', inputRows: 5600, outputRows: 5320, dropped: 280, status: '运行中', finishedAt: '—', rules: ['编码转换', '字段映射', '去重'] },
  { id: 'cl-04', source: '患者小程序上报', inputRows: 128, outputRows: 128, dropped: 0, status: '已完成', finishedAt: '刚刚', rules: ['格式校验'] }
]

export function getCleaningTask(id: string): CleaningTask | undefined {
  return cleaningTasks.find((t) => t.id === id)
}

// 清洗前后对比样例
export interface CleaningDiff {
  field: string
  before: string
  after: string
  rule: string
}

export const cleaningSample: CleaningDiff[] = [
  { field: '咬伤时间', before: '2019/7/11 上午', after: '2019-07-11 09:00', rule: '日期归一' },
  { field: '蛇种', before: '青竹蛇', after: '竹叶青', rule: '字段映射（字典）' },
  { field: '血清用量', before: '6000', after: '6000 U', rule: '单位标准化' },
  { field: '住址', before: '幸福路128号  ', after: '幸福路128号', rule: '空白裁剪' },
  { field: '联系电话', before: '(空)', after: '—', rule: '空值填充' }
]

// ───── 脱敏规则（P306）─────
export interface DesensitizeRule {
  id: string
  field: string
  method: string
  before: string
  after: string
  enabled: boolean
}

export const desensitizeRules: DesensitizeRule[] = [
  { id: 'ds-01', field: '姓名', method: '保留姓 + 掩码', before: '张建国', after: '张**', enabled: true },
  { id: 'ds-02', field: '身份证号', method: '保留前6后4', before: '360702197901011234', after: '360702********1234', enabled: true },
  { id: 'ds-03', field: '手机号', method: '中间掩码', before: '13812346621', after: '138****6621', enabled: true },
  { id: 'ds-04', field: '住址', method: '保留到区县', before: '幸福路128号3栋', after: '幸福路***', enabled: true },
  { id: 'ds-05', field: '就诊卡号', method: '哈希替换', before: 'H20260601023', after: 'a8f3…e21', enabled: false }
]

// ───── 映射工作台（P307）─────
export interface MappingExtract {
  field: string
  value: string
  mappedTo: string
  confidence: number
  status: '已确认' | '待确认'
}

export const mappingFreeText =
  '患者男性，47岁，2小时前于野外被一条绿色细长蛇（疑似青竹蛇）咬伤右下肢，局部红肿剧痛，伤口可见两个牙痕，无明显呼吸困难。'

export const mappingExtracts: MappingExtract[] = [
  { field: '蛇种', value: '青竹蛇', mappedTo: '竹叶青（sn-03）', confidence: 88, status: '待确认' },
  { field: '咬伤部位', value: '右下肢', mappedTo: '下肢-右', confidence: 95, status: '已确认' },
  { field: '咬伤时长', value: '2小时', mappedTo: '120 分钟', confidence: 92, status: '已确认' },
  { field: '主要症状', value: '局部红肿剧痛', mappedTo: '局部肿胀;疼痛', confidence: 90, status: '已确认' },
  { field: '神经毒征象', value: '无呼吸困难', mappedTo: '神经毒=否', confidence: 70, status: '待确认' }
]

// ───── 质控批次概览（P308）─────
export interface QcReport {
  id: string
  batch: string
  total: number
  passed: number
  failed: number
}

export const qcReports: QcReport[] = [
  { id: 'qc-b-01', batch: '2026-06-02 入库批次', total: 120, passed: 112, failed: 8 },
  { id: 'qc-b-02', batch: '2026-06-01 入库批次', total: 156, passed: 151, failed: 5 },
  { id: 'qc-b-03', batch: '旧库迁移批次', total: 5600, passed: 5320, failed: 280 }
]

// ───── 科研 CRF（P313）─────
export interface CrfField {
  label: string
  value: string
  type?: 'text' | 'select'
}
export interface CrfSection {
  title: string
  fields: CrfField[]
}

export const crfSections: CrfSection[] = [
  { title: '基本信息', fields: [
    { label: '病例编号', value: 'C-2026-0312' },
    { label: '性别', value: '男' },
    { label: '年龄', value: '47' },
    { label: '入院日期', value: '2026-06-01' }
  ]},
  { title: '蛇伤信息', fields: [
    { label: '蛇种', value: '竹叶青', type: 'select' },
    { label: '咬伤部位', value: '右下肢' },
    { label: '咬伤至就诊(min)', value: '120' },
    { label: '严重程度', value: '中', type: 'select' }
  ]},
  { title: '治疗与实验室', fields: [
    { label: '血清名称', value: '抗蝮蛇毒血清' },
    { label: '血清用量', value: '6000U' },
    { label: 'PT(s)', value: '15.2' },
    { label: '血小板(10^9/L)', value: '180' }
  ]},
  { title: '转归', fields: [
    { label: '住院天数', value: '4' },
    { label: '转归', value: '治愈', type: 'select' },
    { label: '随访状态', value: '随访中' }
  ]}
]
