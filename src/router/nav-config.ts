// 菜单 + 路由的单一来源
// 修改这个文件 = 同时修改菜单和路由表

export type Priority = 'v1' | 'v2' | 'v3'
export type Shell = 'phone' | 'pc'

export interface NavLeaf {
  id: string          // P101
  title: string       // 求救首页（一键SOS）
  routePath: string   // /patient/sos 或 /patient/waiting/:id
  menuPath: string    // /patient/sos（菜单点击实际跳转，含 demo 参数）
  view: string        // 'patient/SosPage' 对应 src/views/patient/SosPage.vue
  priority: Priority
  shell: Shell
  journey: string     // 'J1' | 'J1+J4' | ''
  type: string        // 工作台/列表/详情/表单/看板
}

export interface NavSubGroup {
  title: string
  children: NavLeaf[]
}

export interface NavGroup {
  key: string         // 'patient' | 'doctor' | ...
  title: string
  icon: string        // Element Plus icon 名
  children: NavSubGroup[]
}

export const navTree: NavGroup[] = [
  {
    key: 'patient',
    title: '患者端（小程序）',
    icon: 'Iphone',
    children: [
      {
        title: '入口',
        children: [
          { id: 'P119', title: '登录', routePath: '/patient/login', menuPath: '/patient/login', view: 'patient/LoginPage', priority: 'v1', shell: 'phone', journey: '', type: '表单' },
          { id: 'P118', title: '首页', routePath: '/patient/home', menuPath: '/patient/home', view: 'patient/HomePage', priority: 'v1', shell: 'phone', journey: '', type: '工作台' }
        ]
      },
      {
        title: '应急求救',
        children: [
          { id: 'P101', title: '求救首页（一键SOS）', routePath: '/patient/sos', menuPath: '/patient/sos', view: 'patient/SosPage', priority: 'v1', shell: 'phone', journey: 'J1', type: '工作台' },
          { id: 'P102', title: '就近医院列表', routePath: '/patient/hospitals', menuPath: '/patient/hospitals', view: 'patient/HospitalsPage', priority: 'v1', shell: 'phone', journey: 'J1', type: '列表' },
          { id: 'P103', title: '自救等待页', routePath: '/patient/waiting/:id', menuPath: '/patient/waiting/demo', view: 'patient/WaitingPage', priority: 'v1', shell: 'phone', journey: 'J1', type: '详情' },
          { id: 'P104', title: '现场信息上报', routePath: '/patient/report', menuPath: '/patient/report', view: 'patient/ReportPage', priority: 'v1', shell: 'phone', journey: 'J1', type: '表单' },
          { id: 'P105', title: '就诊二维码', routePath: '/patient/qrcode/:id', menuPath: '/patient/qrcode/demo', view: 'patient/QrcodePage', priority: 'v1', shell: 'phone', journey: 'J1', type: '详情' },
          { id: 'P106', title: '弱网兜底', routePath: '/patient/fallback', menuPath: '/patient/fallback', view: 'patient/FallbackPage', priority: 'v1', shell: 'phone', journey: 'J1', type: '详情' }
        ]
      },
      {
        title: '我的就诊',
        children: [
          { id: 'P107', title: '就诊历史', routePath: '/patient/visits', menuPath: '/patient/visits', view: 'patient/VisitsPage', priority: 'v1', shell: 'phone', journey: 'J1+J4', type: '列表' }
        ]
      },
      {
        title: '健康陪护',
        children: [
          { id: 'P108', title: '我的随访计划', routePath: '/patient/care/timeline', menuPath: '/patient/care/timeline', view: 'patient/care/TimelinePage', priority: 'v1', shell: 'phone', journey: 'J4', type: '详情' },
          { id: 'P109', title: '复查详情', routePath: '/patient/care/recheck/:id', menuPath: '/patient/care/recheck/demo', view: 'patient/care/RecheckPage', priority: 'v1', shell: 'phone', journey: 'J4', type: '详情' },
          { id: 'P110', title: '用药打卡', routePath: '/patient/care/checkin', menuPath: '/patient/care/checkin', view: 'patient/care/CheckinPage', priority: 'v1', shell: 'phone', journey: 'J4', type: '工作台' },
          { id: 'P111', title: '陪护对话', routePath: '/patient/care/chat', menuPath: '/patient/care/chat', view: 'patient/care/ChatPage', priority: 'v1', shell: 'phone', journey: 'J4', type: '工作台' },
          { id: 'P112', title: '打卡日历', routePath: '/patient/care/calendar', menuPath: '/patient/care/calendar', view: 'patient/care/CalendarPage', priority: 'v2', shell: 'phone', journey: 'J4', type: '详情' },
          { id: 'P113', title: '随访问卷', routePath: '/patient/care/survey/:id', menuPath: '/patient/care/survey/demo', view: 'patient/care/SurveyPage', priority: 'v2', shell: 'phone', journey: 'J4', type: '表单' },
          { id: 'P114', title: '知识中心', routePath: '/patient/care/knowledge', menuPath: '/patient/care/knowledge', view: 'patient/care/KnowledgePage', priority: 'v2', shell: 'phone', journey: 'J4', type: '列表' },
          { id: 'P115', title: '知识详情', routePath: '/patient/care/knowledge/:id', menuPath: '/patient/care/knowledge/k-01', view: 'patient/care/KnowledgeDetailPage', priority: 'v2', shell: 'phone', journey: 'J4', type: '详情' },
          { id: 'P116', title: '我的医生（消息）', routePath: '/patient/care/doctor-chat', menuPath: '/patient/care/doctor-chat', view: 'patient/care/DoctorChatPage', priority: 'v2', shell: 'phone', journey: 'J4', type: '工作台' },
          { id: 'P117', title: '我的健康（趋势）', routePath: '/patient/care/health', menuPath: '/patient/care/health', view: 'patient/care/HealthPage', priority: 'v2', shell: 'phone', journey: 'J4', type: '看板' }
        ]
      }
    ]
  },
  {
    key: 'doctor',
    title: '医生端 PC',
    icon: 'Monitor',
    children: [
      {
        title: '救助',
        children: [
          { id: 'P201', title: '救助工作台', routePath: '/doctor/rescue', menuPath: '/doctor/rescue', view: 'doctor/RescuePage', priority: 'v1', shell: 'pc', journey: 'J1', type: '看板' },
          { id: 'P202', title: '患者实时视图', routePath: '/doctor/patient-realtime/:id', menuPath: '/doctor/patient-realtime/demo', view: 'doctor/PatientRealtimePage', priority: 'v1', shell: 'pc', journey: 'J1', type: '详情' },
          { id: 'P203', title: '自救指引推送', routePath: '/doctor/rescue-guide', menuPath: '/doctor/rescue-guide', view: 'doctor/RescueGuidePage', priority: 'v1', shell: 'pc', journey: 'J1', type: '表单' },
          { id: 'P205-PC', title: '就诊记录', routePath: '/doctor/visit-record/:id', menuPath: '/doctor/visit-record/demo', view: 'doctor/VisitRecordPage', priority: 'v1', shell: 'pc', journey: 'J1', type: '表单' },
          { id: 'P204', title: '蛇伤判定（Agent）', routePath: '/doctor/diagnosis/:id', menuPath: '/doctor/diagnosis/demo', view: 'doctor/DiagnosisPage', priority: 'v2', shell: 'pc', journey: 'J1+J3', type: '详情+表单' },
          { id: 'P223', title: '历史判定复盘', routePath: '/doctor/diagnosis/history', menuPath: '/doctor/diagnosis/history', view: 'doctor/DiagnosisHistoryPage', priority: 'v3', shell: 'pc', journey: 'J3', type: '列表' }
        ]
      },
      {
        title: '多中心分诊',
        children: [
          { id: 'P206', title: '转诊申请', routePath: '/doctor/referral/new', menuPath: '/doctor/referral/new', view: 'doctor/ReferralNewPage', priority: 'v1', shell: 'pc', journey: 'J3', type: '表单' },
          { id: 'P208', title: '转诊跟踪', routePath: '/doctor/referral/:id', menuPath: '/doctor/referral/demo', view: 'doctor/ReferralPage', priority: 'v1', shell: 'pc', journey: 'J3', type: '详情' },
          { id: 'P209', title: 'MDT 邀请', routePath: '/doctor/mdt/new', menuPath: '/doctor/mdt/new', view: 'doctor/MdtNewPage', priority: 'v1', shell: 'pc', journey: 'J3', type: '表单' },
          { id: 'P211-PC', title: 'MDT 会诊室', routePath: '/doctor/mdt/room/:id', menuPath: '/doctor/mdt/room/demo', view: 'doctor/MdtRoomPage', priority: 'v1', shell: 'pc', journey: 'J3', type: '工作台' },
          { id: 'P212', title: '共享患者', routePath: '/doctor/share', menuPath: '/doctor/share', view: 'doctor/SharePage', priority: 'v1', shell: 'pc', journey: 'J3', type: '表单' },
          { id: 'P213-PC', title: '共享给我的患者', routePath: '/doctor/shared', menuPath: '/doctor/shared', view: 'doctor/SharedPage', priority: 'v1', shell: 'pc', journey: 'J3', type: '列表' },
          { id: 'P214', title: '患者 360', routePath: '/doctor/patient360/:id', menuPath: '/doctor/patient360/p-02', view: 'doctor/Patient360Page', priority: 'v2', shell: 'pc', journey: 'J3', type: '详情' }
        ]
      },
      {
        title: '患者管理',
        children: [
          { id: 'P215', title: '我的患者（群组）', routePath: '/doctor/patients', menuPath: '/doctor/patients', view: 'doctor/PatientsPage', priority: 'v2', shell: 'pc', journey: 'J4', type: '看板' },
          { id: 'P218', title: '随访计划管理', routePath: '/doctor/followup/plans', menuPath: '/doctor/followup/plans', view: 'doctor/FollowupPlansPage', priority: 'v2', shell: 'pc', journey: 'J4', type: '列表+表单' }
        ]
      },
      {
        title: '培训',
        children: [
          { id: 'P219', title: '培训中心', routePath: '/doctor/training', menuPath: '/doctor/training', view: 'doctor/TrainingPage', priority: 'v2', shell: 'pc', journey: 'J3', type: '列表' },
          { id: 'P220', title: '培训管理', routePath: '/doctor/training/manage', menuPath: '/doctor/training/manage', view: 'doctor/TrainingManagePage', priority: 'v2', shell: 'pc', journey: 'J3', type: '列表+表单' }
        ]
      },
      {
        title: '数据协作',
        children: [
          { id: 'P222', title: '数据答疑', routePath: '/doctor/answer', menuPath: '/doctor/answer', view: 'doctor/AnswerPage', priority: 'v3', shell: 'pc', journey: 'J2', type: '列表+表单' }
        ]
      }
    ]
  },
  {
    key: 'doctor-app',
    title: '医生端 APP',
    icon: 'CellPhone',
    children: [
      {
        title: '通讯',
        children: [
          { id: 'P221', title: '收件箱', routePath: '/doctor-app/inbox', menuPath: '/doctor-app/inbox', view: 'doctor-app/InboxPage', priority: 'v1', shell: 'phone', journey: 'J3', type: '列表' }
        ]
      },
      {
        title: '移动就诊',
        children: [
          { id: 'P205-APP', title: '就诊记录', routePath: '/doctor-app/visit-record/:id', menuPath: '/doctor-app/visit-record/demo', view: 'doctor-app/VisitRecordPage', priority: 'v1', shell: 'phone', journey: 'J1', type: '表单' }
        ]
      },
      {
        title: '移动分诊',
        children: [
          { id: 'P207', title: '转诊申请详情', routePath: '/doctor-app/referral/:id', menuPath: '/doctor-app/referral/demo', view: 'doctor-app/ReferralPage', priority: 'v1', shell: 'phone', journey: 'J3', type: '详情' },
          { id: 'P210', title: 'MDT 邀请详情', routePath: '/doctor-app/mdt/:id', menuPath: '/doctor-app/mdt/demo', view: 'doctor-app/MdtPage', priority: 'v1', shell: 'phone', journey: 'J3', type: '详情' },
          { id: 'P211-APP', title: 'MDT 会诊室', routePath: '/doctor-app/mdt/room/:id', menuPath: '/doctor-app/mdt/room/demo', view: 'doctor-app/MdtRoomPage', priority: 'v1', shell: 'phone', journey: 'J3', type: '工作台' },
          { id: 'P213-APP', title: '共享给我的患者', routePath: '/doctor-app/shared', menuPath: '/doctor-app/shared', view: 'doctor-app/SharedPage', priority: 'v1', shell: 'phone', journey: 'J3', type: '列表' }
        ]
      },
      {
        title: '移动陪护',
        children: [
          { id: 'P216', title: '用药情况', routePath: '/doctor-app/medication', menuPath: '/doctor-app/medication', view: 'doctor-app/MedicationPage', priority: 'v2', shell: 'phone', journey: 'J4', type: '列表' },
          { id: 'P217', title: '患者消息', routePath: '/doctor-app/messages', menuPath: '/doctor-app/messages', view: 'doctor-app/MessagesPage', priority: 'v2', shell: 'phone', journey: 'J4', type: '列表+详情' }
        ]
      }
    ]
  },
  {
    key: 'intranet',
    title: '内网端（专病库）',
    icon: 'DataAnalysis',
    children: [
      {
        title: '数据接入',
        children: [
          { id: 'P301', title: '数据接入监控（含冷热双通道）', routePath: '/intranet/ingest', menuPath: '/intranet/ingest', view: 'intranet/IngestPage', priority: 'v1', shell: 'pc', journey: 'J2', type: '看板' },
          { id: 'P302', title: '同步异常详情', routePath: '/intranet/ingest/error/:id', menuPath: '/intranet/ingest/error/ie-01', view: 'intranet/IngestErrorPage', priority: 'v2', shell: 'pc', journey: 'J2', type: '详情' }
        ]
      },
      {
        title: '数据治理',
        children: [
          { id: 'P303', title: '数据落库总览', routePath: '/intranet/storage', menuPath: '/intranet/storage', view: 'intranet/StoragePage', priority: 'v2', shell: 'pc', journey: 'J2', type: '看板' },
          { id: 'P304', title: '清洗任务列表', routePath: '/intranet/cleaning', menuPath: '/intranet/cleaning', view: 'intranet/CleaningPage', priority: 'v3', shell: 'pc', journey: 'J2', type: '列表' },
          { id: 'P305', title: '清洗任务详情', routePath: '/intranet/cleaning/:id', menuPath: '/intranet/cleaning/cl-01', view: 'intranet/CleaningDetailPage', priority: 'v3', shell: 'pc', journey: 'J2', type: '详情' },
          { id: 'P306', title: '脱敏规则管理', routePath: '/intranet/desensitize', menuPath: '/intranet/desensitize', view: 'intranet/DesensitizePage', priority: 'v3', shell: 'pc', journey: 'J2', type: '列表+表单' },
          { id: 'P307', title: '映射工作台', routePath: '/intranet/mapping', menuPath: '/intranet/mapping', view: 'intranet/MappingPage', priority: 'v3', shell: 'pc', journey: 'J2', type: '详情+表单' }
        ]
      },
      {
        title: '质量控制',
        children: [
          { id: 'P308', title: '质控工作台', routePath: '/intranet/qc', menuPath: '/intranet/qc', view: 'intranet/QcPage', priority: 'v3', shell: 'pc', journey: 'J2', type: '列表' },
          { id: 'P309', title: '质疑工单详情', routePath: '/intranet/qc/:id', menuPath: '/intranet/qc/QT-01', view: 'intranet/QcTicketPage', priority: 'v3', shell: 'pc', journey: 'J2', type: '详情' }
        ]
      },
      {
        title: '查询统计',
        children: [
          { id: 'P311', title: '多维查询导出', routePath: '/intranet/query', menuPath: '/intranet/query', view: 'intranet/QueryPage', priority: 'v2', shell: 'pc', journey: 'J2', type: '表单+列表' },
          { id: 'P312', title: '统计分析', routePath: '/intranet/stats', menuPath: '/intranet/stats', view: 'intranet/StatsPage', priority: 'v2', shell: 'pc', journey: 'J2', type: '看板' },
          { id: 'P313', title: '科研 CRF', routePath: '/intranet/crf', menuPath: '/intranet/crf', view: 'intranet/CrfPage', priority: 'v3', shell: 'pc', journey: '', type: '表单' }
        ]
      },
      {
        title: '患者档案',
        children: [
          { id: 'P310', title: '患者 360（内网视角）', routePath: '/intranet/360/:id', menuPath: '/intranet/360/p-02', view: 'intranet/Patient360Page', priority: 'v2', shell: 'pc', journey: 'J3', type: '详情' }
        ]
      }
    ]
  },
  {
    key: 'system',
    title: '系统能力',
    icon: 'Setting',
    children: [
      {
        title: '基础配置',
        children: [
          { id: 'P402', title: '角色与权限', routePath: '/system/permissions', menuPath: '/system/permissions', view: 'system/PermissionsPage', priority: 'v1', shell: 'pc', journey: 'J3', type: '列表+表单' },
          { id: 'P403', title: '医院与资质', routePath: '/system/hospitals', menuPath: '/system/hospitals', view: 'system/HospitalsPage', priority: 'v1', shell: 'pc', journey: 'J1', type: '列表+表单' }
        ]
      },
      {
        title: '演示',
        children: [
          { id: 'P001', title: '演示模式说明', routePath: '/demo-guide', menuPath: '/demo-guide', view: 'DemoGuidePage', priority: 'v2', shell: 'pc', journey: '', type: '详情' }
        ]
      },
      {
        title: '数据大屏',
        children: [
          { id: 'P401', title: '数据流转大屏', routePath: '/system/dashboard', menuPath: '/system/dashboard', view: 'system/DashboardPage', priority: 'v3', shell: 'pc', journey: 'J2', type: '看板' }
        ]
      }
    ]
  }
]

// 工具：返回扁平化的所有 leaf
export function flattenLeaves(): NavLeaf[] {
  const out: NavLeaf[] = []
  for (const group of navTree) {
    for (const sub of group.children) {
      out.push(...sub.children)
    }
  }
  return out
}

// 工具：按 group key 找出顶层组，便于面包屑
export function findGroupByPath(path: string): { group: NavGroup; sub: NavSubGroup; leaf: NavLeaf } | null {
  for (const group of navTree) {
    for (const sub of group.children) {
      for (const leaf of sub.children) {
        // 把 routePath 的 :id 替换为正则匹配
        const pattern = '^' + leaf.routePath.replace(/:[a-zA-Z]+/g, '[^/]+') + '$'
        if (new RegExp(pattern).test(path)) {
          return { group, sub, leaf }
        }
      }
    }
  }
  return null
}
