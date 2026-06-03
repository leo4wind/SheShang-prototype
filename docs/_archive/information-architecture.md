# 信息架构 & 左菜单

> 这份文档决定了 Vue 项目的**第一屏长什么样**、路由怎么组织、不同终端如何共存。锁定后再进 `page-inventory.md` 把每个菜单项落到具体页面。

---

## 顶层结构

`AGENTS.md` 要求"左侧菜单树 + 右侧页面内容"。本项目要在一个 Vue 应用里同时呈现 3 类终端，所以采用**单菜单树 + 一级按终端分组**：

```
┌────────────────┬────────────────────────────────────┐
│  左侧菜单树     │  右侧内容区                          │
│                │                                    │
│ ─ 患者端       │  ┌──────────────────────────────┐  │
│   ├ 应急求救   │  │  PC 页面：铺满                  │  │
│   └ 健康陪护   │  │                              │  │
│ ─ 医生端       │  │  小程序/APP 页面：375px 手机壳  │  │
│   ├ 蛇伤判定   │  │  居中 + 灰底                    │  │
│   ├ ...        │  │                              │  │
│ ─ 内网端       │  └──────────────────────────────┘  │
│   ├ 数据接入   │                                    │
│   └ ...        │  顶部面包屑：终端 / 模块 / 页面      │
│ ─ 系统能力     │                                    │
│   └ 数据大屏   │                                    │
└────────────────┴────────────────────────────────────┘
```

**为什么不是顶部 Tab 切终端**：评审场景下经常要快速跨终端对照（"患者上报后医生那边看到什么？"），左菜单常驻能一眼跳转，比 Tab 切换路径更短。

---

## 完整菜单树（v1+v2，按角色/终端聚类）

> 每项后面括号是承担它的主要 journey 和优先级。具体页面 ID 在 `page-inventory.md`。

```
─ 患者端  [375px 手机壳]
  ├ 应急求救
  │   ├ 求救首页（一键SOS）            (J1, v1)
  │   ├ 就近医院列表                    (J1, v1)
  │   ├ 自救等待页 / 就诊详情           (J1, v1)
  │   ├ 现场信息上报                    (J1, v1)
  │   ├ 就诊二维码                      (J1, v1)
  │   └ 弱网兜底（电话/短信）            (J1, v1)
  ├ 我的就诊
  │   ├ 就诊历史列表                    (J1+J4, v1)
  │   └ 就诊详情                        (J1+J4, v1)
  └ 健康陪护
      ├ 我的随访计划                    (J4, v1)
      ├ 复查详情                        (J4, v1)
      ├ 用药打卡（每日）                 (J4, v1)
      ├ 打卡日历                        (J4, v2)
      ├ 陪护对话                        (J4, v1)
      ├ 随访问卷                        (J4, v2)
      ├ 知识中心                        (J4, v2)
      ├ 我的医生 / 患者消息              (J4, v2)
      └ 我的健康（长期趋势）              (J4, v2)

─ 医生端  [PC 铺满 / APP 用 375px 切换]
  ├ 救助工作台                          (J1, v1)
  ├ 蛇伤判定
  │   ├ 判定首页（图像识别 + Agent）     (J1+J3, v2)
  │   ├ 就诊记录                        (J1, v1)
  │   └ 历史判定复盘                    (J3, v3)
  ├ 多中心分诊
  │   ├ 转诊申请                        (J3, v1)
  │   ├ 转诊申请详情（接收方）           (J3, v1)
  │   ├ 转诊跟踪                        (J3, v1)
  │   ├ MDT 邀请                        (J3, v1)
  │   ├ MDT 邀请详情（受邀）             (J3, v1)
  │   ├ MDT 会诊室                      (J3, v1 占位/v2 完善)
  │   ├ 共享患者                        (J3, v1)
  │   └ 共享给我的患者                  (J3, v1)
  ├ 我的患者
  │   ├ 患者列表（群组视图）             (J4, v2)
  │   ├ 患者 360                        (J3, v2)
  │   ├ 用药情况                        (J4, v2)
  │   └ 患者消息                        (J4, v2)
  ├ 随访管理
  │   └ 随访计划管理                    (J4, v2)
  ├ 数据答疑                            (J2, v3)
  └ 培训中心
      ├ 培训资料                        (J3, v2)
      └ 培训管理                        (J3, v2)

─ 内网端  [PC 铺满]
  ├ 数据接入
  │   ├ 接入监控                        (J2, v1)
  │   └ 同步异常详情                    (J2, v2)
  ├ 数据治理
  │   ├ 数据落库总览                    (J2, v2)
  │   ├ 清洗任务列表 / 详情              (J2, v3)
  │   ├ 脱敏规则管理                    (J2, v3)
  │   └ 映射工作台                      (J2, v3)
  ├ 质量控制
  │   ├ 质控工作台                      (J2, v3)
  │   └ 质疑工单详情                    (J2, v3)
  ├ 患者 360（含主索引、时间线）         (J3, v2)
  ├ 多维查询导出                        (J2, v2)
  ├ 统计分析                            (J2, v2)
  ├ 随访模块（统计端）                   (J4, v3)
  └ 科研 CRF                            (—, v3)

─ 系统能力  [横切]
  ├ 数据流转大屏                        (J2, v3)
  ├ 角色与权限                          (J3, v1)
  └ 医院与资质                          (J1, v1)
```

> 简化原则：菜单层级 ≤ 3 级（顶层 / 模块 / 页面）。再深就改路由参数。

