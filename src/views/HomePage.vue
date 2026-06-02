<script setup lang="ts">
import { useRouter } from 'vue-router'
import { flattenLeaves } from '@/router/nav-config'
import { useAppStore } from '@/stores/app'

const router = useRouter()
const appStore = useAppStore()

const leaves = flattenLeaves()
const v1Count = leaves.filter((l) => l.priority === 'v1').length

interface JourneyCard {
  id: string
  title: string
  subtitle: string
  color: string
  emoji: string
  role: string
  entry: string  // 起点路由
  entryTitle: string
  highlights: string[]
}

const journeys: JourneyCard[] = [
  {
    id: 'J1',
    title: '主线 1 · 蛇伤急救',
    subtitle: '患者求救 → 接诊医生远程救助 → 入院判定 → 就诊记录',
    color: '#f56c6c',
    emoji: 'SOS',
    role: '蛇伤患者 + 接诊医生',
    entry: '/patient/sos',
    entryTitle: '从「求救首页」开始',
    highlights: ['患者小程序', '医生 PC', '跨终端最多', '最有戏剧张力']
  },
  {
    id: 'J2',
    title: '主线 2 · 数据治理',
    subtitle: '多源接入 → 落库 → 脱敏 → 清洗 → 映射 → 质控 → 入专病库',
    color: '#67c23a',
    emoji: 'DB',
    role: '数据管理员',
    entry: '/intranet/ingest',
    entryTitle: '从「数据接入监控」开始',
    highlights: ['内网 PC', '冷热双通道', '其它 3 条主线的底座']
  },
  {
    id: 'J3',
    title: '主线 3 · 医生工作站',
    subtitle: '蛇伤判定 → 转诊 → MDT 会诊 → 共享患者 → 权限 → 培训',
    color: '#409eff',
    emoji: 'MD',
    role: '接诊医生 + 多中心专家',
    entry: '/doctor/referral/new',
    entryTitle: '从「转诊申请」开始',
    highlights: ['医生 PC + APP', '跨院协作', '权限管理']
  },
  {
    id: 'J4',
    title: '主线 4 · 患者陪护',
    subtitle: '随访计划 → 复查 → 用药打卡 → 对话 → 问卷 → 医患互动',
    color: '#e6a23c',
    emoji: '随',
    role: '蛇伤患者（出院后）',
    entry: '/patient/care/timeline',
    entryTitle: '从「我的随访计划」开始',
    highlights: ['患者小程序', '长周期', '推送频次控制']
  }
]

interface SysCard {
  id: string
  title: string
  desc: string
  route: string
  priority: 'v1' | 'v2' | 'v3'
}

const systemCards: SysCard[] = [
  { id: 'P402', title: '角色与权限', desc: '维护演示角色、菜单权限、数据权限', route: '/system/permissions', priority: 'v1' },
  { id: 'P403', title: '医院与资质', desc: '维护医院、资质、血清库存接入', route: '/system/hospitals', priority: 'v1' },
  { id: 'P401', title: '数据流转大屏（v3）', desc: '数据从源到专病库的实时流量呈现 · 单页展示无钻取', route: '/system/dashboard', priority: 'v3' }
]

function goJourney(card: JourneyCard) {
  router.push(card.entry)
}

function goSys(card: SysCard) {
  if (card.priority === 'v3') {
    return
  }
  router.push(card.route)
}
</script>

