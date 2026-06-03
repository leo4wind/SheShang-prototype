<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRescueStore } from '@/stores/rescue'
import { snakeTypes, type SnakeType } from '@/mock/data'
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

// 症状选项（规则引擎输入）
const symptomOptions = [
  { label: '局部肿胀明显', value: 'swelling', snakes: ['sn-01', 'sn-03', 'sn-05'] },
  { label: '伤口出血不止', value: 'bleeding', snakes: ['sn-01'] },
  { label: '视力模糊 / 瞳孔异常', value: 'vision', snakes: ['sn-04'] },
  { label: '呼吸困难', value: 'breathing', snakes: ['sn-02', 'sn-04'] },
  { label: '伤口麻木 / 呼吸肌麻痹', value: 'paralysis', snakes: ['sn-02'] },
  { label: '伤口牙痕间距小（<8mm）', value: 'smallBite', snakes: ['sn-03', 'sn-05'] },
  { label: '伤口牙痕间距大（>12mm）', value: 'largeBite', snakes: ['sn-01', 'sn-04'] },
  { label: '全身皮下出血', value: 'hemorrhage', snakes: ['sn-01'] }
]

const biteLocations = ['手指', '手掌', '足背', '足踝', '小腿', '前臂', '其他']

const form = reactive({
  selectedSymptoms: [] as string[],
  biteLocation: '',
  biteTime: '',
  notes: ''
})

const result = ref<{
  snake: SnakeType
  confidence: number
  matchedRules: string[]
  serum: string
  dose: string
} | null>(null)

function judgeByRules() {
  if (form.selectedSymptoms.length === 0) {
    ElMessage.warning('请至少勾选一项症状')
    return
  }

  // 规则匹配：统计每个蛇种命中的症状数
  const scoreMap: Record<string, { count: number; rules: string[] }> = {}
  for (const opt of symptomOptions) {
    if (form.selectedSymptoms.includes(opt.value)) {
      for (const sid of opt.snakes) {
        if (!scoreMap[sid]) scoreMap[sid] = { count: 0, rules: [] }
        scoreMap[sid].count++
        scoreMap[sid].rules.push(opt.label)
      }
    }
  }

  // 找最高分
  const sorted = Object.entries(scoreMap).sort((a, b) => b[1].count - a[1].count)
  if (sorted.length === 0) {
    ElMessage.info('未匹配到已知蛇种，建议选择「无毒蛇/不确定」')
    return
  }

  const [topId, topData] = sorted[0]
  const snake = snakeTypes.find((s) => s.id === topId)
  if (!snake) return

  const totalSymptoms = form.selectedSymptoms.length
  const confidence = Math.min(95, Math.round((topData.count / totalSymptoms) * 100))

  result.value = {
    snake,
    confidence,
    matchedRules: topData.rules,
    serum: snake.serumName,
    dose: snake.dangerLevel === 3 ? '8000~12000U 静滴' : snake.dangerLevel === 2 ? '4000~8000U 静滴' : '—'
  }
  ElMessage.success('规则判定完成，请确认结果')
}

function confirm() {
  if (!result.value) { ElMessage.warning('请先进行规则判定'); return }
  const targetId = ev.value?.id ?? eventId.value
  if (!targetId) {
    ElMessage.error('未找到关联事件，请从救助工作台进入')
    return
  }
  if (ev.value) {
    rescue.saveDiagnosis(targetId, {
      snakeId: result.value.snake.id,
      snakeName: result.value.snake.name,
      dangerLevel: result.value.snake.dangerLevel,
      confidence: result.value.confidence,
      serum: result.value.serum,
      dose: result.value.dose,
      matchedRules: result.value.matchedRules,
      diagnosedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })
  }
  ElMessage.success('判定已确认，正在跳转就诊记录…')
  router.push(`/doctor/visit-record/${targetId}`)
}
</script>

