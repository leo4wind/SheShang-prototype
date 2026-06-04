<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const modules = [
  {
    key: 'V1',
    title: '急救接诊闭环',
    scope: '患者求救到出院回看，跑通最小业务闭环。',
    color: '#67c23a',
    terminals: '患者小程序 -> 医生 PC -> 内网最小导入',
    modules: ['应急求救', '救助工作台', '自救指引', '就诊记录', '就诊历史'],
    flow: ['患者 SOS', '选择医院', '上报现场', '医生接诊', '推送指引', '手填就诊记录', '确认出院'],
    start: '/patient/sos',
    startLabel: '从求救首页开始'
  },
  {
    key: 'V2',
    title: '协同与持续服务',
    scope: '在 V1 就诊档案之上，补齐跨院协同、医生移动端和随访服务。',
    color: '#e6a23c',
    terminals: '医生 PC -> 医生 APP -> 患者小程序',
    modules: ['转诊 / MDT / 共享', '医生 APP', '患者 360', '基础随访', '培训中心'],
    flow: ['发起转诊', 'APP 收件处理', '共享患者资料', '查看患者 360', '生成随访计划'],
    start: '/doctor/referral/new',
    startLabel: '从转诊申请开始'
  },
  {
    key: 'V3',
    title: '治理科研与智能化',
    scope: '沉淀数据治理、科研分析和智能化增强能力。',
    color: '#909399',
    terminals: '内网专病库 + 医生 PC 增强',
    modules: ['规则判定表单', '清洗 / 脱敏 / 映射 / 质控', '原文复核', '科研 CRF', '数据流转大屏', '图像识别 / Agent'],
    flow: ['规则复盘', '清洗质控', '查阅原文', '生成 CRF', '展示数据流', '智能辅助'],
    start: '/intranet/qc',
    startLabel: '从质控工作台开始'
  }
]

const mainFlow = [
  'V1 先闭环：急救接诊能独立演示',
  'V2 再协同：跨院、移动端、随访接上',
  'V3 做增强：治理科研和智能化沉淀'
]
</script>

<template>
  <div class="module-flow">
    <section class="hero">
      <div>
        <el-tag effect="plain" class="hero-tag">模块版本流程</el-tag>
        <h1>模块版本流程</h1>
        <p>一页看清 V1/V2/V3 的模块边界、业务流程和演示起点；重复说明收敛到这一个入口。</p>
      </div>
      <div class="hero-side">
        <strong>3</strong>
        <span>阶段交付</span>
      </div>
    </section>

    <section class="module-grid">
      <el-card v-for="item in modules" :key="item.key" shadow="hover" class="module-card">
        <div class="module-head" :style="{ borderLeftColor: item.color }">
          <span class="module-key" :style="{ background: item.color }">{{ item.key }}</span>
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.scope }}</p>
          </div>
        </div>

        <div class="meta-row">
          <span>终端</span>
          <b>{{ item.terminals }}</b>
        </div>

        <div class="block">
          <div class="block-title">模块范围</div>
          <div class="tag-list">
            <el-tag v-for="module in item.modules" :key="module" effect="plain">{{ module }}</el-tag>
          </div>
        </div>

        <div class="block">
          <div class="block-title">主流程</div>
          <ol class="step-list">
            <li v-for="step in item.flow" :key="step">{{ step }}</li>
          </ol>
        </div>

        <el-button type="primary" plain class="start-btn" @click="router.push(item.start)">
          {{ item.startLabel }}
        </el-button>
      </el-card>
    </section>

    <el-card shadow="never" class="flow-card">
      <div class="section-head">
        <div>
          <h2>建设顺序</h2>
          <p>先闭环、再协同、后治理，避免 V1 倒挂依赖 V2/V3 能力。</p>
        </div>
        <el-tag type="info" effect="plain">Roadmap</el-tag>
      </div>

      <div class="flow-line">
        <div v-for="(step, index) in mainFlow" :key="step" class="flow-item">
          <div class="flow-index">{{ index + 1 }}</div>
          <p>{{ step }}</p>
          <div v-if="index < mainFlow.length - 1" class="flow-arrow">→</div>
        </div>
      </div>
    </el-card>

    <el-alert
      type="info"
      :closable="false"
      show-icon
      class="demo-alert"
      title="演示模式提示"
      description="带 :id 的详情页从菜单直点会自动回退到预置示例；左侧版本视图可切换 V1 / V2 / V3 演示范围。"
    />
  </div>
</template>

<style scoped>
.module-flow {
  max-width: 1180px;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 30px;
  margin-bottom: 18px;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, #123c69, #2a7f62);
}

.hero-tag {
  margin-bottom: 12px;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.12);
}

.hero h1 {
  margin: 0 0 8px;
  font-size: 28px;
  line-height: 1.25;
}

.hero p {
  max-width: 720px;
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.9;
}

.hero-side {
  min-width: 116px;
  padding: 18px 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.26);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
}

.hero-side strong {
  display: block;
  font-size: 42px;
  line-height: 1;
}

.hero-side span {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.9;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;
}

.module-card {
  border-radius: 12px;
}

.module-head {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 104px;
  padding-left: 12px;
  margin-bottom: 14px;
  border-left: 4px solid;
}

.module-key {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 28px;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  border-radius: 999px;
}

.module-head h2 {
  margin: 0 0 6px;
  color: #303133;
  font-size: 18px;
}

.module-head p {
  margin: 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.6;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 48px;
  margin-bottom: 12px;
}

.meta-row span,
.block-title {
  color: #909399;
  font-size: 12px;
}

.meta-row b {
  color: #303133;
  font-size: 13px;
  line-height: 1.5;
}

.block {
  margin-bottom: 12px;
}

.block-title {
  margin-bottom: 7px;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.step-list {
  min-height: 154px;
  margin: 0;
  padding-left: 18px;
}

.step-list li {
  margin: 5px 0;
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
}

.start-btn {
  width: 100%;
}

.flow-card {
  margin-bottom: 14px;
  border-radius: 12px;
}

.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-head h2 {
  margin: 0 0 6px;
  color: #303133;
  font-size: 20px;
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
  gap: 18px;
}

.flow-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  min-height: 74px;
  padding: 14px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fafcff;
}

.flow-index {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  color: #fff;
  font-weight: 800;
  border-radius: 50%;
  background: #409eff;
}

.flow-item p {
  margin: 0;
  color: #303133;
  font-size: 13px;
  line-height: 1.6;
}

.flow-arrow {
  position: absolute;
  top: 50%;
  right: -20px;
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

.demo-alert {
  margin-bottom: 4px;
}

@media (max-width: 1100px) {
  .module-grid,
  .flow-line {
    grid-template-columns: 1fr;
  }

  .module-head,
  .meta-row,
  .step-list {
    min-height: 0;
  }

  .flow-arrow {
    top: auto;
    right: 50%;
    bottom: -22px;
    transform: translateX(50%) rotate(90deg);
  }
}

@media (max-width: 760px) {
  .hero,
  .section-head {
    flex-direction: column;
  }
}
</style>
