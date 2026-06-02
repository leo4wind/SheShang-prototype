<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCollabStore } from '@/stores/collab'
import { doctors, patientBriefs, getHospital } from '@/mock/data'

const router = useRouter()
const collab = useCollabStore()

const experts = doctors.filter((d) => d.isExpert)
const specialties = [...new Set(experts.map((e) => e.specialty))]

const filterSpecialty = ref<string>('')
const filteredExperts = computed(() =>
  filterSpecialty.value ? experts.filter((e) => e.specialty === filterSpecialty.value) : experts
)

const form = reactive({
  patientId: 'p-02',
  topic: '',
  scheduledAt: '今天 16:00',
  selected: [] as string[]
})

const selectedPatient = computed(() => patientBriefs.find((p) => p.id === form.patientId))

function hospitalName(id: string) {
  return getHospital(id)?.name ?? ''
}

function submit() {
  if (!form.topic) { ElMessage.warning('请填写会诊议题'); return }
  if (!form.selected.length) { ElMessage.warning('请至少邀请一名专家'); return }
  const p = selectedPatient.value!
  const m = collab.createMdt({
    patientId: p.id,
    patientName: p.name,
    topic: form.topic,
    scheduledAt: form.scheduledAt,
    invitees: form.selected.map((id) => {
      const d = doctors.find((x) => x.id === id)!
      return { doctorId: d.id, name: d.name, specialty: d.specialty, reply: 'pending' as const }
    })
  })
  ElMessage.success('MDT 邀请已发出')
  router.push(`/doctor/mdt/room/${m.id}`)
}
</script>

<template>
  <div class="mdt-new">
    <div class="page-head">
      <h2>发起 MDT 多学科会诊</h2>
      <p class="sub">疑难重症病例，邀请多学科专家共同会诊</p>
    </div>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never" class="block">
          <template #header><span class="bt">会诊信息</span></template>
          <el-form :model="form" label-width="90px">
            <el-form-item label="会诊患者">
              <el-select v-model="form.patientId" style="width: 100%">
                <el-option v-for="p in patientBriefs" :key="p.id" :value="p.id" :label="`${p.name} · ${p.diagnosis} · ${p.severity}`" />
              </el-select>
            </el-form-item>
            <el-form-item label="会诊议题" required>
              <el-input v-model="form.topic" type="textarea" :rows="2" placeholder="如：五步蛇咬伤致凝血障碍，是否血浆置换" />
            </el-form-item>
            <el-form-item label="会诊时间">
              <el-select v-model="form.scheduledAt" style="width: 100%">
                <el-option label="今天 16:00" value="今天 16:00" />
                <el-option label="今天 18:00" value="今天 18:00" />
                <el-option label="明天 09:00" value="明天 09:00" />
              </el-select>
            </el-form-item>
            <el-form-item label="病例资料">
              <el-button><el-icon><Upload /></el-icon> 上传病历 / 影像 / 化验（占位）</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <el-card shadow="never" class="block">
          <template #header>
            <div class="card-head-row">
              <span class="bt">邀请专家（已选 {{ form.selected.length }}）</span>
              <el-select v-model="filterSpecialty" placeholder="按专科筛选" clearable size="small" style="width: 160px">
                <el-option v-for="s in specialties" :key="s" :value="s" :label="s" />
              </el-select>
            </div>
          </template>
          <el-checkbox-group v-model="form.selected">
            <div v-for="e in filteredExperts" :key="e.id" class="expert">
              <el-checkbox :value="e.id">
                <div class="expert-info">
                  <span class="ename">{{ e.name }}</span>
                  <el-tag size="small" effect="plain">{{ e.specialty }}</el-tag>
                  <span class="etitle">{{ e.title }} · {{ hospitalName(e.hospitalId) }}</span>
                </div>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card shadow="never">
          <template #header><span class="bt">患者快照</span></template>
          <el-descriptions v-if="selectedPatient" :column="1" border size="small">
            <el-descriptions-item label="姓名">{{ selectedPatient.name }}</el-descriptions-item>
            <el-descriptions-item label="诊断">{{ selectedPatient.diagnosis }}</el-descriptions-item>
            <el-descriptions-item label="病情">{{ selectedPatient.severity }}</el-descriptions-item>
          </el-descriptions>
          <el-button type="primary" class="submit" @click="submit">发起邀请</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-head { margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.block { margin-bottom: 16px; }
.bt { font-weight: 600; }
.card-head-row { display: flex; align-items: center; justify-content: space-between; }

.expert { padding: 10px 12px; border: 1px solid #ebeef5; border-radius: 8px; margin-bottom: 8px; font-size: 14px; line-height: 1.6; }
.expert-info { display: inline-flex; align-items: center; gap: 8px; }
.ename { font-weight: 600; }
.etitle { font-size: 12px; color: #909399; }

.submit { width: 100%; margin-top: 16px; }
</style>
