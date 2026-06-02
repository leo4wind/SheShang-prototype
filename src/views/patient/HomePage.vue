<script setup lang="ts">
import { useRouter } from 'vue-router'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { currentPatient } from '@/mock/data'
import { useRescueStore } from '@/stores/rescue'

const router = useRouter()
const rescue = useRescueStore()

const entries = [
  { title: '蛇伤急救', desc: '被咬伤一键求救', icon: 'Warning', color: '#f56c6c', to: '/patient/sos' },
  { title: '我的就诊', desc: '查看就诊进度与历史', icon: 'Document', color: '#409eff', to: '/patient/visits' },
  { title: '健康陪护', desc: '随访 / 用药 / 复查', icon: 'FirstAidKit', color: '#67c23a', to: '/patient/care/timeline' }
]
</script>

<template>
  <div class="home-page">
    <PhoneNavBar title="人民蛇伤" theme="primary" />
    <div class="body">
      <div class="profile">
        <el-avatar :size="48" style="background:#409eff">{{ currentPatient.name.charAt(0) }}</el-avatar>
        <div>
          <div class="name">{{ currentPatient.name }}</div>
          <div class="sub">{{ currentPatient.gender }} · {{ currentPatient.age }}岁 · {{ currentPatient.phone }}</div>
        </div>
      </div>

      <div
        v-if="rescue.currentEvent"
        class="ongoing"
        @click="router.push(`/patient/waiting/${rescue.currentEvent.id}`)"
      >
        <el-icon><BellFilled /></el-icon>
        <span>有进行中的求救事件 {{ rescue.currentEvent.id }}，点击查看</span>
      </div>

      <div class="entries">
        <div v-for="e in entries" :key="e.title" class="entry" @click="router.push(e.to)">
          <div class="icon" :style="{ background: e.color }"><el-icon :size="22"><component :is="e.icon" /></el-icon></div>
          <div class="text">
            <div class="t">{{ e.title }}</div>
            <div class="d">{{ e.desc }}</div>
          </div>
          <el-icon class="arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 14px; display: flex; flex-direction: column; gap: 14px; }
.profile {
  background: #fff; border-radius: 10px; padding: 16px;
  display: flex; align-items: center; gap: 12px;
}
.profile .name { font-size: 16px; font-weight: 600; }
.profile .sub { font-size: 12px; color: #909399; margin-top: 4px; }

.ongoing {
  background: #fef0f0; border: 1px solid #fde2e2; border-radius: 10px;
  padding: 12px 14px; display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: #f56c6c; cursor: pointer;
}

.entries { display: flex; flex-direction: column; gap: 10px; }
.entry {
  background: #fff; border-radius: 10px; padding: 14px;
  display: flex; align-items: center; gap: 12px; cursor: pointer;
}
.icon { width: 40px; height: 40px; border-radius: 10px; color: #fff; display: flex; align-items: center; justify-content: center; }
.text { flex: 1; }
.text .t { font-size: 15px; font-weight: 600; }
.text .d { font-size: 12px; color: #909399; margin-top: 2px; }
.arrow { color: #c0c4cc; }
</style>
