<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import AlgoPlaceholder from '@/components/AlgoPlaceholder.vue'
import { useCareStore } from '@/stores/care'
import { surveyQuestions } from '@/mock/care'

const router = useRouter()
const care = useCareStore()

function save() {
  ElMessage.success('已暂存，可稍后继续填写')
}
function submit() {
  if (care.surveyProgress < 100) {
    ElMessage.warning('还有未完成的题目')
    return
  }
  care.submitSurvey()
  ElMessage.success('问卷已提交，结果同步至随访档案')
}
</script>

<template>
  <div class="survey-page">
    <PhoneNavBar title="随访问卷" back="/patient/care/timeline" />

    <div v-if="care.surveySubmitted" class="done">
      <el-result icon="success" title="问卷已提交" sub-title="医生会结合您的回答调整随访计划">
        <template #extra>
          <el-button type="primary" @click="router.push('/patient/care/timeline')">返回随访计划</el-button>
        </template>
      </el-result>
    </div>

    <div v-else class="body">
      <div class="progress-bar">
        <span>完成度</span>
        <el-progress :percentage="care.surveyProgress" :stroke-width="10" style="flex:1" />
      </div>

      <div class="card" v-for="(q, i) in surveyQuestions" :key="q.id">
        <div class="q-title">{{ i + 1 }}. {{ q.text }}</div>

        <el-radio-group
          v-if="q.type === 'single'"
          :model-value="care.surveyAnswers[q.id] as string"
          @update:model-value="(v: any) => care.setAnswer(q.id, v)"
          class="opts"
        >
          <el-radio v-for="o in q.options" :key="o" :value="o" border>{{ o }}</el-radio>
        </el-radio-group>

        <div v-else-if="q.type === 'scale'" class="scale">
          <el-slider
            :model-value="(care.surveyAnswers[q.id] as number) ?? 0"
            @update:model-value="(v: any) => care.setAnswer(q.id, v)"
            :max="10" show-stops :marks="{ 0: '无痛', 10: '剧痛' }"
          />
        </div>

        <el-input
          v-else
          type="textarea" :rows="2" placeholder="选填"
          :model-value="care.surveyAnswers[q.id] as string"
          @update:model-value="(v: any) => care.setAnswer(q.id, v)"
        />
      </div>

      <AlgoPlaceholder
        kind="nlp" title="问卷智能解析"
        description="自由文本经 NLP 抽取关键症状，自动结构化进入随访档案并触发风险预警。"
      />

      <div class="actions">
        <el-button size="large" @click="save">暂存</el-button>
        <el-button type="primary" size="large" @click="submit">提交问卷</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.survey-page { min-height: 100%; background: #f0f2f5; }
.done { padding-top: 40px; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.progress-bar { background: #fff; border-radius: 10px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; font-size: 13px; color: #606266; }
.card { background: #fff; border-radius: 10px; padding: 14px; }
.q-title { font-size: 14px; font-weight: 600; margin-bottom: 10px; line-height: 1.5; }
.opts { display: flex; flex-direction: column; gap: 8px; align-items: stretch; }
.opts :deep(.el-radio) { margin-right: 0; }
.scale { padding: 0 10px; }
.actions { display: flex; gap: 10px; }
.actions .el-button { flex: 1; }
</style>
