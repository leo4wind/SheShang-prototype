import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 主线 3 协作状态：转诊 / MDT / 共享患者
// 当前登录医生（演示固定为王建华）
export const CURRENT_DOCTOR = { id: 'd-01', name: '王建华', hospitalId: 'h-01' }

// ───── 转诊 ─────
export type ReferralStatus = 'pending' | 'accepted' | 'rejected' | 'transferring' | 'arrived'

export const REFERRAL_STATUS_LABEL: Record<ReferralStatus, string> = {
  pending: '待接收方确认',
  accepted: '已接受',
  rejected: '已拒绝',
  transferring: '转运中',
  arrived: '已到达'
}

export interface Referral {
  id: string
  patientId: string
  patientName: string
  fromDoctor: string
  toHospitalId: string
  toHospitalName: string
  reason: string
  urgency: '一般' | '紧急' | '危急'
  transport: string
  snapshot: string         // 患者现况快照
  status: ReferralStatus
  createdAt: string
}

// ───── MDT ─────
export type MdtStatus = 'inviting' | 'confirmed' | 'ongoing' | 'closed'

export const MDT_STATUS_LABEL: Record<MdtStatus, string> = {
  inviting: '邀请中',
  confirmed: '已确认',
  ongoing: '会诊中',
  closed: '已结束'
}

export interface MdtInvitee {
  doctorId: string
  name: string
  specialty: string
  reply: 'pending' | 'accepted' | 'rejected'
}

export interface Mdt {
  id: string
  patientId: string
  patientName: string
  host: string
  topic: string
  scheduledAt: string
  invitees: MdtInvitee[]
  status: MdtStatus
  conclusion?: string
  createdAt: string
}

// ───── 共享患者 ─────
export interface Share {
  id: string
  patientId: string
  patientName: string
  fromDoctor: string
  toDoctorId: string
  toDoctorName: string
  scope: '基础信息' | '完整资料'
  expireAt: string
  createdAt: string
}

function now(): string {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

let refSeq = 30
let mdtSeq = 20
let shareSeq = 10

export const useCollabStore = defineStore('collab', () => {
  // 预置数据：让收件箱 / 跟踪页一打开就有内容
  const referrals = ref<Referral[]>([
    {
      id: 'RF-031',
      patientId: 'p-08',
      patientName: '周国强',
      fromDoctor: '孙倩',
      toHospitalId: 'h-04',
      toHospitalName: '市第一医院',
      reason: '银环蛇咬伤，神经毒症状明显，需呼吸支持与专科血清',
      urgency: '危急',
      transport: '120 救护车',
      snapshot: '危重 · 呼吸浅快 · 已气管插管准备',
      status: 'pending',
      createdAt: '09:12'
    }
  ])

  const mdts = ref<Mdt[]>([
    {
      id: 'MDT-021',
      patientId: 'p-02',
      patientName: '李德海',
      host: '王建华',
      topic: '五步蛇咬伤致凝血功能障碍，是否需血浆置换',
      scheduledAt: '今天 16:00',
      invitees: [
        { doctorId: 'd-03', name: '陈志远', specialty: '肾内科', reply: 'accepted' },
        { doctorId: 'd-04', name: '刘海燕', specialty: '血液科', reply: 'pending' }
      ],
      status: 'inviting',
      createdAt: '10:30'
    }
  ])

  const shares = ref<Share[]>([
    {
      id: 'SH-011',
      patientId: 'p-03',
      patientName: '赵秀兰',
      fromDoctor: '李文博',
      toDoctorId: 'd-01',
      toDoctorName: '王建华',
      scope: '完整资料',
      expireAt: '2026-06-08',
      createdAt: '昨天'
    }
  ])

  // ───── 转诊操作 ─────
  function createReferral(data: Omit<Referral, 'id' | 'status' | 'createdAt' | 'fromDoctor'>): Referral {
    refSeq += 1
    const r: Referral = {
      ...data,
      id: `RF-${refSeq}`,
      fromDoctor: CURRENT_DOCTOR.name,
      status: 'pending',
      createdAt: now()
    }
    referrals.value.unshift(r)
    return r
  }
  function getReferral(id: string) {
    return referrals.value.find((r) => r.id === id)
  }
  function setReferralStatus(id: string, status: ReferralStatus) {
    const r = getReferral(id)
    if (r) r.status = status
  }

  // 收件箱：发给当前医生所在医院的待处理转诊
  const inboxReferrals = computed(() =>
    referrals.value.filter((r) => r.toHospitalId === CURRENT_DOCTOR.hospitalId || r.status === 'pending')
  )

  // ───── MDT 操作 ─────
  function createMdt(data: Omit<Mdt, 'id' | 'status' | 'createdAt' | 'host'>): Mdt {
    mdtSeq += 1
    const m: Mdt = {
      ...data,
      id: `MDT-${mdtSeq}`,
      host: CURRENT_DOCTOR.name,
      status: 'inviting',
      createdAt: now()
    }
    mdts.value.unshift(m)
    return m
  }
  function getMdt(id: string) {
    return mdts.value.find((m) => m.id === id)
  }
  function replyMdt(id: string, doctorId: string, reply: 'accepted' | 'rejected') {
    const m = getMdt(id)
    const inv = m?.invitees.find((i) => i.doctorId === doctorId)
    if (inv) inv.reply = reply
    if (m && m.invitees.every((i) => i.reply === 'accepted')) m.status = 'confirmed'
  }
  function setMdtStatus(id: string, status: MdtStatus) {
    const m = getMdt(id)
    if (m) m.status = status
  }
  function saveMdtConclusion(id: string, conclusion: string) {
    const m = getMdt(id)
    if (m) {
      m.conclusion = conclusion
      m.status = 'closed'
    }
  }

  // ───── 共享操作 ─────
  function createShare(data: Omit<Share, 'id' | 'createdAt' | 'fromDoctor'>): Share {
    shareSeq += 1
    const s: Share = {
      ...data,
      id: `SH-${shareSeq}`,
      fromDoctor: CURRENT_DOCTOR.name,
      createdAt: now()
    }
    shares.value.unshift(s)
    return s
  }
  // 共享给当前医生的患者
  const sharedToMe = computed(() =>
    shares.value.filter((s) => s.toDoctorId === CURRENT_DOCTOR.id)
  )

  // 收件箱总数（转诊 + MDT 邀请 + 共享）
  const inboxCount = computed(() =>
    inboxReferrals.value.filter((r) => r.status === 'pending').length +
    mdts.value.filter((m) => m.invitees.some((i) => i.doctorId === CURRENT_DOCTOR.id && i.reply === 'pending')).length +
    sharedToMe.value.length
  )

  return {
    referrals, mdts, shares,
    createReferral, getReferral, setReferralStatus, inboxReferrals,
    createMdt, getMdt, replyMdt, setMdtStatus, saveMdtConclusion,
    createShare, sharedToMe, inboxCount
  }
})
