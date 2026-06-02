<script setup lang="ts">
import { reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useCollabStore } from '@/stores/collab'
import { doctors, patientBriefs, getHospital } from '@/mock/data'
import MockDataLabel from '@/components/MockDataLabel.vue'

const collab = useCollabStore()

// 可共享对象：除当前医生外
const shareTargets = doctors.filter((d) => d.id !== 'd-01')

const form = reactive({
  patientId: 'p-01',
  toDoctorId: '',
  scope: '完整资料' as '基础信息' | '完整资料',
  validDays: 7
})

const selectedPatient = computed(() => patientBriefs.find((p) => p.id === form.patientId))

function hospitalName(id: string) {
  return getHospital(id)?.name ?? ''
}

function expireDate(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('zh-CN')
}

function submit() {
  if (!form.toDoctorId) { ElMessage.warning('请选择共享对象'); return }
  const p = selectedPatient.value!
  const d = doctors.find((x) => x.id === form.toDoctorId)!
  collab.createShare({
    patientId: p.id,
    patientName: p.name,
    toDoctorId: d.id,
    toDoctorName: d.name,
    scope: form.scope,
    expireAt: expireDate(form.validDays)
  })
  ElMessage.success(`已将 ${p.name} 共享给 ${d.name}`)
  form.toDoctorId = ''
}
</script>

<template>
  <div class="share-page">
    <div class="page-head">
      <div>
        <h2>共享患者</h2>
        <p class="sub">将患者档案按范围、有效期共享给其他医生，到期自动收回</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16">
      <el-col :span="14">
        <el-card shadow="never">
          <template #header><span class="bt">发起共享</span></template>
          <el-form :model="form" label-width="100px">
            <el-form-item label="选择患者">
              <el-select v-model="form.patientId" style="width: 100%">
                <el-option v-for="p in patientBriefs" :key="p.id" :value="p.id" :label="`${p.name} · ${p.diagnosis}`" />
              </el-select>
            </el-form-item>
            <el-form-item label="共享对象" required>
              <el-select v-model="form.toDoctorId" style="width: 100%" placeholder="选择医生">
                <el-option v-for="d in shareTargets" :key="d.id" :value="d.id" :label="`${d.name} · ${d.specialty} · ${hospitalName(d.hospitalId)}`" />
              </el-select>
            </el-form-item>
            <el-form-item label="共享范围">
              <el-radio-group v-model="form.scope">
                <el-radio-button label="基础信息" value="基础信息" />
                <el-radio-button label="完整资料" value="完整资料" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="有效期">
              <el-select v-model="form.validDays" style="width: 200px">
                <el-option :value="3" label="3 天" />
                <el-option :value="7" label="7 天" />
                <el-option :value="30" label="30 天" />
              </el-select>
              <span class="expire-hint">到期日：{{ expireDate(form.validDays) }}</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">确认共享</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="10">
        <el-card shadow="never">
          <template #header><span class="bt">我发起的共享</span></template>
          <el-empty v-if="!collab.shares.length" description="暂无" :image-size="60" />
          <div v-for="s in collab.shares" :key="s.id" class="share-item">
            <div class="si-top">
              <b>{{ s.patientName }}</b>
              <el-tag size="small" effect="plain">{{ s.scope }}</el-tag>
            </div>
            <div class="si-sub">→ {{ s.toDoctorName }} · 到期 {{ s.expireAt }}</div>
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
.expire-hint { margin-left: 12px; font-size: 12px; color: #909399; }
.share-item { padding: 10px 0; border-bottom: 1px dashed #ebeef5; }
.share-item:last-child { border-bottom: none; }
.si-top { display: flex; align-items: center; gap: 8px; }
.si-sub { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
