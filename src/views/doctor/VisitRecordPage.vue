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

const eventId = computed(() => route.params.id as string)
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

const form = reactive<VisitRecord>({
  snakeJudgment: '',
  serumName: '',
  serumDose: '',
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

    <el-row :gutter="16">
      <el-col :span="11">
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
