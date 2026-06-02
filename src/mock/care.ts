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
