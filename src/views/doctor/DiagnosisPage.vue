<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRescueStore } from '@/stores/rescue'
import { getHospital, snakeTypes } from '@/mock/data'
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

const signOptions = [
  { key: 'fang', label: '双牙痕/明确咬伤', group: '现场', weight: 1 },
  { key: 'swelling', label: '局部肿胀快速进展', group: '局部', weight: 2 },
  { key: 'bleeding', label: '出血点/凝血异常', group: '血循毒', weight: 2 },
  { key: 'ptosis', label: '眼睑下垂/复视', group: '神经毒', weight: 2 },
  { key: 'breath', label: '胸闷/呼吸困难', group: '神经毒', weight: 3 },
  { key: 'shock', label: '低血压/休克表现', group: '危重', weight: 3 }
]

const form = reactive({
  signs: ['fang', 'swelling', 'bleeding'],
  snakeId: 'sn-03',
  serum: '抗蝮蛇毒血清',
  dose: '6000U 静滴',
  notes: '局部肿胀进展，伴出血倾向；先按血循毒蛇伤处理，动态复核凝血与肾功能。'
})

const selectedSnake = computed(() => snakeTypes.find((s) => s.id === form.snakeId))
const selectedHospital = computed(() => getHospital(ev.value?.selectedHospitalId ?? 'h-01') ?? getHospital('h-01'))
const stockCount = computed(() => {
  if (!selectedSnake.value || !selectedHospital.value) return 0
  return selectedHospital.value.serumStock[selectedSnake.value.id] ?? 0
})

const ruleScore = computed(() => {
  const signScore = signOptions
    .filter((item) => form.signs.includes(item.key))
    .reduce((sum, item) => sum + item.weight, 0)
  return signScore + (selectedSnake.value?.dangerLevel ?? 1)
})

const severity = computed(() => {
  if (ruleScore.value >= 9) return { label: '危重', type: 'danger', desc: '立即抢救，评估 ICU/上级医院支援' }
  if (ruleScore.value >= 6) return { label: '重症', type: 'warning', desc: '尽快使用对应血清，严密监测凝血、肾功能和呼吸' }
  return { label: '中轻症', type: 'success', desc: '留观、复评体征，按蛇种与症状决定是否用血清' }
})

const toxinTendency = computed(() => {
  const hasNeuro = form.signs.includes('ptosis') || form.signs.includes('breath')
  const hasBlood = form.signs.includes('bleeding') || form.signs.includes('swelling')
  if (hasNeuro && hasBlood) return '混合风险：同时排查神经毒与血循毒'
  if (hasNeuro) return '神经毒倾向：重点排查银环蛇/眼镜蛇'
  if (hasBlood) return '血循毒倾向：重点排查蝮蛇/竹叶青/五步蛇'
  return '信息不足：继续补录照片、症状和生命体征'
})

const actions = computed(() => {
  const items = ['拍照留存伤口和蛇体线索', '记录咬伤时间、部位、既往过敏史']
  if (selectedSnake.value?.venomous) {
    items.push(`准备 ${selectedSnake.value.serumName}`)
    items.push('抽血复查血常规、凝血、肝肾功能')
  }
  if (form.signs.includes('breath')) items.push('床旁监测呼吸，准备气道支持')
  if (form.signs.includes('shock')) items.push('开放静脉通路，按危重症流程处理')
  if (stockCount.value <= 0 && selectedSnake.value?.venomous) items.push('本院库存不足，联系有库存医院/转诊')
  return items
})

function syncSerum() {
  if (!selectedSnake.value) return
  form.serum = selectedSnake.value.serumName
  if (!selectedSnake.value.venomous) {
    form.dose = '暂不使用血清，留观复评'
  } else if (selectedSnake.value.dangerLevel === 3 || severity.value.label === '危重') {
    form.dose = '8000U 静滴，按说明书与病情复评'
  } else {
    form.dose = '6000U 静滴，按病情复评'
  }
}

function confirm() {
  if (!form.snakeId) {
    ElMessage.warning('请选择最终蛇种判定')
    return
  }
  if (!ev.value || !selectedSnake.value) return
  rescue.saveDiagnosisDraft(ev.value.id, {
    snakeId: selectedSnake.value.id,
    snakeName: selectedSnake.value.name,
    signs: [...form.signs],
    severity: severity.value.label,
    ruleScore: ruleScore.value,
    toxinTendency: toxinTendency.value,
    serumName: form.serum,
    serumDose: form.dose,
    notes: form.notes,
    actions: [...actions.value],
    confirmedAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  })
  ElMessage.success('判定已确认，可继续填写就诊记录')
  router.push(`/doctor/visit-record/${ev.value.id}`)
}
</script>

