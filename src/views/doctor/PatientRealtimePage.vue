<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRescueStore, STATUS_LABEL, type RescueStatus } from '@/stores/rescue'
import { useAppStore } from '@/stores/app'
import { currentPatient, getHospital } from '@/mock/data'
import MockDataLabel from '@/components/MockDataLabel.vue'
import AlgoPlaceholder from '@/components/AlgoPlaceholder.vue'

const route = useRoute()
const router = useRouter()
const rescue = useRescueStore()
const appStore = useAppStore()
const { versionView } = storeToRefs(appStore)

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
    pastHistory: ['既往史待到院核验后关联'],
    allergy: [], bloodType: '—'
  }
})

const identityStatusText = computed(() =>
  ev.value?.identityStatus === 'bound' ? '已绑定患者档案' : '临时求救身份'
)
const identityStatusType = computed(() =>
  ev.value?.identityStatus === 'bound' ? 'success' : 'warning'
)
const identityDetail = computed(() => {
  if (!ev.value) return ''
  if (ev.value.identityStatus === 'bound') {
    return ev.value.boundBy === 'hospital-checkin'
      ? `到院核验绑定 · ${ev.value.boundAt ?? '—'}`
      : `登录注册绑定 · ${ev.value.boundAt ?? '—'}`
  }
  return '未登录也可救助；到院核验或患者登录后绑定正式档案'
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

function gotoDiagnosis() {
  if (ev.value) router.push(`/doctor/diagnosis/${ev.value.id}`)
}

function discharge() {
  if (!ev.value) return
  rescue.discharge(ev.value.id)
  ElMessage.success('已标记出院，患者端就诊历史会同步更新')
}

const supplementItems = computed(() => {
  const record = ev.value?.visitRecord
  return [
    { label: '诊断', done: Boolean(record?.diagnosisNote) },
    { label: '用药', done: Boolean(record?.medications) },
    { label: '检验', done: Boolean(record?.labSummary) },
    { label: '影像', done: Boolean(record?.imagingSummary) }
  ]
})
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
        <el-tag :type="identityStatusType as any" effect="plain">{{ identityStatusText }}</el-tag>
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
              <div v-if="ev.report.hasPhoto" class="report-photo">
                <img :src="ev.report.photoUrl" alt="患者上传现场照片" />
                <span>现场照片</span>
              </div>
              <div class="media-items">
                <div v-if="ev.report.voiceSeconds" class="media-box"><el-icon :size="22"><Microphone /></el-icon><span>语音 {{ ev.report.voiceSeconds }}s</span></div>
                <div v-if="!ev.report.hasPhoto && !ev.report.voiceSeconds" class="media-none">无多媒体</div>
              </div>
            </div>
          </template>
        </el-card>

        <AlgoPlaceholder
          kind="cv"
          title="蛇种图像识别"
          description="基于患者上传的蛇/伤口照片，给出可能蛇种与置信度；V1 最终判定在就诊记录内完成"
        >
          <div class="algo-rows">
            <div class="algo-row"><span>竹叶青</span><el-progress :percentage="72" :stroke-width="10" /></div>
            <div class="algo-row"><span>蝮蛇</span><el-progress :percentage="18" :stroke-width="10" status="warning" /></div>
          </div>
        </AlgoPlaceholder>

        <el-card shadow="never" class="block">
          <template #header><span class="bt">就诊记录流转</span></template>
          <div class="record-flow">
            <div class="record-step" :class="{ done: ev.diagnosisDraft || ev.visitRecord }">
              <span>蛇种判定</span>
              <b v-if="ev.diagnosisDraft">{{ ev.diagnosisDraft.snakeName }} · {{ ev.diagnosisDraft.severity }}</b>
              <b v-else-if="ev.visitRecord">{{ ev.visitRecord.snakeJudgment }}</b>
              <b v-else>随就诊记录填写</b>
              <em v-if="ev.diagnosisDraft">规则分 {{ ev.diagnosisDraft.ruleScore }} · {{ ev.diagnosisDraft.confirmedAt }}</em>
            </div>
            <div class="record-arrow">→</div>
            <div class="record-step" :class="{ done: ev.visitRecord }">
              <span>就诊记录</span>
              <b v-if="ev.visitRecord">{{ ev.visitRecord.snakeJudgment }} · {{ ev.visitRecord.serumDose }}</b>
              <b v-else>待保存归档</b>
              <em v-if="ev.visitRecord">{{ ev.visitRecord.doctorName }} · {{ ev.visitRecord.recordedAt }}</em>
            </div>
          </div>
          <div v-if="ev.diagnosisDraft && !ev.visitRecord" class="draft-note">
            已生成判定草稿，下一步保存就诊记录后进入治疗中，并同步给患者端就诊历史。
          </div>
          <div v-else-if="ev.visitRecord" class="draft-note">
            正式记录已生成；后续进入数据治理管线，并可在详情中查看判定与处置依据。
          </div>
          <div v-else class="draft-note">
            V1 将蛇种判定、血清用量和处置记录合并到就诊记录页，减少医生重复录入。
          </div>
          <div class="supplement-status">
            <el-tag
              v-for="item in supplementItems"
              :key="item.label"
              size="small"
              :type="item.done ? 'success' : 'info'"
              effect="plain"
            >
              {{ item.label }}{{ item.done ? '已补录' : '待补录' }}
            </el-tag>
          </div>
          <div v-if="ev.visitRecord" class="record-replay">
            <div class="replay-title">
              <span>治疗记录回显</span>
              <el-tag size="small" type="success" effect="plain">最新记录</el-tag>
            </div>
            <div class="replay-grid">
              <div class="replay-item"><span>蛇种判定</span><b>{{ ev.visitRecord.snakeJudgment }}</b></div>
              <div class="replay-item"><span>血清</span><b>{{ ev.visitRecord.serumName }} · {{ ev.visitRecord.serumDose }}</b></div>
              <div class="replay-item wide"><span>用药记录</span><p>{{ ev.visitRecord.medications }}</p></div>
              <div class="replay-item wide"><span>其它处置</span><p>{{ ev.visitRecord.treatment }}</p></div>
              <div class="replay-item wide"><span>诊断说明</span><p>{{ ev.visitRecord.diagnosisNote }}</p></div>
              <div class="replay-item wide"><span>检验摘要</span><p>{{ ev.visitRecord.labSummary }}</p></div>
              <div class="replay-item wide"><span>影像摘要</span><p>{{ ev.visitRecord.imagingSummary }}</p></div>
              <div class="replay-item wide"><span>生命体征</span><p>{{ ev.visitRecord.vitalSigns }}</p></div>
            </div>
            <div v-if="ev.visitRecord.attachments?.length" class="replay-attachments">
              <div v-for="attachment in ev.visitRecord.attachments" :key="attachment.id" class="replay-attachment">
                <img :src="attachment.url" :alt="attachment.name" />
                <div>
                  <el-tag size="small" effect="plain">{{ attachment.type }}</el-tag>
                  <b>{{ attachment.name }}</b>
                  <p>{{ attachment.note }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右列：患者档案 + 行程 -->
      <el-col :span="10">
        <el-card shadow="never" class="block">
          <template #header><span class="bt">患者档案（专病库 D1）</span></template>
          <div class="identity-box">
            <el-tag size="small" :type="identityStatusType as any">{{ identityStatusText }}</el-tag>
            <span>{{ identityDetail }}</span>
          </div>
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
      <el-button v-if="versionView === 'v3'" type="primary" plain @click="gotoDiagnosis">蛇伤判定</el-button>
      <el-button type="success" plain @click="gotoRecord">{{ ev.visitRecord ? '更新就诊记录' : '填写就诊记录' }}</el-button>
      <el-button v-if="ev.status === 'treating'" type="success" @click="discharge">确认出院</el-button>
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
.report-photo { border: 1px solid #ebeef5; border-radius: 8px; overflow: hidden; background: #f8fbff; margin-bottom: 8px; }
.report-photo img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.report-photo span { display: block; padding: 6px 8px; font-size: 12px; color: #606266; }
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

.record-flow { display: flex; align-items: stretch; gap: 10px; }
.record-step { flex: 1; border: 1px solid #ebeef5; border-radius: 8px; padding: 12px; background: #fafafa; display: flex; flex-direction: column; gap: 5px; min-width: 0; }
.record-step.done { border-color: #b3e19d; background: #f0f9eb; }
.record-step span { font-size: 12px; color: #909399; }
.record-step b { font-size: 14px; color: #303133; line-height: 1.4; }
.record-step em { font-size: 12px; color: #909399; font-style: normal; }
.record-arrow { align-self: center; color: #c0c4cc; font-weight: 700; }
.draft-note { margin-top: 10px; font-size: 13px; color: #606266; line-height: 1.6; }
.supplement-status { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.record-replay { margin-top: 12px; border: 1px solid #ebeef5; border-radius: 8px; padding: 12px; background: #fff; }
.replay-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.replay-title span { font-size: 14px; font-weight: 600; color: #303133; }
.replay-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.replay-item { min-width: 0; }
.replay-item.wide { grid-column: 1 / -1; }
.replay-item span { display: block; font-size: 12px; color: #909399; margin-bottom: 3px; }
.replay-item b { font-size: 13px; color: #303133; line-height: 1.5; word-break: break-word; }
.replay-item p { margin: 0; font-size: 13px; color: #606266; line-height: 1.6; }
.replay-attachments { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.replay-attachment { border: 1px solid #ebeef5; border-radius: 8px; overflow: hidden; background: #fafafa; min-width: 0; }
.replay-attachment img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #f5f7fa; }
.replay-attachment div { padding: 8px; display: flex; flex-direction: column; align-items: flex-start; gap: 5px; }
.replay-attachment b { font-size: 13px; color: #303133; line-height: 1.4; word-break: break-word; }
.replay-attachment p { margin: 0; font-size: 12px; color: #606266; line-height: 1.5; }

.history { margin-top: 10px; }
.identity-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 10px;
  background: #fafafa;
}
.identity-box span:last-child { font-size: 12px; color: #606266; line-height: 1.5; }
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

@media (max-width: 1100px) {
  .record-flow { flex-direction: column; }
  .record-arrow { transform: rotate(90deg); }
  .replay-grid, .replay-attachments { grid-template-columns: 1fr; }
}
</style>