<template>
  <div class="diag-rule-page">
    <div class="page-head">
      <div>
        <h2>
          蛇伤判定（规则表单）
          <span class="priority-tag v1">v1</span>
        </h2>
        <p class="sub">{{ ev ? `${ev.patientName} · ${ev.id}` : '请从救助工作台进入具体患者' }} · 基于症状规则表人工判定</p>
      </div>
      <MockDataLabel />
    </div>

    <el-alert type="info" :closable="false" show-icon class="v2-hint">
      <template #title>
        V2 将引入 AI 辅助判定（图像识别 + Agent），当前 V1 仅使用规则表单
      </template>
    </el-alert>

    <!-- 患者上报信息 -->
    <el-card v-if="ev?.report" shadow="never" class="report-card">
      <template #header>
        <span class="card-title">患者现场上报</span>
        <el-tag size="small" effect="plain">来自患者端</el-tag>
      </template>
      <el-descriptions :column="2" border size="small">
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
        <span v-if="!ev.report.hasPhoto && !ev.report.voiceSeconds" class="media-none">无</span>
      </div>
    </el-card>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never">
          <template #header>
            <span class="card-title">症状规则表</span>
          </template>

          <el-form label-width="100px">
            <el-form-item label="临床症状">
              <el-checkbox-group v-model="form.selectedSymptoms">
                <el-checkbox
                  v-for="opt in symptomOptions"
                  :key="opt.value"
                  :label="opt.value"
                  border
                  class="symptom-cb"
                >
                  {{ opt.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="咬伤部位">
              <el-select v-model="form.biteLocation" placeholder="选择部位" style="width: 100%">
                <el-option v-for="loc in biteLocations" :key="loc" :label="loc" :value="loc" />
              </el-select>
            </el-form-item>

            <el-form-item label="咬伤时间">
              <el-input v-model="form.biteTime" placeholder="如：2小时前" />
            </el-form-item>

            <el-form-item label="现场照片">
              <div class="photo-placeholder">
                <el-icon :size="24"><Picture /></el-icon>
                <span>拍照上传占位（V1 仅存储，V2 图像识别）</span>
              </div>
            </el-form-item>

            <el-form-item label="补充说明">
              <el-input v-model="form.notes" type="textarea" :rows="2" placeholder="其他观察 / 特殊情况" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="judgeByRules">
                <el-icon><MagicStick /></el-icon>
                根据规则判定
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card shadow="never" class="result-card">
          <template #header>
            <span class="card-title">判定结果</span>
          </template>

          <template v-if="result">
            <div class="result-snake">
              <div class="result-label">推荐蛇种</div>
              <div class="result-value">{{ result.snake.name }}</div>
              <el-tag :type="result.snake.dangerLevel === 3 ? 'danger' : result.snake.dangerLevel === 2 ? 'warning' : 'info'" size="small">
                危险等级 {{ result.snake.dangerLevel }}
              </el-tag>
            </div>

            <el-divider />

            <div class="result-row">
              <span>匹配置信度</span>
              <el-progress :percentage="result.confidence" :stroke-width="10" style="flex:1; margin: 0 12px;" />
              <span>{{ result.confidence }}%</span>
            </div>

            <div class="result-row">
              <span>匹配规则</span>
              <span>{{ result.matchedRules.length }} 条命中</span>
            </div>
            <ul class="matched-rules">
              <li v-for="(r, i) in result.matchedRules" :key="i">{{ r }}</li>
            </ul>

            <el-divider />

            <div class="result-row">
              <span>建议血清</span>
              <b>{{ result.serum }}</b>
            </div>
            <div class="result-row">
              <span>建议用量</span>
              <b>{{ result.dose }}</b>
            </div>

            <el-divider />

            <el-button type="primary" style="width: 100%;" @click="confirm">
              确认判定并填写就诊记录
            </el-button>
          </template>

          <el-empty v-else description="请先在左侧勾选症状后点击「根据规则判定」" :image-size="80" />
        </el-card>

        <el-card shadow="never" class="rule-info">
          <div class="rule-info-title">规则引擎说明</div>
          <p>本页面使用症状规则表进行蛇种初判，基于症状与蛇种的映射关系匹配。医生可根据现场实际情况修正判定结果。</p>
          <p class="rule-note">V2 阶段将引入 AI 图像识别 + Agent 推理链辅助判定。</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.diag-rule-page {
  max-width: 1200px;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.page-head h2 {
  margin: 0;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-head .sub {
  margin: 4px 0 0;
  font-size: 13px;
  color: #909399;
}

.v2-hint {
  margin-bottom: 16px;
}

.report-card {
  margin-bottom: 16px;
}

.report-card :deep(.el-card__header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
}

.report-media {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.media-label {
  color: #909399;
}

.media-none {
  color: #c0c4cc;
  font-size: 12px;
}

.report-photos {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.report-photo {
  width: 160px;
  border-radius: 6px;
  border: 1px solid #ebeef5;
}

.card-title {
  font-weight: 600;
}

.symptom-cb {
  margin-bottom: 8px !important;
}

.photo-placeholder {
  width: 100%;
  height: 80px;
  border: 1px dashed #dcdfe6;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #c0c4cc;
  font-size: 13px;
  background: #fafafa;
}

.result-card {
  margin-bottom: 16px;
}

.result-snake {
  text-align: center;
  padding: 8px 0;
}

.result-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.result-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.result-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  padding: 6px 0;
  color: #606266;
}

.matched-rules {
  padding-left: 18px;
  margin: 4px 0 8px;
  font-size: 12px;
  color: #909399;
}

.matched-rules li {
  margin: 2px 0;
}

.rule-info {
  font-size: 12px;
  color: #909399;
  line-height: 1.6;
}

.rule-info-title {
  font-weight: 600;
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.rule-note {
  color: #e6a23c;
  margin: 8px 0 0;
}
</style>
