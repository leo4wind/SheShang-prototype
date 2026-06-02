// 教育内容库：患者知识中心（P114/P115）+ 医生培训中心（P219/P220）

export interface KnowledgeArticle {
  id: string
  title: string
  tag: '急救' | '用药' | '康复' | '预防'
  type: 'article' | 'video'
  summary: string
  readCount: number
  duration?: string        // 视频时长
  content: string[]        // 正文段落（原型）
}

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: 'k-01', title: '被蛇咬伤后最关键的 10 分钟', tag: '急救', type: 'article',
    summary: '保持冷静、绷扎制动、记住咬伤时间——决定预后的黄金窗口。', readCount: 1280,
    content: [
      '被毒蛇咬伤后，毒液主要通过淋巴回流扩散，剧烈活动会显著加速这一过程。',
      '第一步是停止活动、坐下或躺下，让伤肢保持低于心脏的位置。',
      '第二步在伤口近心端 5-10cm 处用绷带加压绷扎，每 15-20 分钟松解 1-2 分钟。',
      '第三步记住咬伤时间与蛇的特征（颜色、头型），并尽快拨打急救或使用一键 SOS。'
    ]
  },
  {
    id: 'k-02', title: '抗蛇毒血清：越早用越好吗？', tag: '用药', type: 'article',
    summary: '血清的使用时机、皮试与不良反应，听专科医生怎么说。', readCount: 856,
    content: [
      '抗蛇毒血清是中和游离毒素的特异性治疗，原则上越早使用效果越好。',
      '使用前需评估过敏风险，必要时脱敏给药，全程监测生命体征。',
      '血清只能中和血液中尚未与组织结合的毒素，因此不能替代局部处理与支持治疗。'
    ]
  },
  {
    id: 'k-03', title: '伤口换药与肢体康复训练', tag: '康复', type: 'video',
    summary: '出院后如何观察伤口、做康复训练，避免关节僵硬。', readCount: 642, duration: '06:32',
    content: ['视频演示：伤口清洁、换药要点，以及手部/下肢的渐进式康复动作。']
  },
  {
    id: 'k-04', title: '野外作业如何预防蛇咬伤', tag: '预防', type: 'article',
    summary: '穿戴、行走、夜间照明——把风险降到最低。', readCount: 1530,
    content: [
      '进入草丛、林区时穿高帮鞋与长裤，使用登山杖“打草惊蛇”。',
      '夜间作业务必照明，蛇多在黄昏与夜间活动。',
      '不要徒手翻动石块、柴堆，遇蛇保持距离、缓慢退开。'
    ]
  },
  {
    id: 'k-05', title: '哪些症状提示是神经毒类蛇咬伤', tag: '急救', type: 'article',
    summary: '眼睑下垂、呼吸困难——银环蛇等神经毒的危险信号。', readCount: 970,
    content: [
      '神经毒类（如银环蛇）早期局部症状轻，但可在数小时内出现眼睑下垂、复视、吞咽与呼吸困难。',
      '一旦出现呼吸费力，需立即就医并做好呼吸支持准备，切勿因“看起来不重”而延误。'
    ]
  }
]

export function getKnowledge(id: string): KnowledgeArticle | undefined {
  return knowledgeArticles.find((a) => a.id === id)
}

// ───── 医生培训中心 ─────
export interface TrainingCourse {
  id: string
  title: string
  category: '诊疗规范' | '血清使用' | '病例复盘' | '设备操作'
  type: 'article' | 'video'
  duration: string
  status: '已发布' | '审核中' | '草稿'
  author: string
  completedRate: number     // 已学习医生占比
  updatedAt: string
}

export const trainingCourses: TrainingCourse[] = [
  { id: 't-01', title: '蛇伤分级诊疗规范（2026 版）', category: '诊疗规范', type: 'article', duration: '20 min', status: '已发布', author: '李文博', completedRate: 88, updatedAt: '2026-05-20' },
  { id: 't-02', title: '抗蛇毒血清规范化使用与不良反应处理', category: '血清使用', type: 'video', duration: '35 min', status: '已发布', author: '陈志远', completedRate: 72, updatedAt: '2026-05-18' },
  { id: 't-03', title: '危重银环蛇咬伤抢救病例复盘', category: '病例复盘', type: 'video', duration: '28 min', status: '审核中', author: '孙倩', completedRate: 0, updatedAt: '2026-06-01' },
  { id: 't-04', title: '床旁凝血检测设备操作', category: '设备操作', type: 'article', duration: '12 min', status: '已发布', author: '王建华', completedRate: 65, updatedAt: '2026-05-10' },
  { id: 't-05', title: '五步蛇咬伤致 DIC 的识别与处理', category: '病例复盘', type: 'article', duration: '18 min', status: '草稿', author: '刘海燕', completedRate: 0, updatedAt: '2026-06-02' }
]
