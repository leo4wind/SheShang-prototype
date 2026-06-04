<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const journeys = [
  {
    code: 'V1', name: '急救接诊闭环', color: '#f56c6c', terminals: '患者小程序 ↔ 医生 PC ↔ 内网最小导入',
    steps: ['患者一键 SOS', '就近医院推荐', '医生工作台接诊', '推送自救指引', '记录内完成蛇种判定与就诊记录 / 患者查看历史'],
    start: '/patient/sos', startLabel: '从求救首页开始'
  },
  {
    code: 'V2', name: '协同与持续服务', color: '#e6a23c', terminals: '医生 PC → 医生 APP → 患者小程序',
    steps: ['PC 发起转诊 / MDT / 共享', 'APP 收件箱接收', '患者 360 全景', '随访计划 / 用药打卡', '医患消息与培训中心'],
    start: '/doctor/referral/new', startLabel: '从发起转诊开始'
  },
  {
    code: 'V3', name: '治理科研与智能化', color: '#409eff', terminals: '内网专病库',
    steps: ['清洗 / 脱敏 / 映射 / 质控', '质控工单查阅原文', '科研 CRF', '数据流转大屏', '图像识别 / Agent / 治疗路径'],
    start: '/intranet/qc', startLabel: '从质控工作台开始'
  }
]
</script>

<template>
  <div class="demo-guide">
    <div class="hero">
      <h1>圣蛇蛇伤一体化平台 · 演示导览</h1>
      <p>按 PRD 1.1 的三层版本故事演示：V1 急救接诊闭环，V2 协同随访，V3 治理科研与智能化。</p>
      <div class="hero-tags">
        <el-tag effect="plain">团队对齐 / 设计评审</el-tag>
        <el-tag effect="plain" type="success">PRD 1.1 口径</el-tag>
        <el-tag effect="plain" type="warning">AI 为 V2/V3 增强占位</el-tag>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="12" v-for="j in journeys" :key="j.code">
        <el-card shadow="hover" class="jcard">
          <div class="jhead" :style="{ borderLeftColor: j.color }">
            <div>
              <span class="jcode" :style="{ background: j.color }">{{ j.code }}</span>
              <span class="jname">{{ j.name }}</span>
            </div>
            <span class="jterm">{{ j.terminals }}</span>
          </div>
          <ol class="jsteps">
            <li v-for="(s, i) in j.steps" :key="i">{{ s }}</li>
          </ol>
          <el-button type="primary" plain @click="router.push(j.start)">{{ j.startLabel }} →</el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-alert
      type="info" :closable="false" show-icon class="foot"
      title="提示"
      description="带 :id 的详情页从菜单直点会自动回退到预置示例；左侧版本视图可切换 V1 / V2 / V3 演示范围。"
    />
  </div>
</template>

<style scoped>
.demo-guide { max-width: 1000px; }
.hero { background: linear-gradient(135deg, #409eff, #5a4fcf); color: #fff; border-radius: 12px; padding: 28px; margin-bottom: 20px; }
.hero h1 { margin: 0 0 8px; font-size: 24px; }
.hero p { margin: 0 0 14px; opacity: 0.92; font-size: 14px; line-height: 1.6; }
.hero-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.jcard { margin-bottom: 16px; }
.jhead { display: flex; align-items: center; justify-content: space-between; border-left: 3px solid; padding-left: 10px; margin-bottom: 12px; }
.jcode { color: #fff; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-right: 8px; }
.jname { font-size: 16px; font-weight: 700; }
.jterm { font-size: 12px; color: #909399; }
.jsteps { padding-left: 20px; margin: 0 0 14px; }
.jsteps li { font-size: 13px; color: #606266; margin: 5px 0; line-height: 1.5; }
.foot { margin-top: 8px; }
</style>
