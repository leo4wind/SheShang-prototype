<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createDefaultVisitAttachments, useRescueStore, type VisitRecord } from '@/stores/rescue'
import { snakeTypes } from '@/mock/data'

const route = useRoute()
const router = useRouter()
const rescue = useRescueStore()

const eventId = computed(() => {
  const id = route.params.id as string
  if (id && id !== 'demo') return id
  return rescue.currentEvent?.id ?? rescue.activeEvents[0]?.id ?? ''
})
const ev = computed(() => rescue.getEvent(eventId.value))
const diagnosisDraft = computed(() => ev.value?.diagnosisDraft)
const usesFreshDraft = computed(() => {
  if (!diagnosisDraft.value) return false
  return ev.value?.visitRecord?.sourceDiagnosisAt !== diagnosisDraft.value.confirmedAt
})
const hasVisitRecord = computed(() => Boolean(ev.value?.visitRecord))
const saveButtonText = computed(() => (hasVisitRecord.value ? '更新治疗记录' : '保存就诊记录'))
const saveHintText = computed(() =>
  hasVisitRecord.value
    ? '治疗中可多次补录，保存后患者端与医生端展示最新记录'
    : '首次保存后进入治疗中，后续可继续补录更新'
)

const form = reactive<VisitRecord>({
  snakeJudgment: '',
  serumName: '',
  serumDose: '',
  treatment: '',
  diagnosisNote: '',
  medications: '',
  labSummary: '',
  imagingSummary: '',
  vitalSigns: '',
  attachments: [],
  doctorName: '王医生',
  recordedAt: ''
})

const defaultDiagnosisNote = '结合现场照片、双牙痕、局部肿胀及出血倾向，考虑毒蛇咬伤，按血循毒蛇伤处理。'
const defaultLabSummary = '凝血功能待复查；建议完善血常规、凝血四项、肝肾功能、电解质。'
const defaultVitalSigns = '意识清楚，呼吸平稳；血压、脉搏、血氧待护士站补录。'
const defaultTreatment = '局部清创消毒、制动抬高患肢、破伤风预防、留观 24 小时，动态复查凝血与肾功能。'

function defaultMedication() {
  if (form.serumName && form.serumDose) return `${form.serumName} ${form.serumDose}；清创、制动、留观复评。`
  return '暂未使用抗蛇毒血清，先行清创、制动、留观复评。'
}

function defaultImagingSummary() {
  if (ev.value?.report?.hasPhoto) return '已查看患者上传伤口/蛇体线索照片；院内影像待 V2 PACS 接入后自动补全。'
  return '暂无院内影像；蛇体/伤口线索以患者口述为主。'
}

function fillDefaultSupplements() {
  form.diagnosisNote = form.diagnosisNote || defaultDiagnosisNote
  form.medications = form.medications || defaultMedication()
  form.labSummary = form.labSummary || defaultLabSummary
  form.imagingSummary = form.imagingSummary || defaultImagingSummary()
  form.vitalSigns = form.vitalSigns || defaultVitalSigns
  if (!form.attachments?.length) form.attachments = createDefaultVisitAttachments()
}

function fillFromDraft() {
  const draft = diagnosisDraft.value
  if (!draft) return
  form.snakeJudgment = draft.snakeName
  form.serumName = draft.serumName
  form.serumDose = draft.serumDose
  form.treatment = [
    `${draft.severity}；${draft.toxinTendency}`,
    ...draft.actions,
    draft.notes
  ].filter(Boolean).join('；')
  form.doctorName = ev.value?.assignedDoctor ?? '王医生'
  form.recordedAt = ''
  form.diagnosisNote = draft.notes || defaultDiagnosisNote
  form.medications = defaultMedication()
  form.labSummary = defaultLabSummary
  form.imagingSummary = defaultImagingSummary()
  form.vitalSigns = defaultVitalSigns
  form.attachments = createDefaultVisitAttachments()
}

function resetForm() {
  form.snakeJudgment = '五步蛇'
  form.serumName = '抗五步蛇毒血清'
  form.serumDose = '8000U 静滴'
  form.treatment = defaultTreatment
  form.diagnosisNote = ''
  form.medications = ''
  form.labSummary = ''
  form.imagingSummary = ''
  form.vitalSigns = ''
  form.attachments = createDefaultVisitAttachments()
  form.doctorName = ev.value?.assignedDoctor ?? '王医生'
  form.recordedAt = ''
  form.sourceDiagnosisAt = undefined
  fillDefaultSupplements()
}