<template>
  <div class="diag-page">
    <div class="page-head">
      <div>
        <h2>蛇伤判定（规则表单）</h2>
        <p class="sub">{{ ev ? `${ev.patientName} · ${ev.id}` : '请从救助工作台进入具体患者' }} · V3 用于规则判定复盘与智能化增强</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16">
      <el-col :span="15">
        <el-card shadow="never" class="rule-card">
          <template #header><span class="bt">1. 症状 / 体征核对</span></template>
          <el-checkbox-group v-model="form.signs" class="sign-grid">
            <label v-for="item in signOptions" :key="item.key" class="sign-item">
              <el-checkbox :value="item.key">
                <span class="sign-title">{{ item.label }}</span>
                <span class="sign-group">{{ item.group }}</span>
              </el-checkbox>
            </label>
          </el-checkbox-group>
        </el-card>

        <el-row :gutter="12" class="summary-row">
          <el-col :span="8">
            <div class="summary-card">
              <span>规则分</span>
              <strong>{{ ruleScore }}</strong>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="summary-card">
              <span>严重度</span>
              <el-tag :type="severity.type as any">{{ severity.label }}</el-tag>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="summary-card">
              <span>血清库存</span>
              <strong :class="{ danger: stockCount <= 0 }">{{ stockCount }} 支</strong>
            </div>
          </el-col>
        </el-row>

        <el-card shadow="never" class="rule-card">
          <template #header><span class="bt">2. 规则推导</span></template>
          <div class="result-line">
            <span>毒性倾向</span>
            <b>{{ toxinTendency }}</b>
          </div>
          <div class="result-line">
            <span>处置级别</span>
            <b>{{ severity.desc }}</b>
          </div>
          <el-divider />
          <div class="action-title">建议处置清单</div>
          <ol class="action-list">
            <li v-for="item in actions" :key="item">{{ item }}</li>
          </ol>
          <el-alert
            type="info"
            :closable="false"
            show-icon
            class="v2-note"
            title="V3 AI 辅助占位"
            description="后续可接入图像识别、历史复盘和辅助建议，但页面明确仅辅助不诊断，医生保留最终确认权。"
          />
        </el-card>
      </el-col>

      <el-col :span="9">
        <el-card shadow="never" class="decision-card">
          <template #header><span class="bt">3. 医生最终判定</span></template>
          <el-form label-position="top">
            <el-form-item label="最终蛇种">
              <el-select v-model="form.snakeId" placeholder="选择蛇种" style="width:100%" @change="syncSerum">
                <el-option v-for="s in snakeTypes" :key="s.id" :label="s.name" :value="s.id">
                  <span>{{ s.name }}</span>
                  <span class="option-meta">{{ s.serumName }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <div class="serum-box">
              <div>
                <span>匹配血清</span>
                <b>{{ form.serum }}</b>
              </div>
              <el-tag :type="stockCount > 0 ? 'success' : 'danger'" effect="plain">
                {{ selectedHospital?.name }} · {{ stockCount > 0 ? `库存 ${stockCount} 支` : '库存不足' }}
              </el-tag>
            </div>
            <el-form-item label="建议用量">
              <el-input v-model="form.dose" />
            </el-form-item>
            <el-form-item label="判定说明">
              <el-input v-model="form.notes" type="textarea" :rows="5" placeholder="补充依据、体征、照片观察、血清选择理由" />
            </el-form-item>
            <el-button type="primary" class="full" @click="confirm">确认判定并填写就诊记录</el-button>
          </el-form>
          <div class="audit">V3 记录结构化判定过程，并与 AI 建议、图像识别和历史判定复盘联动。</div>
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
.rule-card { margin-bottom: 16px; }
.sign-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.sign-item { border: 1px solid #ebeef5; border-radius: 8px; padding: 10px 12px; background: #fff; }
.sign-item :deep(.el-checkbox) { width: 100%; height: auto; align-items: flex-start; }
.sign-item :deep(.el-checkbox__label) { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; white-space: normal; }
.sign-title { font-size: 13px; font-weight: 600; color: #303133; line-height: 1.4; }
.sign-group { flex: 0 0 auto; font-size: 12px; color: #909399; background: #f5f7fa; border-radius: 999px; padding: 2px 8px; }
.summary-row { margin-bottom: 16px; }
.summary-card { min-height: 72px; border-radius: 8px; padding: 12px; background: #f8fbff; border: 1px solid #d9ecff; display: flex; flex-direction: column; justify-content: space-between; }
.summary-card span { font-size: 12px; color: #909399; }
.summary-card strong { font-size: 22px; color: #303133; }
.summary-card strong.danger { color: #f56c6c; }
.result-line { display: flex; gap: 12px; margin-bottom: 10px; font-size: 13px; line-height: 1.6; }
.result-line span { flex: 0 0 70px; color: #909399; }
.result-line b { color: #303133; }
.action-title { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.action-list { margin: 0; padding-left: 20px; }
.action-list li { font-size: 13px; color: #606266; line-height: 1.7; }
.v2-note { margin-top: 12px; }
.decision-card { position: sticky; top: 12px; }
.option-meta { float: right; color: #909399; font-size: 12px; }
.serum-box { display: flex; flex-direction: column; gap: 8px; padding: 10px 12px; margin-bottom: 14px; border-radius: 8px; background: #f5f7fa; }
.serum-box span { display: block; font-size: 12px; color: #909399; margin-bottom: 4px; }
.serum-box b { font-size: 14px; color: #303133; }
.full { width: 100%; }
.audit { font-size: 12px; color: #c0c4cc; margin-top: 10px; line-height: 1.5; }
</style>
