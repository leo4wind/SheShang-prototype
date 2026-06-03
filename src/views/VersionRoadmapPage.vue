<script setup lang="ts">
const versions = [
  {
    key: 'v1',
    title: '最小急救接诊闭环',
    subtitle: '先把核心业务跑通',
    color: '#67c23a',
    points: ['患者 SOS + 就近医院', '医生救助工作台', '蛇伤判定（规则表单）', '手填就诊记录', '患者查看就诊历史', '旧专病库最小导入', '角色与权限 / 医院与资质'],
    description: '围绕患者求救→医生接诊→规则判定→就诊记录→患者查看，形成可演示的完整故事。不依赖任何 V2/V3 能力。'
  },
  {
    key: 'v2',
    title: '多中心协同 + 持续服务',
    subtitle: '补协同、补随访、补运营',
    color: '#e6a23c',
    points: ['医生 APP 整体', '转诊 / MDT / 共享患者', '患者 360', '蛇伤判定 AI 占位', '随访计划 / 用药打卡 / 复查', '医患消息 / 培训中心', 'HIS/LIS/PACS/120 接入', '落库总览 / 多维查询 / 统计分析'],
    description: '在 V1 闭环之上增强跨院协同、患者全景、随访运营、查询统计和培训能力。'
  },
  {
    key: 'v3',
    title: '数据治理 + 科研 + 智能化',
    subtitle: '做深数据底座和亮点大屏',
    color: '#909399',
    points: ['脱敏 / 清洗 / 映射', '质控工作台 + 查阅原文', '科研 CRF', '数据流转大屏', '历史判定复盘', 'AI 图像识别 / Agent / 治疗路径', '随访问卷 / 知识中心 / 打卡日历'],
    description: '聚焦数据治理工作台、科研沉淀、质量闭环、AI 智能化和展示型大屏。'
  }
]

const flowSteps = [
  {
    key: 'v1',
    title: 'V1 急救接诊闭环',
    detail: 'SOS → 接诊 → 规则判定 → 就诊记录 → 患者查看'
  },
  {
    key: 'v2',
    title: 'V2 协同随访',
    detail: '转诊/MDT → 患者360 → 随访闭环 → 医患消息'
  },
  {
    key: 'v3',
    title: 'V3 治理科研',
    detail: '质控闭环 → CRF → AI → 数据大屏'
  }
]
</script>

<template>
  <div class="version-roadmap">
    <section class="hero">
      <div>
        <el-tag effect="plain" class="hero-tag">项目规划</el-tag>
        <h1>版本规划：V1 / V2 / V3</h1>
        <p>用一个页面对齐建设节奏：V1 先跑通急救接诊闭环，V2 增强多中心协同和随访服务，V3 做深数据治理、科研和智能化。</p>
      </div>
      <div class="hero-metric">
        <strong>3</strong>
        <span>阶段交付</span>
      </div>
    </section>

    <section class="version-grid">
      <el-card v-for="version in versions" :key="version.key" shadow="hover" class="version-card">
        <div class="card-head" :style="{ borderLeftColor: version.color }">
          <div>
            <span class="version-badge" :style="{ background: version.color }">{{ version.key }}</span>
            <span class="version-title">{{ version.title }}</span>
          </div>
          <el-tag size="small" effect="plain">{{ version.key }}</el-tag>
        </div>
        <p class="version-subtitle">{{ version.subtitle }}</p>
        <p class="version-desc">{{ version.description }}</p>
        <div class="point-list">
          <el-tag
            v-for="point in version.points"
            :key="point"
            class="point-tag"
            effect="plain"
            size="small"
          >
            {{ point }}
          </el-tag>
        </div>
      </el-card>
    </section>

    <el-card shadow="never" class="flow-card">
      <div class="section-head">
        <div>
          <h2>演进流程图</h2>
          <p>按照“先闭环、再增强、后治理”的顺序推进，避免过早陷入重型数据工作台。</p>
        </div>
        <el-tag type="info" effect="plain">Roadmap Flow</el-tag>
      </div>

      <div class="flow-line">
        <div v-for="(step, index) in flowSteps" :key="step.key" class="flow-item">
          <div class="flow-node" :class="step.key">
            <span>{{ step.key }}</span>
          </div>
          <div class="flow-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.detail }}</p>
          </div>
          <div v-if="index < flowSteps.length - 1" class="flow-arrow">→</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.version-roadmap {
  max-width: 1120px;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 30px;
  margin-bottom: 20px;
  border-radius: 14px;
  color: #fff;
  background: linear-gradient(135deg, #315efb, #31b3ff 58%, #50c878);
  box-shadow: 0 12px 30px rgba(49, 94, 251, 0.18);
}

.hero-tag {
  margin-bottom: 12px;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.12);
}

.hero h1 {
  margin: 0 0 10px;
  font-size: 26px;
  line-height: 1.3;
}

.hero p {
  max-width: 680px;
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.92;
}

.hero-metric {
  min-width: 118px;
  padding: 18px 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.14);
}

.hero-metric strong {
  display: block;
  font-size: 42px;
  line-height: 1;
}

.hero-metric span {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.9;
}

.version-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.version-card {
  min-height: 252px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-left: 12px;
  margin-bottom: 12px;
  border-left: 4px solid;
}

.version-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 24px;
  margin-right: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  border-radius: 999px;
}

.version-title {
  font-size: 17px;
  font-weight: 700;
  color: #303133;
}

.version-subtitle {
  margin: 0 0 8px;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.version-desc {
  min-height: 66px;
  margin: 0 0 14px;
  color: #606266;
  font-size: 13px;
  line-height: 1.7;
}

.point-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.point-tag {
  margin: 0;
}

.flow-card {
  border-radius: 14px;
}

.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.section-head h2 {
  margin: 0 0 6px;
  font-size: 20px;
  color: #303133;
}

.section-head p {
  margin: 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}

.flow-line {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  overflow: hidden;
}

.flow-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 18px;
  border: 1px solid #ebeef5;
  border-radius: 14px;
  background: linear-gradient(180deg, #ffffff, #f8fbff);
}

.flow-node {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  color: #fff;
  font-weight: 800;
  border-radius: 50%;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
}

.flow-node.v1 {
  background: #67c23a;
}

.flow-node.v2 {
  background: #e6a23c;
}

.flow-node.v3 {
  background: #909399;
}

.flow-content {
  min-width: 0;
}

.flow-content h3 {
  margin: 0 0 6px;
  font-size: 15px;
  color: #303133;
}

.flow-content p {
  margin: 0;
  color: #606266;
  font-size: 12px;
  line-height: 1.6;
}

.flow-arrow {
  position: absolute;
  top: 50%;
  right: -21px;
  z-index: 1;
  width: 22px;
  height: 22px;
  margin-top: -11px;
  color: #409eff;
  font-size: 22px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  background: #fff;
}

@media (max-width: 960px) {
  .hero,
  .section-head {
    flex-direction: column;
  }

  .version-grid,
  .flow-line {
    grid-template-columns: 1fr;
  }

  .flow-arrow {
    top: auto;
    right: 50%;
    bottom: -24px;
    transform: translateX(50%) rotate(90deg);
  }
}
</style>