<template>
  <div class="home">
    <section class="hero">
      <div>
        <h1>人民蛇伤模块 · 原型</h1>
        <p class="subtitle">
          覆盖 4 条主线 · 3 类终端 · 7 类角色 · v1 阶段共 {{ v1Count }} 个页面
        </p>
        <p class="hint">
          左侧菜单按"终端"组织，每条主线的页面散落在不同终端。点击下方卡片可以快速跳到主线起点开始演示。
        </p>
      </div>
      <div class="hero-controls">
        <el-switch
          v-model="appStore.demoMode"
          inline-prompt
          active-text="演示模式"
          inactive-text="自由浏览"
          size="large"
        />
        <p class="hint-tiny">演示模式开启后右上角显示推送计数（呼应主线 4 频次控制）</p>
      </div>
    </section>

    <section>
      <h2 class="section-title">4 条主线</h2>
      <el-row :gutter="16">
        <el-col v-for="card in journeys" :key="card.id" :xs="24" :md="12">
          <el-card class="journey-card" shadow="hover" @click="goJourney(card)">
            <div class="card-head">
              <div class="emoji" :style="{ background: card.color }">{{ card.emoji }}</div>
              <div>
                <div class="card-title">{{ card.title }}</div>
                <div class="card-role">主导：{{ card.role }}</div>
              </div>
            </div>
            <p class="card-subtitle">{{ card.subtitle }}</p>
            <div class="card-tags">
              <el-tag v-for="h in card.highlights" :key="h" size="small" effect="plain">{{ h }}</el-tag>
            </div>
            <div class="card-foot">
              <span class="entry">{{ card.entryTitle }}</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section>
      <h2 class="section-title">系统能力</h2>
      <el-row :gutter="16">
        <el-col v-for="card in systemCards" :key="card.id" :xs="24" :md="8">
          <el-card
            shadow="hover"
            class="sys-card"
            :class="{ disabled: card.priority === 'v3' }"
            @click="goSys(card)"
          >
            <div class="sys-head">
              <span class="sys-id">{{ card.id }}</span>
              <el-tag
                size="small"
                :type="card.priority === 'v1' ? 'success' : card.priority === 'v2' ? 'warning' : 'info'"
              >
                {{ card.priority }}
              </el-tag>
            </div>
            <div class="sys-title">{{ card.title }}</div>
            <div class="sys-desc">{{ card.desc }}</div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="docs">
      <h2 class="section-title">配套文档（评审依据）</h2>
      <ul>
        <li><code>docs/roles.md</code> — 7 角色 × 4 终端</li>
        <li><code>docs/journeys/journey-1-emergency.md</code> — 主线 1 蛇伤急救</li>
        <li><code>docs/journeys/journey-2-data.md</code> — 主线 2 数据治理（评审已合并 v2 反馈）</li>
        <li><code>docs/journeys/journey-3-doctor.md</code> — 主线 3 医生工作站</li>
        <li><code>docs/journeys/journey-4-care.md</code> — 主线 4 患者陪护（含推送约束）</li>
        <li><code>docs/data-flow.md</code> — 数据流贯穿图（含冷热双通道、网络边界、D2 消费修正）</li>
        <li><code>docs/information-architecture.md</code> — 信息架构与路由表</li>
        <li><code>docs/page-inventory.md</code> — 54 个页面清单</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  background: linear-gradient(135deg, #001428 0%, #003a8c 100%);
  color: #fff;
  border-radius: 8px;
  padding: 28px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.hero h1 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
}

.hero .subtitle {
  margin: 0 0 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
}

.hero .hint {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.65);
}

.hero-controls {
  text-align: right;
}

.hint-tiny {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin: 8px 0 0;
}

.section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.journey-card {
  cursor: pointer;
  margin-bottom: 16px;
  transition: transform 0.15s;
}

.journey-card:hover {
  transform: translateY(-2px);
}

.card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.emoji {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.card-role {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.card-subtitle {
  margin: 8px 0 12px;
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--color-primary);
  border-top: 1px dashed var(--color-border);
  padding-top: 10px;
}

.entry {
  font-weight: 500;
}

.sys-card {
  cursor: pointer;
  margin-bottom: 16px;
  transition: transform 0.15s;
}

.sys-card.disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.sys-card:not(.disabled):hover {
  transform: translateY(-2px);
}

.sys-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sys-id {
  font-family: ui-monospace, Menlo, monospace;
  font-size: 12px;
  color: var(--color-text-secondary);
  background: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
}

.sys-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.sys-desc {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.docs {
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
}

.docs ul {
  list-style: disc;
  padding-left: 20px;
  margin: 0;
  font-size: 13px;
  color: var(--color-text-secondary);
}

.docs li {
  margin: 6px 0;
}
</style>
