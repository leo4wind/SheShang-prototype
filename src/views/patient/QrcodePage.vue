<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useRescueStore } from '@/stores/rescue'
import { currentPatient, getHospital } from '@/mock/data'

const route = useRoute()
const router = useRouter()
const rescue = useRescueStore()

const eventId = computed(() => {
  const id = route.params.id as string
  if (id && id !== 'demo') return id
  return rescue.currentEvent?.id ?? rescue.activeEvents[0]?.id ?? ''
})
const ev = computed(() => rescue.getEvent(eventId.value))
const hospital = computed(() => (ev.value?.selectedHospitalId ? getHospital(ev.value.selectedHospitalId) : undefined))
const patientLine = computed(() => {
  if (!ev.value) return ''
  if (ev.value.identityStatus === 'bound') {
    return `${currentPatient.name} · ${currentPatient.gender} · ${currentPatient.age}岁`
  }
  return '临时求救身份 · 到院核验后绑定档案'
})

function markArrived() {
  if (ev.value) {
    const wasGuest = ev.value.identityStatus === 'guest'
    rescue.markArrived(ev.value.id)
    ElMessage.success(wasGuest ? '已核验到院，并绑定患者档案' : '已核验到院，医生将开始判定')
    router.push(`/patient/waiting/${ev.value.id}`)
  }
}
</script>

<template>
  <div class="qrcode-page">
    <PhoneNavBar title="就诊二维码" :back="ev ? `/patient/waiting/${ev.id}` : '/patient/sos'" />

    <div v-if="!ev" class="empty">
      <el-empty description="未找到求救事件" />
    </div>

      <div v-else class="body">
        <div class="card">
          <div class="hint">到院后出示给分诊台核验</div>
          <div class="desc">二维码用于医院核验本次求救事件，到院后可绑定医院患者档案。</div>
          <div class="qr">
          <!-- 占位二维码：用 CSS 棋盘格模拟 -->
          <div class="qr-grid">
            <el-icon :size="48"><Grid /></el-icon>
          </div>
        </div>
        <div class="event-id">{{ ev.id }}</div>
        <div class="patient">{{ patientLine }}</div>
        <div v-if="hospital" class="hospital">前往：{{ hospital.name }}</div>
      </div>

      <el-button type="primary" size="large" class="arrived-btn" @click="markArrived">
        模拟：已到院核验
      </el-button>
      <div class="demo-note">（演示用：实际由医院分诊台扫码触发）</div>
    </div>
  </div>
</template>

<style scoped>
.qrcode-page { min-height: 100%; background: #f0f2f5; }
.empty { padding-top: 60px; }
.body { padding: 20px 16px; display: flex; flex-direction: column; align-items: center; gap: 16px; }

.card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.hint { font-size: 13px; color: #909399; }
.desc { font-size: 12px; color: #606266; line-height: 1.5; text-align: center; }
.qr {
  width: 180px;
  height: 180px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qr-grid {
  width: 160px;
  height: 160px;
  background:
    repeating-linear-gradient(0deg, #303133 0 10px, #fff 10px 20px),
    repeating-linear-gradient(90deg, #303133 0 10px, transparent 10px 20px);
  background-blend-mode: difference;
  border: 8px solid #303133;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.event-id { font-size: 20px; font-weight: 700; letter-spacing: 1px; }
.patient { font-size: 14px; color: #303133; }
.hospital { font-size: 13px; color: #409eff; }

.arrived-btn { width: 100%; }
.demo-note { font-size: 12px; color: #c0c4cc; }
</style>
