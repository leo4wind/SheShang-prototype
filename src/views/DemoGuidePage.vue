<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const journeys = [
  {
    code: 'J1', name: '蛇伤急救', color: '#f56c6c', terminals: '患者小程序 ↔ 医生 PC',
    steps: ['患者一键 SOS', '选就近有资质医院', '上报现场 / 等待', '医生工作台接诊', '推送自救指引 / 填就诊记录'],
    start: '/patient/sos', startLabel: '从求救首页开始'
  },
  {
    code: 'J3', name: '多中心协作', color: '#e6a23c', terminals: '医生 PC → 医生 APP',
    steps: ['PC 发起转诊 / MDT / 共享', 'APP 收件箱接收', '接受 / 拒绝', 'MDT 会诊室', '患者 360 全景'],
    start: '/doctor/referral/new', startLabel: '从发起转诊开始'
  },
  {
    code: 'J4', name: '健康陪护', color: '#67c23a', terminals: '患者小程序（+ 医生回看）',
    steps: ['随访计划时间轴', '用药打卡 / 日历', '陪护对话（状态机）', '随访问卷 / 知识', '健康趋势'],
    start: '/patient/care/timeline', startLabel: '从随访计划开始'
  },
  {
    code: 'J2', name: '数据治理底座', color: '#409eff', terminals: '内网专病库',
    steps: ['冷热双通道接入', '落库总览', '多维查询导出', '统计分析', '患者 360（内网脱敏）'],
    start: '/intranet/ingest', startLabel: '从数据接入开始'
  }
]
</script>

<template>
  <div class="demo-guide">
    <div class="hero">
      <h1>圣蛇蛇伤一体化平台 · 演示导览</h1>
      <p>四条主线讲一个完整故事：从被蛇咬伤的那一刻，到救治、协作、康复，以及背后的数据底座。</p>
      <div class="hero-tags">
        <el-tag effect="plain">团队对齐 / 设计评审</el-tag>
        <el-tag effect="plain" type="success">v1 + v2 mock</el-tag>
        <el-tag effect="plain" type="warning">AI 全部为算法接入点占位</el-tag>
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
      description="带 :id 的详情页从菜单直点会自动回退到预置示例；要看真实联动请按主线流程走，跨终端回看用浏览器后退。完整说明见 docs/操作手册.md。"
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
