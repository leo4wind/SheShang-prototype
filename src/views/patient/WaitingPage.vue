<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useRescueStore, STATUS_FLOW, STATUS_LABEL } from '@/stores/rescue'
import { getHospital, selfRescueTemplates } from '@/mock/data'

const route = useRoute()
const router = useRouter()
const rescue = useRescueStore()

const eventId = computed(() => route.params.id as string)
const ev = computed(() => rescue.getEvent(eventId.value))
const hospital = computed(() => (ev.value?.selectedHospitalId ? getHospital(ev.value.selectedHospitalId) : undefined))

const currentStepIndex = computed(() => (ev.value ? STATUS_FLOW.indexOf(ev.value.status) : 0))

function guideDetail(templateId: string) {
  return selfRescueTemplates.find((t) => t.id === templateId)
}

function showQrcode() {
  if (ev.value) router.push(`/patient/qrcode/${ev.value.id}`)
}
</script>

<template>
  <div class="waiting-page">
    <PhoneNavBar title="就诊进度" back="/patient/hospitals" />

    <div v-if="!ev" class="empty">
      <el-empty description="未找到该求救事件">
        <el-button type="primary" @click="router.push('/patient/sos')">重新求救</el-button>
      </el-empty>
    </div>

    <div v-else class="body">
      <div class="status-card">
        <div class="status-now">{{ STATUS_LABEL[ev.status] }}</div>
        <div class="event-id">{{ ev.id }} · {{ ev.createdAt }}发起</div>
        <el-steps :active="currentStepIndex" finish-status="success" direction="vertical" class="steps">
          <el-step v-for="s in STATUS_FLOW" :key="s" :title="STATUS_LABEL[s]" />
        </el-steps>
      </div>

      <div v-if="hospital" class="hospital-card">
        <div class="block-title"><el-icon><LocationFilled /></el-icon> 目标医院</div>
        <div class="hospital-name">{{ hospital.name }} <el-tag size="small" type="info">{{ hospital.level }}</el-tag></div>
        <div class="hospital-meta">{{ hospital.distanceKm }}km · 约 {{ hospital.etaMin }} 分钟 · {{ hospital.phone }}</div>
      </div>

      <div v-if="ev.assignedDoctor" class="doctor-card">
        <el-icon color="#67c23a"><CircleCheckFilled /></el-icon>
        <span>{{ ev.assignedDoctor }} 已接诊，正在远程查看你的情况</span>
      </div>

      <div class="guide-card">
        <div class="block-title"><el-icon><FirstAidKit /></el-icon> 医生推送的自救指引</div>
        <div v-if="!ev.pushedGuides.length" class="no-guide">
          等待医生推送自救指引…
        </div>
        <el-collapse v-else>
          <el-collapse-item
            v-for="g in ev.pushedGuides"
            :key="g.templateId"
            :name="g.templateId"
          >
            <template #title>
              <span class="guide-title">{{ g.title }}</span>
              <span class="guide-time">{{ g.pushedAt }}</span>
            </template>
            <ol class="guide-steps">
              <li v-for="(step, i) in guideDetail(g.templateId)?.steps ?? []" :key="i">{{ step }}</li>
            </ol>
            <el-alert
              v-if="guideDetail(g.templateId)?.warning"
              type="error"
              :closable="false"
              :title="guideDetail(g.templateId)?.warning"
              show-icon
            />
          </el-collapse-item>
        </el-collapse>
      </div>

      <div class="actions">
        <el-button
          v-if="currentStepIndex < 2"
          type="primary"
          size="large"
          @click="router.push('/patient/report')"
        >
          上报现场信息
        </el-button>
        <el-button size="large" @click="showQrcode">出示就诊二维码</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.waiting-page { min-height: 100%; background: #f0f2f5; }
.empty { padding-top: 60px; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }

.status-card, .hospital-card, .guide-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
}
.status-now { font-size: 18px; font-weight: 700; color: #f56c6c; }
.event-id { font-size: 12px; color: #909399; margin: 4px 0 10px; }
.steps { margin-top: 8px; }
.steps :deep(.el-step__title) { font-size: 13px; line-height: 24px; }

.block-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}
.hospital-name { font-size: 15px; font-weight: 600; }
.hospital-meta { font-size: 12px; color: #909399; margin-top: 4px; }

.doctor-card {
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #67c23a;
}

.no-guide { font-size: 13px; color: #909399; padding: 8px 0; }
.guide-title { flex: 1; font-size: 14px; }
.guide-time { font-size: 12px; color: #909399; margin-right: 12px; }
.guide-steps { padding-left: 18px; margin: 4px 0 10px; }
.guide-steps li { margin: 4px 0; font-size: 13px; line-height: 1.5; }

.actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}
.actions .el-button { width: 100%; margin-left: 0; }
</style>
