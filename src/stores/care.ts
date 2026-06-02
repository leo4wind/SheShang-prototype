import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  medications, followupNodes, chatScript, botFollowups,
  surveyQuestions, careMessageSeed,
  type ChatTurn, type CareMessage
} from '@/mock/care'

// 主线 4 陪护状态：用药打卡 + 陪护对话
// 含 journey-4「系统约束」的演示：推送计数 + 频次控制提示

export type CheckinStatus = 'taken' | 'missed' | 'pending'

export const useCareStore = defineStore('care', () => {
  // 今日打卡状态：medId+time -> status
  const checkins = ref<Record<string, CheckinStatus>>({})

  function checkinKey(medId: string, time: string) {
    return `${medId}@${time}`
  }
  function setCheckin(medId: string, time: string, status: CheckinStatus) {
    checkins.value[checkinKey(medId, time)] = status
  }
  function getCheckin(medId: string, time: string): CheckinStatus {
    return checkins.value[checkinKey(medId, time)] ?? 'pending'
  }

  // 依从率：已服 / 总应服
  const adherence = computed(() => {
    let total = 0
    let taken = 0
    medications.forEach((m) => {
      m.times.forEach((t) => {
        if (t === '一次性') return
        total += 1
        if (getCheckin(m.id, t) === 'taken') taken += 1
      })
    })
    return total ? Math.round((taken / total) * 100) : 0
  })

  // ───── 陪护对话 ─────
  const chat = ref<ChatTurn[]>([...chatScript])
  const botStep = ref(0)
  const chatClosed = ref(false)

  function patientReply(text: string, type: ChatTurn['type'] = 'text') {
    if (chatClosed.value) return
    chat.value.push({ role: 'patient', text, type })
    // 机器人推进（受 botFollowups 长度限制 = 状态机不回环）
    if (botStep.value < botFollowups.length) {
      const reply = botFollowups[botStep.value]
      chat.value.push({ role: 'bot', text: reply })
      botStep.value += 1
      if (botStep.value >= botFollowups.length) chatClosed.value = true
    }
  }

  // ───── 随访节点 ─────
  const nodes = ref([...followupNodes])
  const nextNode = computed(() => nodes.value.find((n) => !n.done))
  const completedCount = computed(() => nodes.value.filter((n) => n.done).length)

  function completeNode(id: string) {
    const n = nodes.value.find((x) => x.id === id)
    if (n) n.done = true
  }

  // ───── 随访问卷（P113）─────
  const surveyAnswers = ref<Record<string, string | number>>({})
  const surveySubmitted = ref(false)
  function setAnswer(qid: string, val: string | number) {
    surveyAnswers.value[qid] = val
  }
  const surveyProgress = computed(() => {
    const answered = surveyQuestions.filter((q) => surveyAnswers.value[q.id] !== undefined && surveyAnswers.value[q.id] !== '').length
    return Math.round((answered / surveyQuestions.length) * 100)
  })
  function submitSurvey() {
    surveySubmitted.value = true
  }

  // ───── 医患消息（P116 / P217，共享线程）─────
  const messages = ref<CareMessage[]>([...careMessageSeed])
  function sendCareMessage(from: CareMessage['from'], text: string) {
    if (!text.trim()) return
    const at = new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    messages.value.push({ from, text, at })
  }

  return {
    checkins, setCheckin, getCheckin, adherence,
    chat, botStep, chatClosed, patientReply,
    nodes, nextNode, completedCount, completeNode,
    surveyAnswers, surveySubmitted, setAnswer, surveyProgress, submitSurvey,
    messages, sendCareMessage
  }
})
