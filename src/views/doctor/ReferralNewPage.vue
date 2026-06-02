<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCollabStore } from '@/stores/collab'
import { hospitals, patientBriefs, snakeTypes, getHospital } from '@/mock/data'

const router = useRouter()
const collab = useCollabStore()

// 可转诊医院：排除本院、有资质优先
const targetHospitals = computed(() =>
  hospitals.filter((h) => h.id !== 'h-01' && h.hasQualification)
)

const form = reactive({
  patientId: 'p-08',
  toHospitalId: '',
  reason: '',
  urgency: '紧急' as '一般' | '紧急' | '危急',
  transport: '120 救护车'
})

const selectedPatient = computed(() => patientBriefs.find((p) => p.id === form.patientId))

function serumSummary(hospitalId: string): string {
  const h = getHospital(hospitalId)
  if (!h) return ''
  const items = snakeTypes
    .filter((s) => s.venomous && (h.serumStock[s.id] ?? 0) > 0)
    .map((s) => `${s.name}×${h.serumStock[s.id]}`)
  return items.length ? items.join('、') : '无血清库存'
}

function submit() {
  if (!form.toHospitalId) { ElMessage.warning('请选择接收医院'); return }
  if (!form.reason) { ElMessage.warning('请填写转诊原因'); return }
  const p = selectedPatient.value!
  const h = getHospital(form.toHospitalId)!
  const r = collab.createReferral({
    patientId: p.id,
    patientName: p.name,
    toHospitalId: form.toHospitalId,
    toHospitalName: h.name,
    reason: form.reason,
    urgency: form.urgency,
    transport: form.transport,
    snapshot: `${p.severity} · ${p.diagnosis}`
  })
  ElMessage.success('转诊申请已发出，已推送接收医院')
  router.push(`/doctor/referral/${r.id}`)
}
</script>

<template>
  <div class="referral-new">
    <div class="page-head">
      <h2>转诊申请</h2>
      <p class="sub">重症或本院无对应血清时，转诊到上级 / 有血清的医院</p>
    </div>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never">
          <template #header><span class="bt">填写转诊信息</span></template>
          <el-form :model="form" label-width="100px">
            <el-form-item label="转诊患者">
              <el-select v-model="form.patientId" style="width: 100%">
                <el-option
                  v-for="p in patientBriefs"
                  :key="p.id"
                  :value="p.id"
                  :label="`${p.name} · ${p.diagnosis} · ${p.severity}`"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="接收医院" required>
              <el-select v-model="form.toHospitalId" style="width: 100%" placeholder="按资质 + 血清匹配">
                <el-option
                  v-for="h in targetHospitals"
                  :key="h.id"
                  :value="h.id"
                  :label="`${h.name}（${h.level}）· ${h.distanceKm}km`"
                >
                  <span>{{ h.name }}（{{ h.level }}）</span>
                  <span style="float:right; color:#909399; font-size:12px">{{ serumSummary(h.id) }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="紧急程度">
              <el-radio-group v-model="form.urgency">
                <el-radio-button label="一般" value="一般" />
                <el-radio-button label="紧急" value="紧急" />
                <el-radio-button label="危急" value="危急" />
              </el-radio-group>
            </el-form-item>

            <el-form-item label="转运方式">
              <el-select v-model="form.transport" style="width: 100%">
                <el-option label="120 救护车" value="120 救护车" />
                <el-option label="院内转运车" value="院内转运车" />
                <el-option label="直升机" value="直升机" />
              </el-select>
            </el-form-item>

            <el-form-item label="转诊原因" required>
              <el-input v-model="form.reason" type="textarea" :rows="3" placeholder="病情、需要的专科支持或血清" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submit">发起转诊</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card shadow="never">
          <template #header><span class="bt">患者现况快照（自动抽取）</span></template>
          <template v-if="selectedPatient">
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="姓名">{{ selectedPatient.name }}</el-descriptions-item>
              <el-descriptions-item label="性别年龄">{{ selectedPatient.gender }} · {{ selectedPatient.age }}岁</el-descriptions-item>
              <el-descriptions-item label="诊断">{{ selectedPatient.diagnosis }}</el-descriptions-item>
              <el-descriptions-item label="病情">
                <el-tag size="small" :type="selectedPatient.severity === '危重' ? 'danger' : selectedPatient.severity === '重' ? 'warning' : 'success'">
                  {{ selectedPatient.severity }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="入院">{{ selectedPatient.admitDate }}</el-descriptions-item>
            </el-descriptions>
            <div v-if="form.toHospitalId" class="match">
              <div class="match-title">接收医院血清</div>
              <div class="match-serum">{{ serumSummary(form.toHospitalId) }}</div>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-head { margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.bt { font-weight: 600; }
.match { margin-top: 12px; padding: 10px; background: #f5f7fa; border-radius: 6px; }
.match-title { font-size: 12px; color: #909399; }
.match-serum { font-size: 13px; margin-top: 4px; }
</style>
