<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRescueStore, STATUS_LABEL, type RescueStatus } from '@/stores/rescue'
import { currentPatient, getHospital } from '@/mock/data'
import MockDataLabel from '@/components/MockDataLabel.vue'
import AlgoPlaceholder from '@/components/AlgoPlaceholder.vue'

const route = useRoute()
const router = useRouter()
const rescue = useRescueStore()

const eventId = computed(() => {
  const id = route.params.id as string
  if (id && id !== 'demo') return id
  return rescue.currentEvent?.id ?? rescue.activeEvents[0]?.id ?? ''
})
const ev = computed(() => rescue.getEvent(eventId.value))
const hospital = computed(() => (ev.value?.selectedHospitalId ? getHospital(ev.value.selectedHospitalId) : undefined))

// 患者既往史：当前演示患者用 currentPatient，其它用占位
const patientInfo = computed(() => {
  if (ev.value?.patientId === currentPatient.id) return currentPatient
  return {
    name: ev.value?.patientName ?? '—',
    gender: '—', age: 0, phone: '—',
    emergencyContact: '—', emergencyPhone: '—',
    pastHistory: ['（既往史从专病库 D1 调阅，本患者暂无档案）'],
    allergy: [], bloodType: '—'
  }
})

const statusTagType: Record<RescueStatus, string> = {
  sos: 'danger', hospital: 'warning', reported: 'warning',
  accepted: 'primary', arrived: 'primary', treating: 'success', discharged: 'info'
}

function accept() {
  if (ev.value) {
    rescue.acceptByDoctor(ev.value.id, '王医生')
    ElMessage.success('已接诊，患者端会看到提示')
  }
}

function gotoGuide() {
  if (ev.value) router.push(`/doctor/rescue-guide?event=${ev.value.id}`)
}

function gotoRecord() {
  if (ev.value) router.push(`/doctor/visit-record/${ev.value.id}`)
}
</script>

