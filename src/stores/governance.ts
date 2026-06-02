import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 质控质疑工单：跨终端协作
// 数据管理员在「质控工作台 / 质疑工单详情」(P308/P309) 发起质疑并锁定，
// 医生在「数据答疑」(P222) 回答。两端读写同一份 qcTickets。

export type QcTicketStatus = 'pending' | 'answered' | 'locked'

export const QC_STATUS_LABEL: Record<QcTicketStatus, string> = {
  pending: '待答疑',
  answered: '已答疑',
  locked: '已锁定'
}

export interface QcTicket {
  id: string
  patientCase: string
  field: string
  issue: string
  raisedBy: string
  raisedAt: string
  status: QcTicketStatus
  answer?: string
  answeredBy?: string
}

let seq = 3

export const useGovernanceStore = defineStore('governance', () => {
  const qcTickets = ref<QcTicket[]>([
    { id: 'QT-01', patientCase: 'C-2026-0298 李德海', field: '血清剂量', issue: '抗五步蛇毒血清 8000U 超过说明书单次上限，请确认是否分次给药。', raisedBy: '张数据（质控）', raisedAt: '09:10', status: 'pending' },
    { id: 'QT-02', patientCase: 'C-2026-0312 张建国', field: '蛇种判定', issue: '图像识别为竹叶青，但凝血轻度异常，是否需复核诊断？', raisedBy: '张数据（质控）', raisedAt: '昨天', status: 'answered', answer: '已复核，竹叶青咬伤可伴轻度凝血异常，诊断不变。', answeredBy: '王建华' },
    { id: 'QT-03', patientCase: 'C-2026-0277 周国强', field: '转归记录', issue: '转院记录缺少接收医院反馈，请补充。', raisedBy: '李质控', raisedAt: '2 天前', status: 'locked', answer: '已补充市第一医院反馈，结案。', answeredBy: '王建华' }
  ])

  function getTicket(id: string) {
    return qcTickets.value.find((t) => t.id === id)
  }
  function raiseQuery(data: Omit<QcTicket, 'id' | 'status' | 'raisedAt'>) {
    seq += 1
    qcTickets.value.unshift({
      ...data,
      id: `QT-0${seq}`,
      status: 'pending',
      raisedAt: '刚刚'
    })
  }
  function answerQuery(id: string, answer: string, by = '王建华') {
    const t = getTicket(id)
    if (t) { t.answer = answer; t.answeredBy = by; t.status = 'answered' }
  }
  function lockQuery(id: string) {
    const t = getTicket(id)
    if (t && t.status === 'answered') t.status = 'locked'
  }

  const pendingCount = computed(() => qcTickets.value.filter((t) => t.status === 'pending').length)

  return { qcTickets, getTicket, raiseQuery, answerQuery, lockQuery, pendingCount, QC_STATUS_LABEL }
})
