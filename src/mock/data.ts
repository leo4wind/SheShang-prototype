// 主线 1（蛇伤急救）静态 mock 数据
// 所有数据仅供原型演示，不代表真实医疗信息

export interface SnakeType {
  id: string
  name: string
  venomous: boolean
  serumName: string       // 对应抗蛇毒血清
  dangerLevel: 1 | 2 | 3  // 危险等级
}

export interface Hospital {
  id: string
  name: string
  level: string           // 三甲 / 二甲
  distanceKm: number
  etaMin: number          // 预计到达分钟
  hasQualification: boolean // 蛇伤救治资质
  address: string
  phone: string
  // 血清库存：snakeTypeId -> 支数
  serumStock: Record<string, number>
}

export interface Patient {
  id: string
  name: string
  gender: '男' | '女'
  age: number
  phone: string
  emergencyContact: string
  emergencyPhone: string
  // 既往史（从专病库拉，原型 mock）
  pastHistory: string[]
  allergy: string[]
  bloodType: string
}

export interface SelfRescueTemplate {
  id: string
  title: string
  steps: string[]
  warning?: string
}

// ───── 蛇种字典 ─────
export const snakeTypes: SnakeType[] = [
  { id: 'sn-01', name: '五步蛇（尖吻蝮）', venomous: true, serumName: '抗五步蛇毒血清', dangerLevel: 3 },
  { id: 'sn-02', name: '银环蛇', venomous: true, serumName: '抗银环蛇毒血清', dangerLevel: 3 },
  { id: 'sn-03', name: '竹叶青', venomous: true, serumName: '抗蝮蛇毒血清', dangerLevel: 2 },
  { id: 'sn-04', name: '眼镜蛇', venomous: true, serumName: '抗眼镜蛇毒血清', dangerLevel: 3 },
  { id: 'sn-05', name: '蝮蛇', venomous: true, serumName: '抗蝮蛇毒血清', dangerLevel: 2 },
  { id: 'sn-99', name: '无毒蛇 / 不确定', venomous: false, serumName: '—', dangerLevel: 1 }
]

export function getSnake(id: string): SnakeType | undefined {
  return snakeTypes.find((s) => s.id === id)
}

// ───── 医院 ─────
export const hospitals: Hospital[] = [
  {
    id: 'h-01',
    name: '县人民医院',
    level: '三甲',
    distanceKm: 8.2,
    etaMin: 18,
    hasQualification: true,
    address: '幸福路 128 号',
    phone: '0790-1234567',
    serumStock: { 'sn-01': 6, 'sn-03': 4, 'sn-05': 8, 'sn-04': 2 }
  },
  {
    id: 'h-02',
    name: '中医院',
    level: '二甲',
    distanceKm: 5.6,
    etaMin: 12,
    hasQualification: true,
    address: '建设中路 56 号',
    phone: '0790-7654321',
    serumStock: { 'sn-03': 3, 'sn-05': 2, 'sn-01': 0 }
  },
  {
    id: 'h-03',
    name: '镇卫生院',
    level: '一级',
    distanceKm: 2.1,
    etaMin: 6,
    hasQualification: false,
    address: '镇前街 9 号',
    phone: '0790-2223333',
    serumStock: {}
  },
  {
    id: 'h-04',
    name: '市第一医院',
    level: '三甲',
    distanceKm: 23.5,
    etaMin: 42,
    hasQualification: true,
    address: '人民大道 1 号',
    phone: '0790-8889999',
    serumStock: { 'sn-01': 10, 'sn-02': 5, 'sn-03': 8, 'sn-04': 6, 'sn-05': 12 }
  }
]

export function getHospital(id: string): Hospital | undefined {
  return hospitals.find((h) => h.id === id)
}

// ───── 当前演示患者 ─────
export const currentPatient: Patient = {
  id: 'p-01',
  name: '张建国',
  gender: '男',
  age: 47,
  phone: '138****6621',
  emergencyContact: '张小梅（女儿）',
  emergencyPhone: '139****8830',
  pastHistory: ['高血压 3 年', '2023 年曾被竹叶青咬伤一次'],
  allergy: ['青霉素'],
  bloodType: 'B 型'
}

// ───── 自救指引模板（医生推送给患者）─────
export const selfRescueTemplates: SelfRescueTemplate[] = [
  {
    id: 'rg-01',
    title: '绷扎制动（毒蛇咬伤通用）',
    steps: [
      '保持冷静，立即停止活动，减少毒液扩散',
      '在伤口近心端 5-10cm 处用绷带或布条加压绷扎',
      '每 15-20 分钟松解 1-2 分钟，避免肢体坏死',
      '保持伤肢低于心脏水平',
      '记住咬伤时间，等待救援'
    ],
    warning: '切勿奔跑、饮酒、用嘴吸毒、切开伤口'
  },
  {
    id: 'rg-02',
    title: '伤口处理',
    steps: [
      '用清水或生理盐水冲洗伤口',
      '去除伤口附近的戒指、手表等束缚物',
      '保持伤口清洁，避免污染',
      '不要自行用药'
    ]
  },
  {
    id: 'rg-03',
    title: '生命体征观察',
    steps: [
      '观察是否出现呼吸困难、视物模糊',
      '观察伤口肿胀范围是否扩大',
      '如出现意识模糊立即电话告知医生',
      '保持通讯畅通'
    ],
    warning: '出现呼吸困难提示神经毒，需立即就医'
  }
]

