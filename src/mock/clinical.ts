// 临床判定 / 患者 360 mock（P204 蛇伤判定 + Agent，P214/P310 患者 360）

// ───── 蛇伤判定 Agent 建议（P204）─────
export interface AgentRanking {
  snakeId: string
  snakeName: string
  confidence: number       // 0-100
  basis: string            // 判定依据
}

export interface AgentDiagnosis {
  rankings: AgentRanking[]
  recommendedSerum: string
  recommendedDose: string
  riskAlerts: string[]
  reasoning: string[]      // Agent 推理链（原型展示）
}

// 演示用：竹叶青为主、蝮蛇次之
export const agentDiagnosis: AgentDiagnosis = {
  rankings: [
    { snakeId: 'sn-03', snakeName: '竹叶青', confidence: 72, basis: '伤口双牙痕 + 局部剧痛肿胀 + 绿色细长蛇 + 流行病学' },
    { snakeId: 'sn-05', snakeName: '蝮蛇', confidence: 18, basis: '局部肿胀相似，但体色描述不符' },
    { snakeId: 'sn-01', snakeName: '五步蛇', confidence: 7, basis: '凝血异常需警惕，但头型描述不符' }
  ],
  recommendedSerum: '抗蝮蛇毒血清',
  recommendedDose: '6000U 静脉滴注，必要时 6h 后追加',
  riskAlerts: ['患者对青霉素过敏，避免相关抗生素', '高血压病史，监测血压'],
  reasoning: [
    '图像识别：上传蛇照与竹叶青特征匹配度高（绿色、三角头、尾端偏红）',
    '症状匹配：以血液毒表现为主（局部剧痛、肿胀、渗血），与竹叶青/蝮蛇一致',
    '排除：无明显眼睑下垂/呼吸困难，神经毒类（银环蛇）概率低',
    '综合给出血清与剂量建议，最终由医生确认'
  ]
}

// ───── 患者 360 时间线（P214 / P310）─────
export type Patient360Kind = '急救' | '就诊' | '转诊' | 'MDT' | '随访' | '检验' | '用药'

export interface Patient360Event {
  time: string
  kind: Patient360Kind
  title: string
  detail: string
  source: string           // 数据来源终端/系统
}

// 以李德海（p-02，五步蛇重症）为主线，跨主线 1/3/4 的完整时间线
export const patient360: Record<string, Patient360Event[]> = {
  'p-02': [
    { time: '06-01 14:02', kind: '急救', title: '发起一键 SOS', detail: '青龙山林场北坡，右小腿咬伤', source: '患者小程序' },
    { time: '06-01 14:05', kind: '急救', title: '医生远程接诊并推送绷扎指引', detail: '王建华接诊', source: '医生端 PC' },
    { time: '06-01 14:30', kind: '就诊', title: '到院首次判定', detail: '五步蛇咬伤，凝血功能障碍', source: '医生端 PC' },
    { time: '06-01 15:10', kind: '用药', title: '抗五步蛇毒血清 8000U', detail: '静脉滴注，监测出凝血', source: 'HIS' },
    { time: '06-01 16:00', kind: '检验', title: '凝血四项危急值', detail: 'PT 延长，纤维蛋白原下降', source: 'LIS' },
    { time: '06-01 10:30', kind: 'MDT', title: '发起 MDT 会诊', detail: '是否血浆置换，邀请肾内/血液科', source: '医生端 PC' },
    { time: '06-03 09:00', kind: '随访', title: '出院随访计划生成', detail: '第 3/7/30/90/180/365 天', source: '陪护系统' }
  ],
  'p-01': [
    { time: '06-01 09:12', kind: '急救', title: '发起一键 SOS', detail: '竹叶青咬伤，右手', source: '患者小程序' },
    { time: '06-01 09:40', kind: '就诊', title: '到院判定竹叶青', detail: '抗蝮蛇毒血清 6000U', source: '医生端 PC' },
    { time: '06-04 10:00', kind: '随访', title: '出院第 3 天随访问卷', detail: '伤口好转，无发热', source: '陪护系统' }
  ]
}

export function getPatient360(id: string): Patient360Event[] {
  return patient360[id] ?? []
}