---

## 终端容器策略

| 终端 | 容器 | 视觉处理 | 路由前缀 |
|---|---|---|---|
| 患者小程序 | 375px × ~ 667px 手机壳，居中 + 灰底 | 顶部假状态栏（信号/时间/电量）+ 假底部 tab | `/patient/*` |
| 医生 APP | 同上手机壳 | 顶部白色导航栏 | `/doctor-app/*` |
| 医生 PC | 右内容区铺满 | 标准 Element Plus 后台风 | `/doctor/*` |
| 内网 PC | 右内容区铺满 | 标准 Element Plus 后台风（带"内网"水印） | `/intranet/*` |
| 系统能力大屏 | 右内容区铺满 | 暗色背景 + 数据可视化风 | `/system/*` |

**手机壳容器**用一个共用组件 `PhoneShell.vue` 包裹，子页面按设计稿 375px 编写，不用关心外面有没有壳。

**医生端 PC ↔ APP 同源页面**：转诊、MDT、患者消息这几个页面在 PC 和 APP 都有入口，建议同一个组件接收 `mode: 'pc' | 'app'` prop，里面用 CSS 差异化布局，避免两份代码漂移。

---

## 路由结构（Vue Router）

```
/                                    → 重定向到 /home
/home                                → 项目首页（4 条主线导航 + 数据流大屏入口）
/patient/sos                         → J1-01 求救首页
/patient/hospitals                   → J1-02 就近医院列表
/patient/waiting/:eventId            → J1-03 自救等待页
/patient/report                      → J1-04 现场信息上报
/patient/qrcode                      → J1-08 就诊二维码
/patient/visits                      → 就诊历史列表
/patient/visits/:id                  → 就诊详情
/patient/care/timeline               → J4-02 我的随访计划
/patient/care/recheck/:id            → J4-03 复查详情
/patient/care/checkin                → J4-04 用药打卡
/patient/care/chat                   → J4-07 陪护对话
/patient/care/survey/:id             → J4-08 随访问卷
/patient/care/knowledge              → J4-09 知识中心
/patient/care/knowledge/:id          → J4-10 知识详情
/patient/care/doctor-chat            → J4-11 我的医生
/patient/care/health                 → J4-13 我的健康

/doctor/rescue                       → J1-05 救助工作台
/doctor/patient-realtime/:id         → J1-06 患者实时视图
/doctor/rescue-guide                 → J1-07 自救指引推送
/doctor/diagnosis                    → J1-09 蛇伤判定
/doctor/visit-record/:id             → J1-10 就诊记录
/doctor/referral/new                 → J3-02 转诊申请
/doctor/referral/:id                 → J3-04 转诊跟踪
/doctor/mdt/new                      → J3-05 MDT 邀请
/doctor/mdt/:id                      → J3-07 MDT 会诊室
/doctor/share                        → J3-09 共享患者表单
/doctor/shared                       → J3-10 共享给我的
/doctor/patients                     → J4-14 我的患者
/doctor/patient360/:id               → J3-08 患者 360
/doctor/training                     → J3-12 培训中心
/doctor/training/manage              → J3-13 培训管理
/doctor/answer                       → J2-10 数据答疑

/doctor-app/...                      → 同上对应页面，但 mode=app
/doctor-app/inbox                    → J3-03/06 转诊/MDT 收件箱

/intranet/ingest                     → J2-01 数据接入监控
/intranet/ingest/error/:id           → J2-02 同步异常详情
/intranet/storage                    → J2-03 数据落库总览
/intranet/cleaning                   → J2-04 清洗任务列表
/intranet/cleaning/:id               → J2-05 清洗任务详情
/intranet/desensitize                → J2-06 脱敏规则管理
/intranet/mapping                    → J2-07 映射工作台
/intranet/qc                         → J2-08 质控工作台
/intranet/qc/:id                     → J2-09 质疑工单详情
/intranet/360/:id                    → 患者 360（内网视角，复用组件）
/intranet/query                      → J2-11 多维查询导出
/intranet/stats                      → J2-12 统计分析
/intranet/followup                   → 随访统计
/intranet/crf                        → 科研 CRF

/system/dashboard                    → J2-13 数据流转大屏
/system/permissions                  → J3-11 角色与权限
/system/hospitals                    → 医院与资质
```

---

## 关键交互约定

1. **跨终端跳转**：从医生 PC 「救助工作台」一项可跳到 `/patient/report?eventId=xxx`，让评审者**直接体验**患者端看到什么。要在右上角加一个「← 返回医生端」浮动按钮。
2. **演示模式开关**：右上角放一个全局 Switch，开启后自动把每条主线串起来，按预设脚本一步一步走。
3. **当前角色提示**：左菜单顶部显示当前角色（"你正在以：接诊医生 / 张医生 的身份查看"），切换菜单顶层组时自动改。
4. **面包屑**：顶部固定显示"终端 / 模块 / 页面"，方便定位。

---

## 评审检查清单

1. **菜单层级**：有没有项目落在 3 级以上？需不需要拆模块？
2. **路由命名**：路径语义清晰吗？以后接 mock API 时方便吗？
3. **共用组件**：哪些页面真正可以跨终端复用（如「就诊记录」）？哪些表面相似但实际差异大？
4. **演示路径**：从 `/home` 出发，能不能在 30 分钟内完整走完 4 条主线？
5. **首页**：`/home` 怎么设计？建议放 4 张大卡片对应 4 条主线 + 一个数据大屏入口