<template>
  <div v-if="!ev" class="empty">
    <el-result icon="warning" title="未找到求救事件">
      <template #extra><el-button @click="router.push('/doctor/rescue')">返回工作台</el-button></template>
    </el-result>
  </div>

  <div v-else class="realtime">
    <div class="page-head">
      <el-button link @click="router.push('/doctor/rescue')"><el-icon><ArrowLeft /></el-icon> 返回工作台</el-button>
      <div class="head-main">
        <h2>{{ ev.patientName }} · {{ ev.id }}</h2>
        <el-tag :type="statusTagType[ev.status] as any">{{ STATUS_LABEL[ev.status] }}</el-tag>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16">
      <!-- 左列：现场上报 -->
      <el-col :span="14">
        <el-card shadow="never" class="block">
          <template #header><span class="bt">现场上报信息</span></template>
          <div v-if="!ev.report" class="no-report">患者尚未上报现场信息</div>
          <template v-else>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="当前症状">{{ ev.report.symptoms }}</el-descriptions-item>
              <el-descriptions-item label="自救措施">{{ ev.report.selfRescue || '—' }}</el-descriptions-item>
              <el-descriptions-item label="咬伤时间">{{ ev.report.bittenTime || '—' }}</el-descriptions-item>
              <el-descriptions-item label="蛇的描述">{{ ev.report.snakeDescription || '—' }}</el-descriptions-item>
            </el-descriptions>

            <div class="media">
              <div class="media-title">患者上传（从对象存储 D2 调阅）：</div>
              <div class="media-items">
                <div v-if="ev.report.hasPhoto" class="media-box"><el-icon :size="22"><PictureFilled /></el-icon><span>伤口/蛇照片</span></div>
                <div v-if="ev.report.voiceSeconds" class="media-box"><el-icon :size="22"><Microphone /></el-icon><span>语音 {{ ev.report.voiceSeconds }}s</span></div>
                <div v-if="!ev.report.hasPhoto && !ev.report.voiceSeconds" class="media-none">无多媒体</div>
              </div>
            </div>
          </template>
        </el-card>

        <AlgoPlaceholder
          kind="cv"
          title="蛇种图像识别"
          description="基于患者上传的蛇/伤口照片，给出可能蛇种与置信度（详细判定在 P204 蛇伤判定页）"
        >
          <div class="algo-rows">
            <div class="algo-row"><span>竹叶青</span><el-progress :percentage="72" :stroke-width="10" /></div>
            <div class="algo-row"><span>蝮蛇</span><el-progress :percentage="18" :stroke-width="10" status="warning" /></div>
          </div>
        </AlgoPlaceholder>
      </el-col>

      <!-- 右列：患者档案 + 行程 -->
      <el-col :span="10">
        <el-card shadow="never" class="block">
          <template #header><span class="bt">患者档案（专病库 D1）</span></template>
          <el-descriptions :column="1" size="small">
            <el-descriptions-item label="基本">{{ patientInfo.gender }} · {{ patientInfo.age }}岁 · {{ patientInfo.bloodType }}</el-descriptions-item>
            <el-descriptions-item label="联系">{{ patientInfo.phone }}</el-descriptions-item>
            <el-descriptions-item label="过敏史">
              <el-tag v-for="a in patientInfo.allergy" :key="a" size="small" type="danger" effect="plain" style="margin-right:4px">{{ a }}</el-tag>
              <span v-if="!patientInfo.allergy.length">—</span>
            </el-descriptions-item>
          </el-descriptions>
          <div class="history">
            <div class="h-title">既往史</div>
            <ul><li v-for="h in patientInfo.pastHistory" :key="h">{{ h }}</li></ul>
          </div>
        </el-card>

        <el-card shadow="never" class="block">
          <template #header><span class="bt">行程</span></template>
          <div class="trip">
            <div class="trip-item"><span>位置</span><b>{{ ev.location }}</b></div>
            <div class="trip-item"><span>目标医院</span><b>{{ hospital?.name ?? '待选' }}</b></div>
            <div class="trip-item" v-if="hospital"><span>预计到达</span><b>约 {{ hospital.etaMin }} 分钟</b></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="action-bar">
      <el-button v-if="ev.status === 'reported' || ev.status === 'hospital' || ev.status === 'sos'" type="primary" @click="accept">接诊此患者</el-button>
      <el-button type="warning" plain @click="gotoGuide">推送自救指引</el-button>
      <el-button type="success" plain @click="gotoRecord">填写就诊记录</el-button>
    </div>
  </div>
</template>

<style scoped>
.empty { padding-top: 60px; }
.page-head { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.head-main { display: flex; align-items: center; gap: 10px; flex: 1; }
.head-main h2 { margin: 0; font-size: 18px; }

.block { margin-bottom: 16px; }
.bt { font-weight: 600; }
.no-report { color: #909399; font-size: 13px; padding: 8px 0; }

.media { margin-top: 12px; }
.media-title { font-size: 12px; color: #909399; margin-bottom: 6px; }
.media-items { display: flex; gap: 10px; }
.media-box {
  width: 90px; height: 64px; border-radius: 8px; background: #f5f7fa;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px; font-size: 12px; color: #606266;
}
.media-none { font-size: 12px; color: #c0c4cc; }

.algo-rows { display: flex; flex-direction: column; gap: 8px; }
.algo-row { display: flex; align-items: center; gap: 10px; }
.algo-row span { width: 56px; font-size: 13px; }
.algo-row :deep(.el-progress) { flex: 1; }

.history { margin-top: 10px; }
.h-title { font-size: 12px; color: #909399; margin-bottom: 4px; }
.history ul { padding-left: 18px; margin: 0; }
.history li { font-size: 13px; margin: 3px 0; }

.trip-item { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
.trip-item span { color: #909399; }

.action-bar {
  position: sticky; bottom: 0;
  background: #fff; border-top: 1px solid #ebeef5;
  padding: 12px 0; display: flex; gap: 12px; justify-content: center;
  margin: 0 -16px -16px;
}
</style>