// ───── 医生通讯录（转诊路由 / MDT 邀请 / 共享对象）─────
export interface Doctor {
  id: string
  name: string
  title: string          // 职称
  hospitalId: string
  specialty: string      // 专科
  phone: string
  isExpert: boolean      // 是否专家（可参与 MDT）
}

export const doctors: Doctor[] = [
  { id: 'd-01', name: '王建华', title: '主治医师', hospitalId: 'h-01', specialty: '急诊科', phone: '138****1001', isExpert: false },
  { id: 'd-02', name: '李文博', title: '副主任医师', hospitalId: 'h-04', specialty: '毒蛇咬伤专科', phone: '138****1002', isExpert: true },
  { id: 'd-03', name: '陈志远', title: '主任医师', hospitalId: 'h-04', specialty: '肾内科', phone: '138****1003', isExpert: true },
  { id: 'd-04', name: '刘海燕', title: '主任医师', hospitalId: 'h-04', specialty: '血液科', phone: '138****1004', isExpert: true },
  { id: 'd-05', name: '赵明', title: '主治医师', hospitalId: 'h-02', specialty: '急诊科', phone: '138****1005', isExpert: false },
  { id: 'd-06', name: '孙倩', title: '副主任医师', hospitalId: 'h-01', specialty: '重症医学科', phone: '138****1006', isExpert: true }
]

export function getDoctor(id: string): Doctor | undefined {
  return doctors.find((d) => d.id === id)
}

// ───── 角色与权限（P402）─────
export interface RoleDef {
  key: string
  name: string
  userCount: number
  menus: string[]        // 可访问的终端组
  dataScope: string      // 数据权限
}

export const roleDefs: RoleDef[] = [
  { key: 'doctor', name: '接诊医生', userCount: 12, menus: ['医生端 PC', '医生端 APP'], dataScope: '本院患者' },
  { key: 'expert', name: '多中心专家', userCount: 5, menus: ['医生端 PC', '医生端 APP'], dataScope: '受邀/共享患者' },
  { key: 'data-admin', name: '数据管理员', userCount: 3, menus: ['内网端'], dataScope: '全部（脱敏）' },
  { key: 'researcher', name: '科研人员', userCount: 4, menus: ['内网端'], dataScope: '全部（脱敏，只读）' },
  { key: 'sys-admin', name: '系统管理员', userCount: 2, menus: ['内网端', '系统能力'], dataScope: '全部' }
]

export interface UserRow {
  id: string
  name: string
  role: string           // roleDef.key
  hospital: string
  status: '在职' | '停用'
}

export const userRows: UserRow[] = [
  { id: 'u-01', name: '王建华', role: 'doctor', hospital: '县人民医院', status: '在职' },
  { id: 'u-02', name: '李文博', role: 'expert', hospital: '市第一医院', status: '在职' },
  { id: 'u-03', name: '陈志远', role: 'expert', hospital: '市第一医院', status: '在职' },
  { id: 'u-04', name: '张数据', role: 'data-admin', hospital: '专病库中心', status: '在职' },
  { id: 'u-05', name: '周科研', role: 'researcher', hospital: '专病库中心', status: '在职' },
  { id: 'u-06', name: '管理员', role: 'sys-admin', hospital: '专病库中心', status: '在职' },
  { id: 'u-07', name: '赵明', role: 'doctor', hospital: '中医院', status: '停用' }
]

// ───── 可共享 / 转诊的患者（来自专病库，含主线 1 的患者）─────
export interface PatientBrief {
  id: string
  name: string
  gender: '男' | '女'
  age: number
  diagnosis: string      // 蛇种诊断
  severity: '轻' | '中' | '重' | '危重'
  admitDate: string
}

export const patientBriefs: PatientBrief[] = [
  { id: 'p-01', name: '张建国', gender: '男', age: 47, diagnosis: '竹叶青咬伤', severity: '中', admitDate: '2026-06-01' },
  { id: 'p-02', name: '李德海', gender: '男', age: 55, diagnosis: '五步蛇咬伤', severity: '重', admitDate: '2026-06-01' },
  { id: 'p-03', name: '赵秀兰', gender: '女', age: 38, diagnosis: '竹叶青咬伤', severity: '轻', admitDate: '2026-06-01' },
  { id: 'p-08', name: '周国强', gender: '男', age: 62, diagnosis: '银环蛇咬伤', severity: '危重', admitDate: '2026-05-30' }
]

export function getPatientBrief(id: string): PatientBrief | undefined {
  return patientBriefs.find((p) => p.id === id)
}
