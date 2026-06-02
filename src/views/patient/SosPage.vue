<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useRescueStore } from '@/stores/rescue'
import { currentPatient } from '@/mock/data'

const router = useRouter()
const rescue = useRescueStore()

const locating = ref(false)
const location = ref('青龙山林场北坡（自动定位）')

function triggerSos() {
  locating.value = true
  // 模拟定位 + 创建事件
  setTimeout(() => {
    locating.value = false
    const ev = rescue.startSos(location.value)
    ElMessage.success('已发起求救，正在为你匹配就近医院')
    router.push('/patient/hospitals')
    void ev
  }, 800)
}

function callEmergency() {
  router.push('/patient/fallback')
}
</script>

<template>
  <div class="sos-page">
    <PhoneNavBar title="蛇伤急救" theme="danger" />

    <div class="body">
      <div class="patient-strip">
        <el-avatar :size="36" style="background: #f56c6c">{{ currentPatient.name.charAt(0) }}</el-avatar>
        <div>
          <div class="name">{{ currentPatient.name }} · {{ currentPatient.gender }} · {{ currentPatient.age }}岁</div>
          <div class="sub">紧急联系人：{{ currentPatient.emergencyContact }}</div>
        </div>
      </div>

      <div class="sos-area">
        <div class="sos-ring" :class="{ pulsing: locating }" @click="triggerSos">
          <div class="sos-btn">
            <el-icon :size="40"><Warning /></el-icon>
            <span class="sos-text">{{ locating ? '定位中...' : '一键 SOS' }}</span>
            <span class="sos-hint">被蛇咬伤 立即点击</span>
          </div>
        </div>
      </div>

      <div class="location">
        <el-icon><LocationFilled /></el-icon>
        <span>{{ location }}</span>
        <el-button link type="primary" size="small">重新定位</el-button>
      </div>

      <div class="quick-actions">
        <div class="action" @click="callEmergency">
          <el-icon :size="22"><Phone /></el-icon>
          <span>120 / 弱网兜底</span>
        </div>
        <div class="action" @click="router.push('/patient/visits')">
          <el-icon :size="22"><Document /></el-icon>
          <span>我的就诊</span>
        </div>
        <div class="action" @click="router.push('/patient/care/timeline')">
          <el-icon :size="22"><FirstAidKit /></el-icon>
          <span>健康陪护</span>
        </div>
      </div>

      <el-alert
        type="warning"
        :closable="false"
        show-icon
        title="被咬后切记"
        description="保持冷静 · 减少活动 · 记住咬伤时间 · 不要奔跑饮酒"
        class="tip"
      />
    </div>
  </div>
</template>

<style scoped>
.sos-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff5f5;
}
.body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.patient-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 10px;
  padding: 10px 12px;
}
.patient-strip .name { font-size: 14px; font-weight: 600; }
.patient-strip .sub { font-size: 12px; color: #909399; margin-top: 2px; }

.sos-area {
  display: flex;
  justify-content: center;
  padding: 12px 0;
}
.sos-ring {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(245, 108, 108, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.sos-ring.pulsing {
  animation: pulse 1s infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.4); }
  70% { box-shadow: 0 0 0 24px rgba(245, 108, 108, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 108, 108, 0); }
}
.sos-btn {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f56c6c, #e53935);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-shadow: 0 8px 24px rgba(229, 57, 53, 0.4);
}
.sos-text { font-size: 22px; font-weight: 700; }
.sos-hint { font-size: 12px; opacity: 0.9; }

.location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  background: #fff;
  border-radius: 8px;
  padding: 10px 12px;
}
.location > span { flex: 1; }

.quick-actions {
  display: flex;
  gap: 10px;
}
.action {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  padding: 14px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
}
.action:active { background: #f5f7fa; }

.tip {
  margin-top: auto;
}
</style>
