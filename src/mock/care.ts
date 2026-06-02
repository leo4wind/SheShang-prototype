// 主线 4（健康陪护）mock 数据 + 类型

export interface FollowupNode {
  id: string
  dayOffset: number          // 出院后第几天
  label: string              // 节点名
  date: string               // 计划日期
  done: boolean
  actions: ('复查' | '随访问卷' | '知识推送')[]
}

export interface Medication {
  id: string
  name: string
  dose: string
  times: string[]            // 服药时间点
  note?: string
}

export interface RecheckItem {
  name: string
  desc: string
}

// 出院后随访计划节点（呼应 journey-4 阶段 A）
export const followupNodes: FollowupNode[] = [
  { id: 'f-3', dayOffset: 3, label: '出院后第 3 天', date: '2026-06-04', done: true, actions: ['随访问卷'] },
  { id: 'f-7', dayOffset: 7, label: '出院后第 7 天', date: '2026-06-08', done: false, actions: ['复查', '随访问卷', '知识推送'] },
  { id: 'f-30', dayOffset: 30, label: '出院后第 30 天', date: '2026-07-01', done: false, actions: ['复查', '随访问卷'] },
  { id: 'f-90', dayOffset: 90, label: '出院后第 90 天', date: '2026-08-30', done: false, actions: ['随访问卷'] },
  { id: 'f-180', dayOffset: 180, label: '出院后第 180 天', date: '2026-11-28', done: false, actions: ['复查'] },
  { id: 'f-365', dayOffset: 365, label: '出院后第 365 天', date: '2027-06-01', done: false, actions: ['复查', '随访问卷'] }
]

export const medications: Medication[] = [
  { id: 'm-01', name: '注射用血凝酶', dose: '1U', times: ['08:00'], note: '监测出血倾向' },
  { id: 'm-02', name: '头孢呋辛酯片', dose: '0.25g', times: ['08:00', '20:00'], note: '青霉素过敏者慎用，已换头孢' },
  { id: 'm-03', name: '破伤风抗毒素', dose: '1500U', times: ['一次性'], note: '已完成' }
]

export const recheckItems: RecheckItem[] = [
  { name: '凝血四项', desc: '观察 PT/APTT 恢复' },
  { name: '血常规', desc: '观察血小板' },
  { name: '肾功能', desc: '蛇毒可致肾损伤' },
  { name: '伤口换药', desc: '局部愈合情况' }
]

// 陪护对话的预置脚本（机器人提问 → 患者回答）
export interface ChatTurn {
  role: 'bot' | 'patient'
  text: string
  type?: 'text' | 'photo' | 'vital'
}

export const chatScript: ChatTurn[] = [
  { role: 'bot', text: '张先生您好，我是陪护助手。出院第 7 天了，今天伤口怎么样？方便拍张照吗？' }
]

// 机器人后续追问（按患者每次回答推进）
export const botFollowups: string[] = [
  '收到。有没有发热？方便说一下体温吗？',
  '好的。最近有没有头晕、乏力或者伤口周围麻木？',
  '了解了。我已记录今天的情况。如有呼吸困难、大面积肿胀请立即点击急救。',
  '感谢配合，本次陪护对话已完成，数据已同步给您的主治医生。'
]

// ───── 随访问卷（P113）─────
export interface SurveyQuestion {
  id: string
  text: string
  type: 'single' | 'scale' | 'text'
  options?: string[]        // single 用
}

export const surveyQuestions: SurveyQuestion[] = [
  { id: 'q1', text: '伤口愈合情况如何？', type: 'single', options: ['已基本愈合', '明显好转', '变化不大', '加重/渗液'] },
  { id: 'q2', text: '过去一周伤口疼痛评分（0 无痛 ~ 10 剧痛）', type: 'scale' },
  { id: 'q3', text: '是否按医嘱完成用药？', type: 'single', options: ['全部完成', '偶有漏服', '经常漏服', '已停药'] },
  { id: 'q4', text: '是否出现发热、头晕、乏力等不适？', type: 'single', options: ['无', '偶有', '经常'] },
  { id: 'q5', text: '其它想告诉医生的情况', type: 'text' }
]

// ───── 我的健康长期趋势（P117，喂给 ECharts）─────
export const healthTrendDates = ['出院', '第3天', '第7天', '第14天', '第30天', '第60天', '第90天']
export const woundHealing = [20, 40, 58, 72, 85, 94, 100]   // 伤口愈合 %
export const painScore = [6, 5, 4, 3, 2, 1, 0]              // 疼痛评分
export const adherenceTrend = [100, 92, 88, 90, 85, 80, 78] // 用药依从率 %

// ───── 打卡日历热力（P112）：日期 -> 完成度 0~4 ─────
export const calendarHeat: [string, number][] = [
  ['2026-06-01', 4], ['2026-06-02', 4], ['2026-06-03', 3], ['2026-06-04', 4],
  ['2026-06-05', 2], ['2026-06-06', 4], ['2026-06-07', 3], ['2026-06-08', 1],
  ['2026-06-09', 4], ['2026-06-10', 4], ['2026-06-11', 0], ['2026-06-12', 3]
]

// ───── 医患消息（P116 患者侧 / P217 医生侧，共享同一线程）─────
export interface CareMessage {
  from: 'patient' | 'doctor'
  text: string
  at: string
}

export const careMessageSeed: CareMessage[] = [
  { from: 'doctor', text: '张先生，出院后注意伤口换药，按时服用头孢。有不适随时联系我。', at: '06-03 10:20' },
  { from: 'patient', text: '王医生好，伤口这两天好多了，就是偶尔还有点痒。', at: '06-04 09:15' },
  { from: 'doctor', text: '痒是愈合的正常表现，别抓挠。第 7 天记得来复查凝血。', at: '06-04 09:40' }
]

// ───── 医生侧患者随访总览（P215 群组 / P216 用药情况）─────
export interface PatientCareRow {
  patientId: string
  name: string
  diagnosis: string
  adherence: number          // 用药依从率 %
  lastActive: string
  status: '依从良好' | '需关注' | '失访风险'
  nextFollowup: string
}

export const patientCareRows: PatientCareRow[] = [
  { patientId: 'p-02', name: '李德海', diagnosis: '五步蛇咬伤', adherence: 92, lastActive: '昨天', status: '依从良好', nextFollowup: '第 7 天复查' },
  { patientId: 'p-01', name: '张建国', diagnosis: '竹叶青咬伤', adherence: 78, lastActive: '今天', status: '依从良好', nextFollowup: '第 7 天复查' },
  { patientId: 'p-03', name: '赵秀兰', diagnosis: '竹叶青咬伤', adherence: 55, lastActive: '3 天前', status: '需关注', nextFollowup: '第 3 天问卷未交' },
  { patientId: 'p-08', name: '周国强', diagnosis: '银环蛇咬伤', adherence: 30, lastActive: '8 天前', status: '失访风险', nextFollowup: '需电话随访' }
]
