<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRescueStore, type VisitRecord } from '@/stores/rescue'
import { snakeTypes, getSnake } from '@/mock/data'
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

// agent 初诊建议（mock）
const agentSuggestion = {
  snakeId: 'sn-03',
  snakeName: '竹叶青',
  confidence: 72,
  serum: '抗蝮蛇毒血清 6000U 静滴',
  plan: '局部清创消毒 + 破伤风抗毒素 + 抗蝮蛇毒血清，留观 24-48h，监测凝血与肾功能',
  notes: '竹叶青为血循毒，关注出血倾向；患者有青霉素过敏史，避免相关抗生素'
}

// 如果有规则判定结果，自动预填
const pending = computed(() => ev.value?.pendingDiagnosis)

const form = reactive<VisitRecord>({
  snakeJudgment: pending.value?.snakeName ?? '',
  serumName: pending.value?.serum ?? '',
  serumDose: pending.value?.dose ?? '',
  treatment: '',
  doctorName: '王医生',
  recordedAt: ''
})

function adoptAgent() {
  const snake = getSnake(agentSuggestion.snakeId)
  form.snakeJudgment = agentSuggestion.snakeName
  form.serumName = snake?.serumName ?? ''
  form.serumDose = '6000U 静滴'
  form.treatment = agentSuggestion.plan
  ElMessage.success('已采纳 Agent 建议，可在此基础上修改')
}

function onSnakeChange(name: string) {
  const snake = snakeTypes.find((s) => s.name === name)
  if (snake) form.serumName = snake.serumName
}

