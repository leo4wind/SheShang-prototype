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

interface VersionLayer {
  key: string
  title: string
  subtitle: string
  color: string
  entry: string
  entryTitle: string
  highlights: string[]
}

const versionLayers: VersionLayer[] = [
  {
    key: 'v1',
    title: 'V1 · 急救接诊闭环',
    subtitle: '患者 SOS → 医生接诊 → 蛇伤判定(规则) → 就诊记录 → 患者查看',
    color: '#67c23a',
    entry: '/patient/sos',
    entryTitle: '从「求救首页」开始',
    highlights: ['患者小程序', '医生 PC', '可演示完整故事']
  },
  {
    key: 'v2',
    title: 'V2 · 多中心协同 + 持续服务',
    subtitle: '转诊/MDT/共享 → 患者360 → 随访闭环 → 医患消息 → 培训',
    color: '#e6a23c',
    entry: '/doctor/referral/new',
    entryTitle: '从「转诊申请」开始（V2）',
    highlights: ['医生APP', '跨院协作', '随访运营']
  },
  {
    key: 'v3',
    title: 'V3 · 数据治理 + 科研 + 智能化',
    subtitle: '完整治理 → 质控闭环 → 科研CRF → AI图像识别 → 数据大屏',
    color: '#909399',
    entry: '/intranet/qc',
    entryTitle: '从「质控工作台」开始（V3）',
    highlights: ['内网PC', '数据治理', '科研沉淀']
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
  { id: 'P401', title: '数据流转大屏（v3）', desc: '单通道数据流转展示 · 内外网边界标注', route: '/system/dashboard', priority: 'v3' }
]

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
          三层递进 · V1 急救闭环 → V2 协同随访 → V3 治理科研 · v1 阶段共 {{ v1Count }} 个页面
        </p>
        <p class="hint">
          左侧菜单按"终端"组织。点击下方卡片可快速跳到各版本起点开始演示。PRD 1.1 为唯一 source of truth。
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
      <h2 class="section-title">三层故事（V1 / V2 / V3）</h2>
      <el-row :gutter="16">
        <el-col v-for="layer in versionLayers" :key="layer.key" :xs="24" :md="8">
          <el-card class="journey-card" shadow="hover" @click="router.push(layer.entry)">
            <div class="card-head">
              <span class="version-badge" :style="{ background: layer.color }">{{ layer.key }}</span>
              <div class="card-title">{{ layer.title }}</div>
            </div>
            <p class="card-subtitle">{{ layer.subtitle }}</p>
            <div class="card-tags">
              <el-tag v-for="h in layer.highlights" :key="h" size="small" effect="plain">{{ h }}</el-tag>
            </div>
            <div class="card-foot">
              <span class="entry">{{ layer.entryTitle }}</span>
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
      <h2 class="section-title">配套文档</h2>
      <ul>
        <li><code>docs/蛇伤专病PRD-v1.1.md</code> — <strong>唯一 source of truth</strong>（含流程图 / 数据流 / 模块清单 / 版本说明 / 用户故事）</li>
        <li><code>plan/PRD-1.1-指导文档.md</code> — PRD 1.1 指导文档（含 15 条取舍决策 + 原型改造清单）</li>
        <li><code>plan/蛇伤专病原型与文档重构计划.md</code> — 原型与文档重构计划</li>
      </ul>
      <p class="docs-note">旧文档（data-flow.md、page-inventory.md、information-architecture.md、roles.md、journeys/*）已归档至 <code>docs/_archive/</code></p>
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
  gap: 10px;
  margin-bottom: 8px;
}

.version-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 22px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  text-transform: uppercase;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
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

.docs-note {
  margin: 12px 0 0;
  font-size: 12px;
  color: #c0c4cc;
}
</style>
