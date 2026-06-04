<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useRescueStore, STATUS_LABEL, type RescueStatus } from '@/stores/rescue'
import { currentPatient, getHospital } from '@/mock/data'

const router = useRouter()
const rescue = useRescueStore()

// 当前演示患者的所有就诊（含历史预置）
const myVisits = computed(() =>
  rescue.events
    .filter((e) => e.patientId === currentPatient.id)
    .slice()
    .reverse()
)

const statusTagType: Record<RescueStatus, string> = {
  sos: 'danger',
  hospital: 'warning',
  reported: 'warning',
  accepted: 'primary',
  arrived: 'primary',
  treating: 'success',
  discharged: 'info'
}

function open(id: string) {
  router.push(`/patient/waiting/${id}`)
}

function hospitalName(id?: string) {
  return id ? getHospital(id)?.name ?? '—' : '—'
}
</script>

<template>
  <div class="visits-page">
    <PhoneNavBar title="我的就诊" back="/patient/home" />

    <div class="body">
      <el-empty v-if="!myVisits.length" description="暂无就诊记录" />

      <div v-for="v in myVisits" :key="v.id" class="visit-card" @click="open(v.id)">
        <div class="row1">
          <span class="vid">{{ v.id }}</span>
          <el-tag size="small" :type="statusTagType[v.status] as any">{{ STATUS_LABEL[v.status] }}</el-tag>
        </div>
        <div class="row2">
          <el-icon><Clock /></el-icon> {{ v.createdAt }}
          <el-icon style="margin-left:10px"><LocationFilled /></el-icon> {{ v.location }}
        </div>
        <div class="row3">目标医院：{{ hospitalName(v.selectedHospitalId) }}</div>
        <div v-if="v.visitRecord" class="row4">
          诊断：{{ v.visitRecord.snakeJudgment }} · 血清：{{ v.visitRecord.serumName }}
        </div>
        <div v-if="v.visitRecord" class="row5">
          已补录：诊断说明 / 用药 / 检验 / 影像
        </div>
        <el-icon class="arrow"><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.visits-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }

.visit-card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  position: relative;
  cursor: pointer;
}
.row1 { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.vid { font-weight: 700; font-size: 15px; }
.row2 { font-size: 12px; color: #909399; display: flex; align-items: center; gap: 2px; }
.row3 { font-size: 13px; color: #606266; margin-top: 6px; }
.row4 { font-size: 13px; color: #67c23a; margin-top: 4px; }
.row5 { font-size: 12px; color: #909399; margin-top: 3px; }
.arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #c0c4cc; }
</style>