watch(
  [
    () => ev.value?.id,
    () => diagnosisDraft.value?.confirmedAt,
    () => ev.value?.visitRecord?.recordedAt
  ],
  () => {
    if (usesFreshDraft.value) {
      fillFromDraft()
      return
    }

    if (ev.value?.visitRecord) {
      Object.assign(form, ev.value.visitRecord)
      if (!form.attachments?.length) form.attachments = createDefaultVisitAttachments()
    } else {
      resetForm()
      fillFromDraft()
      fillDefaultSupplements()
    }
  },
  { immediate: true }
)

function onSnakeChange(name: string) {
  const snake = snakeTypes.find((s) => s.name === name)
  if (snake) {
    form.serumName = snake.serumName
    form.serumDose = snake.venomous
      ? (snake.dangerLevel === 3 ? '8000U 静滴' : '6000U 静滴')
      : '暂不使用血清，留观复评'
  }
  if (!form.medications || form.medications.includes('清创、制动、留观复评')) {
    form.medications = defaultMedication()
  }
}

function save() {
  if (!form.snakeJudgment) {
    ElMessage.warning('请填写蛇种判定')
    return
  }
  if (!ev.value) return
  const isUpdate = Boolean(ev.value.visitRecord)
  form.recordedAt = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  rescue.saveVisitRecord(ev.value.id, {
    ...form,
    attachments: form.attachments.map((attachment) => ({ ...attachment }))
  })
  ElMessage.success(isUpdate ? '治疗记录已更新' : '就诊记录已保存，进入治疗中')
  router.push(`/doctor/patient-realtime/${ev.value.id}`)
}
</script>

