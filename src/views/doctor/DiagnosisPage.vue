<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRescueStore } from '@/stores/rescue'
import { snakeTypes } from '@/mock/data'
import { agentDiagnosis } from '@/mock/clinical'
import AlgoPlaceholder from '@/components/AlgoPlaceholder.vue'
import MockDataLabel from '@/components/MockDataLabel.vue'

const route = useRoute()
const router = useRouter()
const rescue = useRescueStore()

const eventId = computed(() => {
  const id = route.params.id as string
  if (id && id !== 'demo') return id
  return rescue.currentEvent?.id ?? rescue.activeEvents[0]?.id ?? ''
})
const ev = computed(() => rescue.getEvent(eventId.value))

const form = reactive({
  snakeId: '',
  serum: '',
  dose: '',
  notes: ''
})

function adopt() {
  const top = agentDiagnosis.rankings[0]
  form.snakeId = top.snakeId
  form.serum = agentDiagnosis.recommendedSerum
  form.dose = agentDiagnosis.recommendedDose
  ElMessage.success('已采纳 Agent 建议，可在此基础上修改')
}

function confirm() {
  if (!form.snakeId) { ElMessage.warning('请选择最终蛇种判定'); return }
  ElMessage.success('判定已确认，可继续填写就诊记录')
  if (ev.value) router.push(`/doctor/visit-record/${ev.value.id}`)
}
</script>

<template>
  <div class="diag-page">
    <div class="page-head">
      <div>
        <h2>
          蛇伤判定（AI 占位）
          <span class="priority-tag v2">v2</span>
        </h2>
        <p class="sub">{{ ev ? `${ev.patientName} · ${ev.id}` : '请从救助工作台进入具体患者' }} · V2 阶段：AI 仅辅助不诊断，医生最终决策</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16">
      <el-col :span="13">
        <AlgoPlaceholder kind="agent" title="[V2] 蛇伤判定 Agent" description="V2 阶段占位：融合图像识别 + 症状 + 流行病学，给出蛇种排序与处置建议。当前仅展示 Mock 数据。">
          <div class="rankings">
            <div v-for="r in agentDiagnosis.rankings" :key="r.snakeId" class="rk">
              <div class="rk-top">
                <span class="rk-name">{{ r.snakeName }}</span>
                <span class="rk-conf">{{ r.confidence }}%</span>
              </div>
              <el-progress :percentage="r.confidence" :stroke-width="8" :show-text="false"
                :color="r.confidence > 50 ? '#67c23a' : '#e6a23c'" />
              <div class="rk-basis">{{ r.basis }}</div>
            </div>
          </div>

          <div class="advice">
            <div class="ad-row"><span>建议血清</span><b>{{ agentDiagnosis.recommendedSerum }}</b></div>
            <div class="ad-row"><span>建议用量</span><b>{{ agentDiagnosis.recommendedDose }}</b></div>
          </div>

          <div class="reasoning">
            <div class="rs-title">推理链</div>
            <ol><li v-for="(s, i) in agentDiagnosis.reasoning" :key="i">{{ s }}</li></ol>
          </div>

          <el-button type="warning" plain size="small" @click="adopt">采纳建议 →</el-button>
        </AlgoPlaceholder>

        <el-alert
          v-for="(a, i) in agentDiagnosis.riskAlerts" :key="i"
          type="error" :closable="false" show-icon :title="a" class="risk"
        />
      </el-col>

      <el-col :span="11">
        <el-card shadow="never">
          <template #header><span class="bt">医生最终判定</span></template>
          <el-form label-width="92px">
            <el-form-item label="最终蛇种">
              <el-select v-model="form.snakeId" placeholder="选择蛇种" style="width:100%">
                <el-option v-for="s in snakeTypes" :key="s.id" :label="s.name" :value="s.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="使用血清">
              <el-input v-model="form.serum" placeholder="如：抗蝮蛇毒血清" />
            </el-form-item>
            <el-form-item label="用量">
              <el-input v-model="form.dose" placeholder="如：6000U 静滴" />
            </el-form-item>
            <el-form-item label="判定说明">
              <el-input v-model="form.notes" type="textarea" :rows="3" placeholder="补充依据 / 与 Agent 不一致的原因" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="confirm">确认判定并填写就诊记录</el-button>
            </el-form-item>
          </el-form>
          <div class="audit">
            <el-tag size="small" type="warning" effect="plain">V2</el-tag>
            医生采纳/否决会回流为 Agent 训练样本（采纳率见 P223 历史判定复盘 · V3）
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.bt { font-weight: 600; }
.rankings { display: flex; flex-direction: column; gap: 12px; }
.rk-top { display: flex; justify-content: space-between; font-size: 14px; }
.rk-name { font-weight: 600; }
.rk-conf { color: #67c23a; font-weight: 600; }
.rk-basis { font-size: 12px; color: #909399; margin-top: 4px; }
.advice { background: #fff; border-radius: 6px; padding: 10px 12px; margin: 12px 0; }
.ad-row { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
.ad-row span { color: #909399; }
.reasoning { margin-bottom: 12px; }
.rs-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
.reasoning ol { padding-left: 18px; margin: 0; }
.reasoning li { font-size: 12px; color: #606266; margin: 3px 0; line-height: 1.5; }
.risk { margin-bottom: 8px; }
.audit { font-size: 12px; color: #c0c4cc; margin-top: 8px; line-height: 1.5; }
</style>
