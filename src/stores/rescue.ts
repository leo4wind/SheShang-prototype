import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { currentPatient, type SelfRescueTemplate } from '@/mock/data'

// 求救事件状态机（对应 journey-1 的阶段 A-E）
// 只能向下走：求救 → 选定医院 → 已上报 → 医生已接 → 已到院 → 治疗中 → 已出院
export type RescueStatus =
  | 'sos'          // 已发起求救
  | 'hospital'     // 已选定医院
  | 'reported'     // 已上报现场信息
  | 'accepted'     // 医生已接诊（远程）
  | 'arrived'      // 已到院
  | 'treating'     // 治疗中
  | 'discharged'   // 已出院

export const STATUS_FLOW: RescueStatus[] = [
  'sos', 'hospital', 'reported', 'accepted', 'arrived', 'treating', 'discharged'
]

export const STATUS_LABEL: Record<RescueStatus, string> = {
  sos: '已发起求救',
  hospital: '已选定医院',
  reported: '已上报现场',
  accepted: '医生已接诊',
  arrived: '已到院',
  treating: '治疗中',
  discharged: '已出院'
}

export interface FieldReport {
  symptoms: string         // 当前症状（口述）
  selfRescue: string       // 已采取的自救措施
  bittenTime: string       // 咬伤时间
  snakeDescription: string // 蛇的描述
  hasPhoto: boolean        // 是否上传了照片（原型用占位）
  voiceSeconds: number     // 语音时长（原型用占位）
}

export interface PushedGuide {
  templateId: string
  title: string
  pushedAt: string
}

export interface VisitRecord {
  snakeJudgment: string    // 最终蛇种判定
  serumName: string        // 使用血清
  serumDose: string        // 用量
  treatment: string        // 其它处置
  doctorName: string
  recordedAt: string
}

export interface RescueEvent {
  id: string
  patientId: string
  patientName: string
  status: RescueStatus
  createdAt: string
  location: string
  selectedHospitalId?: string
  report?: FieldReport
  pushedGuides: PushedGuide[]
  assignedDoctor?: string
  visitRecord?: VisitRecord
  // 标记是否为"当前演示患者"正在进行的事件（患者端操作的对象）
  isCurrent?: boolean
}

function now(): string {
  return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

let seq = 100

export const useRescueStore = defineStore('rescue', () => {
  // 预置事件：让医生端「救助工作台」一打开就有数据看
  const events = ref<RescueEvent[]>([
    {
      id: 'EV-098',
      patientId: 'p-02',
      patientName: '李德海',
      status: 'accepted',
      createdAt: '14:02',
      location: '青龙山林场北坡',
      selectedHospitalId: 'h-01',
      report: {
        symptoms: '右小腿剧痛、肿胀，伤口两个牙印渗血',
        selfRescue: '已用鞋带在膝盖下方绷扎',
        bittenTime: '13:50 左右',
        snakeDescription: '土黄色，三角头，约 1 米',
        hasPhoto: true,
        voiceSeconds: 12
      },
      pushedGuides: [
        { templateId: 'rg-01', title: '绷扎制动（毒蛇咬伤通用）', pushedAt: '14:05' }
      ],
      assignedDoctor: '王医生',
      isCurrent: false
    },
    {
      id: 'EV-097',
      patientId: 'p-03',
      patientName: '赵秀兰',
      status: 'treating',
      createdAt: '11:20',
      location: '后山竹林',
      selectedHospitalId: 'h-04',
      report: {
        symptoms: '左手食指麻木，轻微头晕',
        selfRescue: '清水冲洗',
        bittenTime: '11:05',
        snakeDescription: '绿色细长，尾巴偏红',
        hasPhoto: true,
        voiceSeconds: 8
      },
      pushedGuides: [
        { templateId: 'rg-01', title: '绷扎制动（毒蛇咬伤通用）', pushedAt: '11:24' },
        { templateId: 'rg-03', title: '生命体征观察', pushedAt: '11:40' }
      ],
      assignedDoctor: '王医生',
      visitRecord: {
        snakeJudgment: '竹叶青',
        serumName: '抗蝮蛇毒血清',
        serumDose: '6000U 静滴',
        treatment: '局部清创、破伤风抗毒素、留观 24h',
        doctorName: '王医生',
        recordedAt: '11:55'
      },
      isCurrent: false
    }
  ])

  // 当前演示患者正在进行的事件（患者端读写的对象）
  const currentEventId = ref<string | null>(null)

  const currentEvent = computed(() =>
    events.value.find((e) => e.id === currentEventId.value) ?? null
  )

  // 医生工作台：待处理（未到 discharged）的事件，最新在前
  const activeEvents = computed(() =>
    events.value
      .filter((e) => e.status !== 'discharged')
      .slice()
      .reverse()
  )

  function getEvent(id: string): RescueEvent | undefined {
    return events.value.find((e) => e.id === id)
  }

  // 患者端：发起求救 → 创建当前事件
  function startSos(location: string): RescueEvent {
    seq += 1
    const ev: RescueEvent = {
      id: `EV-${seq}`,
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      status: 'sos',
      createdAt: now(),
      location,
      pushedGuides: [],
      isCurrent: true
    }
    // 清掉旧的 current 标记
    events.value.forEach((e) => (e.isCurrent = false))
    events.value.push(ev)
    currentEventId.value = ev.id
    return ev
  }

  // 推进状态（只能向前）
  function advance(id: string, to: RescueStatus) {
    const ev = getEvent(id)
    if (!ev) return
    const fromIdx = STATUS_FLOW.indexOf(ev.status)
    const toIdx = STATUS_FLOW.indexOf(to)
    if (toIdx > fromIdx) ev.status = to
  }

  function selectHospital(id: string, hospitalId: string) {
    const ev = getEvent(id)
    if (!ev) return
    ev.selectedHospitalId = hospitalId
    advance(id, 'hospital')
  }

  function submitReport(id: string, report: FieldReport) {
    const ev = getEvent(id)
    if (!ev) return
    ev.report = report
    advance(id, 'reported')
  }

  function acceptByDoctor(id: string, doctor: string) {
    const ev = getEvent(id)
    if (!ev) return
    ev.assignedDoctor = doctor
    advance(id, 'accepted')
  }

  function pushGuide(id: string, tpl: SelfRescueTemplate) {
    const ev = getEvent(id)
    if (!ev) return
    if (ev.pushedGuides.some((g) => g.templateId === tpl.id)) return
    ev.pushedGuides.push({ templateId: tpl.id, title: tpl.title, pushedAt: now() })
  }

  function markArrived(id: string) {
    advance(id, 'arrived')
  }

  function saveVisitRecord(id: string, record: VisitRecord) {
    const ev = getEvent(id)
    if (!ev) return
    ev.visitRecord = record
    advance(id, 'treating')
  }

  function discharge(id: string) {
    advance(id, 'discharged')
  }

  return {
    events,
    currentEventId,
    currentEvent,
    activeEvents,
    getEvent,
    startSos,
    advance,
    selectHospital,
    submitReport,
    acceptByDoctor,
    pushGuide,
    markArrived,
    saveVisitRecord,
    discharge
  }
})