<template>
  <div v-if="!ev" class="empty">
    <el-result icon="warning" title="未找到求救事件">
      <template #extra><el-button @click="router.push('/doctor/rescue')">返回工作台</el-button></template>
    </el-result>
  </div>

  <div v-else class="visit-record">
    <div class="page-head">
      <el-button link @click="router.push(`/doctor/patient-realtime/${ev.id}`)"><el-icon><ArrowLeft /></el-icon> 返回患者视图</el-button>
      <h2>就诊记录 · {{ ev.patientName }} · {{ ev.id }}</h2>
    </div>

    <el-row :gutter="16">
      <el-col :span="11">
        <el-card shadow="never" class="report-card">
          <template #header><span class="bt">患者上报信息</span></template>
          <div v-if="!ev.report" class="no-report">患者尚未上报现场信息，可先补录关键病史。</div>
          <template v-else>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="当前症状">{{ ev.report.symptoms }}</el-descriptions-item>
              <el-descriptions-item label="自救措施">{{ ev.report.selfRescue || '—' }}</el-descriptions-item>
              <el-descriptions-item label="咬伤时间">{{ ev.report.bittenTime || '—' }}</el-descriptions-item>
              <el-descriptions-item label="蛇的描述">{{ ev.report.snakeDescription || '—' }}</el-descriptions-item>
              <el-descriptions-item label="地点">{{ ev.location }}</el-descriptions-item>
            </el-descriptions>
            <div v-if="ev.report.hasPhoto" class="report-photo">
              <img :src="ev.report.photoUrl" alt="患者上传现场照片" />
              <span>患者上传现场照片</span>
            </div>
            <div class="report-media">
              <el-tag v-if="ev.report.hasPhoto" type="success" effect="plain">
                <el-icon><PictureFilled /></el-icon>
                伤口/蛇照片
              </el-tag>
              <el-tag v-if="ev.report.voiceSeconds" type="info" effect="plain">
                <el-icon><Microphone /></el-icon>
                语音 {{ ev.report.voiceSeconds }}s
              </el-tag>
              <span v-if="!ev.report.hasPhoto && !ev.report.voiceSeconds" class="no-media">无多媒体附件</span>
            </div>
          </template>
        </el-card>

        <el-card shadow="never">
          <template #header><span class="bt">数据流转</span></template>
          <div class="manual">
            <div class="flow-steps">
              <div class="flow-step done">
                <span>1</span>
                <b>现场信息</b>
                <em>{{ ev.report ? '已上报' : '待补录' }}</em>
              </div>
              <div class="flow-line" />
              <div class="flow-step" :class="{ done: form.snakeJudgment }">
                <span>2</span>
                <b>记录内判定</b>
                <em>{{ form.snakeJudgment ? '已填写' : '待填写' }}</em>
              </div>
              <div class="flow-line" />
              <div class="flow-step" :class="{ done: ev.visitRecord }">
                <span>3</span>
                <b>正式归档</b>
                <em>{{ ev.visitRecord ? ev.visitRecord.recordedAt : '未保存' }}</em>
              </div>
            </div>
            <el-alert
              v-if="diagnosisDraft"
              :type="usesFreshDraft ? 'success' : 'info'"
              :closable="false"
              show-icon
              :title="usesFreshDraft ? '已带入上一页蛇伤判定' : '当前记录已关联蛇伤判定'"
              :description="`${diagnosisDraft.snakeName} · ${diagnosisDraft.severity} · 规则分 ${diagnosisDraft.ruleScore} · ${diagnosisDraft.confirmedAt}`"
            />
            <el-alert
              v-else
              type="info"
              :closable="false"
              show-icon
              title="V1 已合并判定与就诊记录"
              description="医生在本页直接完成最终蛇种、血清用量和处置记录；独立规则表单移至 V3 作为复盘与智能化增强入口。"
            />
            <div v-if="diagnosisDraft" class="draft-card">
              <div class="draft-head">
                <div>
                  <span>判定结论</span>
                  <b>{{ diagnosisDraft.snakeName }} / {{ diagnosisDraft.severity }}</b>
                </div>
                <el-tag effect="plain">{{ diagnosisDraft.toxinTendency }}</el-tag>
              </div>
              <div class="draft-grid">
                <div><span>血清</span><b>{{ diagnosisDraft.serumName }}</b></div>
                <div><span>用量</span><b>{{ diagnosisDraft.serumDose }}</b></div>
              </div>
              <div class="draft-actions">
                <span>带入处置建议</span>
                <ul>
                  <li v-for="item in diagnosisDraft.actions" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
            <div class="manual-row"><span>缺失检验/影像</span><b>先手填关键结论，V2 HIS/LIS/PACS 接入后自动补全</b></div>
            <div class="manual-row"><span>蛇种判定</span><b>V1 在就诊记录内完成，不强制医生先走独立判定页</b></div>
            <div class="manual-block"><span>处置记录</span><p>记录清创、破伤风、血清名称与用量、留观时长、凝血/肾功能监测等核心信息。</p></div>
            <el-alert
              type="info"
              :closable="false"
              show-icon
              title="V1 不依赖 AI"
              description="当前页面保留人工录入能力；AI 初诊建议和治疗路径在 V3 作为增强能力接入。"
            />
          </div>
        </el-card>

        <el-card shadow="never" class="ref-card">
          <template #header><span class="bt">相似历史病例（专病库）</span></template>
          <div class="ref-item">EV-097 赵秀兰 · 竹叶青 · 抗蝮蛇毒血清 6000U · 留观 24h 痊愈</div>
          <div class="ref-item">EV-082 周国强 · 竹叶青 · 抗蝮蛇毒血清 4000U · 痊愈</div>
        </el-card>
      </el-col>

      <el-col :span="13">
        <el-card shadow="never">
          <template #header><span class="bt">蛇种判定与就诊记录</span></template>
          <el-alert
            type="success"
            :closable="false"
            show-icon
            class="record-mode-alert"
            title="治疗中可多次补录；确认出院后作为最终记录展示。"
          />
          <el-form :model="form" label-position="top">
            <el-form-item label="最终蛇种判定（记录内完成）" required>
              <el-select v-model="form.snakeJudgment" placeholder="选择蛇种" style="width: 100%" @change="onSnakeChange">
                <el-option v-for="s in snakeTypes" :key="s.id" :value="s.name" :label="s.name" />
              </el-select>
            </el-form-item>
            <el-form-item label="使用血清">
              <el-input v-model="form.serumName" placeholder="如：抗蝮蛇毒血清" />
            </el-form-item>
            <el-form-item label="血清用量">
              <el-input v-model="form.serumDose" placeholder="如：6000U 静滴" />
            </el-form-item>
            <el-form-item label="其它处置">
              <el-input v-model="form.treatment" type="textarea" :rows="4" placeholder="清创、破伤风、留观、监测项目等" />
            </el-form-item>
            <el-divider content-position="left">V1 手填补录</el-divider>
            <el-alert
              type="info"
              :closable="false"
              show-icon
              class="supplement-alert"
              title="诊断、用药、检验、影像/附件和生命体征先由医生手填；V2 接入 HIS/LIS/PACS 后自动补全。"
            />
            <el-form-item label="诊断说明 / 鉴别依据">
              <el-input v-model="form.diagnosisNote" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="用药记录">
              <el-input v-model="form.medications" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="检验摘要">
              <el-input v-model="form.labSummary" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="影像 / 附件摘要">
              <el-input v-model="form.imagingSummary" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item label="生命体征摘要">
              <el-input v-model="form.vitalSigns" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item label="图片附件">
              <div class="attachment-grid">
                <div v-for="attachment in form.attachments" :key="attachment.id" class="attachment-card">
                  <img :src="attachment.url" :alt="attachment.name" />
                  <div class="attachment-body">
                    <div class="attachment-head">
                      <b>{{ attachment.name }}</b>
                      <el-tag size="small" effect="plain">{{ attachment.type }}</el-tag>
                    </div>
                    <p>{{ attachment.note }}</p>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="记录医生">
              <el-input v-model="form.doctorName" style="width: 200px" />
            </el-form-item>
          </el-form>
          <div class="form-actions">
            <el-button type="primary" @click="save">{{ saveButtonText }}</el-button>
            <span class="hint">{{ saveHintText }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.empty { padding-top: 60px; }
.page-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 18px; }
.bt { font-weight: 600; }