function save() {
  if (!form.snakeJudgment) {
    ElMessage.warning('请填写蛇种判定')
    return
  }
  if (!ev.value) return
  form.recordedAt = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  rescue.saveVisitRecord(ev.value.id, { ...form })
  ElMessage.success('就诊记录已保存，进入治疗中')
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

    <el-alert v-if="pending" type="success" :closable="false" show-icon class="prefill-hint">
      <template #title>
        已从「蛇伤判定（规则表单）」带入：{{ pending.snakeName }} · {{ pending.serum }} · {{ pending.dose }}（置信度 {{ pending.confidence }}%）
      </template>
    </el-alert>

    <el-row :gutter="16">
      <el-col :span="11">
        <el-card v-if="ev.report" shadow="never" class="report-card">
          <template #header>
            <span class="bt">患者现场上报</span>
            <el-tag size="small" effect="plain">来自患者端</el-tag>
          </template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="当前症状">{{ ev.report.symptoms }}</el-descriptions-item>
            <el-descriptions-item label="自救措施">{{ ev.report.selfRescue || '—' }}</el-descriptions-item>
            <el-descriptions-item label="咬伤时间">{{ ev.report.bittenTime || '—' }}</el-descriptions-item>
            <el-descriptions-item label="蛇的描述">{{ ev.report.snakeDescription || '—' }}</el-descriptions-item>
          </el-descriptions>
          <div v-if="ev.report.hasPhoto" class="report-photos">
            <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="report-photo">
              <rect width="240" height="180" fill="#4a7c3f" rx="6"/>
              <rect y="120" width="240" height="60" fill="#3d6b34"/>
              <path d="M30,100 Q60,60 100,85 T170,70 T210,90" stroke="#8B7D3C" stroke-width="10" fill="none" stroke-linecap="round"/>
              <path d="M30,100 Q60,60 100,85 T170,70 T210,90" stroke="#A0904A" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="8,6"/>
              <ellipse cx="210" cy="90" rx="14" ry="10" fill="#8B7D3C" transform="rotate(-15,210,90)"/>
              <circle cx="216" cy="86" r="2.5" fill="#222"/>
              <line x1="224" y1="88" x2="230" y2="84" stroke="#c44" stroke-width="1.2"/>
              <line x1="224" y1="88" x2="230" y2="90" stroke="#c44" stroke-width="1.2"/>
              <rect x="8" y="158" width="100" height="16" rx="3" fill="rgba(0,0,0,0.5)"/>
              <text x="14" y="170" font-size="10" fill="#fff" font-family="monospace">13:50:23</text>
              <rect x="140" y="8" width="92" height="18" rx="3" fill="rgba(230,162,60,0.85)"/>
              <text x="148" y="21" font-size="10" fill="#fff">患者上传 · 蛇</text>
            </svg>
            <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="report-photo">
              <rect width="240" height="180" fill="#D4A574" rx="6"/>
              <ellipse cx="120" cy="90" rx="70" ry="55" fill="#D4A574"/>
              <ellipse cx="115" cy="88" rx="30" ry="22" fill="#c0392b" opacity="0.3"/>
              <ellipse cx="115" cy="88" rx="22" ry="16" fill="#e74c3c" opacity="0.25"/>
              <ellipse cx="108" cy="82" rx="3" ry="5" fill="#8B0000" transform="rotate(-10,108,82)"/>
              <ellipse cx="122" cy="82" rx="3" ry="5" fill="#8B0000" transform="rotate(10,122,82)"/>
              <circle cx="108" cy="88" r="2" fill="#6B0000" opacity="0.7"/>
              <circle cx="122" cy="88" r="2" fill="#6B0000" opacity="0.7"/>
              <rect x="8" y="158" width="100" height="16" rx="3" fill="rgba(0,0,0,0.5)"/>
              <text x="14" y="170" font-size="10" fill="#fff" font-family="monospace">13:51:07</text>
              <rect x="140" y="8" width="92" height="18" rx="3" fill="rgba(230,162,60,0.85)"/>
              <text x="148" y="21" font-size="10" fill="#fff">患者上传 · 伤口</text>
            </svg>
          </div>
          <div class="report-media">
            <span class="media-label">附件：</span>
            <el-tag v-if="ev.report.hasPhoto" size="small" type="success" effect="plain">蛇/伤口照片 ×2</el-tag>
            <el-tag v-if="ev.report.voiceSeconds" size="small" effect="plain">语音 {{ ev.report.voiceSeconds }}s</el-tag>
          </div>
        </el-card>

        <AlgoPlaceholder kind="agent" title="Agent 初诊建议">
          <div class="agent">
            <div class="agent-row"><span>建议蛇种</span><b>{{ agentSuggestion.snakeName }}</b><el-tag size="small" type="warning">置信度 {{ agentSuggestion.confidence }}%</el-tag></div>
            <div class="agent-row"><span>推荐血清</span><b>{{ agentSuggestion.serum }}</b></div>
            <div class="agent-block"><span>治疗方案</span><p>{{ agentSuggestion.plan }}</p></div>
            <div class="agent-block"><span>注意事项</span><p class="notes">{{ agentSuggestion.notes }}</p></div>
            <el-button type="warning" plain size="small" @click="adoptAgent">采纳建议填入右侧</el-button>
          </div>
        </AlgoPlaceholder>

        <el-card shadow="never" class="ref-card">
          <template #header><span class="bt">相似历史病例（专病库）</span></template>
          <div class="ref-item">EV-097 赵秀兰 · 竹叶青 · 抗蝮蛇毒血清 6000U · 留观 24h 痊愈</div>
          <div class="ref-item">EV-082 周国强 · 竹叶青 · 抗蝮蛇毒血清 4000U · 痊愈</div>
        </el-card>
      </el-col>

      <el-col :span="13">
        <el-card shadow="never">
          <template #header><span class="bt">医生最终判定与处置</span></template>
          <el-form :model="form" label-position="top">
            <el-form-item label="最终蛇种判定" required>
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
            <el-form-item label="记录医生">
              <el-input v-model="form.doctorName" style="width: 200px" />
            </el-form-item>
          </el-form>
          <div class="form-actions">
            <el-button type="primary" @click="save">保存就诊记录</el-button>
            <span class="hint">保存后该记录将进入数据治理管线（主线 2）</span>
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
.prefill-hint { margin-bottom: 16px; }
.report-card { margin-bottom: 16px; }
.report-card :deep(.el-card__header) { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; }
.report-photos { display: flex; gap: 10px; margin-top: 10px; }
.report-photo { width: 160px; border-radius: 6px; border: 1px solid #ebeef5; }
.report-media { margin-top: 10px; display: flex; align-items: center; gap: 8px; font-size: 13px; }
.media-label { color: #909399; }
.bt { font-weight: 600; }

.agent { display: flex; flex-direction: column; gap: 8px; }
.agent-row { display: flex; align-items: center; gap: 8px; font-size: 13px; }
.agent-row span { color: #909399; width: 64px; }
.agent-block span { color: #909399; font-size: 13px; }
.agent-block p { margin: 4px 0 0; font-size: 13px; line-height: 1.5; }
.agent-block .notes { color: #e6a23c; }

.ref-card { margin-top: 16px; }
.ref-item { font-size: 13px; padding: 6px 0; border-bottom: 1px dashed #ebeef5; color: #606266; }
.ref-item:last-child { border-bottom: none; }

.form-actions { display: flex; align-items: center; gap: 12px; }
.form-actions .hint { font-size: 12px; color: #909399; }
</style>