.report-card { margin-bottom: 16px; }
.no-report { color: #909399; font-size: 13px; padding: 6px 0; }
.report-photo { border: 1px solid #ebeef5; border-radius: 8px; overflow: hidden; background: #f8fbff; margin-top: 10px; }
.report-photo img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.report-photo span { display: block; padding: 6px 8px; font-size: 12px; color: #606266; }
.report-media { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }
.report-media .el-tag { display: inline-flex; align-items: center; gap: 4px; }
.no-media { font-size: 12px; color: #c0c4cc; }

.manual { display: flex; flex-direction: column; gap: 10px; }
.flow-steps { display: flex; align-items: stretch; gap: 8px; padding: 10px; border: 1px solid #ebeef5; border-radius: 8px; background: #fafcff; }
.flow-step { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; align-items: center; text-align: center; }
.flow-step span { width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; background: #e4e7ed; color: #606266; font-size: 12px; font-weight: 700; }
.flow-step b { font-size: 13px; color: #303133; line-height: 1.4; }
.flow-step em { font-size: 12px; color: #909399; font-style: normal; }
.flow-step.done span { background: #67c23a; color: #fff; }
.flow-line { width: 24px; height: 1px; background: #dcdfe6; align-self: center; }
.draft-card { border: 1px solid #d9ecff; background: #f8fbff; border-radius: 8px; padding: 12px; }
.draft-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 10px; }
.draft-head span, .draft-grid span, .draft-actions span { display: block; font-size: 12px; color: #909399; margin-bottom: 3px; }
.draft-head b, .draft-grid b { font-size: 14px; color: #303133; line-height: 1.5; }
.draft-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 10px; }
.draft-actions ul { margin: 0; padding-left: 18px; }
.draft-actions li { font-size: 13px; color: #606266; line-height: 1.6; }
.manual-row { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.manual-row span, .manual-block span { color: #909399; }
.manual-row b { color: #303133; font-weight: 600; line-height: 1.5; }
.manual-block p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; color: #606266; }

.ref-card { margin-top: 16px; }
.ref-item { font-size: 13px; padding: 6px 0; border-bottom: 1px dashed #ebeef5; color: #606266; }
.ref-item:last-child { border-bottom: none; }

.form-actions { display: flex; align-items: center; gap: 12px; }
.form-actions .hint { font-size: 12px; color: #909399; }
.record-mode-alert { margin-bottom: 14px; }
.record-mode-alert :deep(.el-alert__title) { line-height: 1.5; }
.supplement-alert { margin-bottom: 14px; }
.supplement-alert :deep(.el-alert__title) { line-height: 1.5; }
.attachment-grid { width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.attachment-card { border: 1px solid #ebeef5; border-radius: 8px; overflow: hidden; background: #fff; min-width: 0; }
.attachment-card img { display: block; width: 100%; aspect-ratio: 4 / 3; object-fit: cover; background: #f5f7fa; }
.attachment-body { padding: 9px; }
.attachment-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 6px; }
.attachment-head b { font-size: 13px; line-height: 1.4; color: #303133; word-break: break-word; }
.attachment-body p { margin: 6px 0 0; font-size: 12px; line-height: 1.5; color: #606266; }

@media (max-width: 1100px) {
  .flow-steps { flex-direction: column; }
  .flow-line { width: 1px; height: 14px; }
  .draft-grid { grid-template-columns: 1fr; }
  .attachment-grid { grid-template-columns: 1fr; }
}
</style>
