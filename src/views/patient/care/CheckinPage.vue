<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useCareStore } from '@/stores/care'
import { medications } from '@/mock/care'

const router = useRouter()
const care = useCareStore()

const today = new Date().toLocaleDateString('zh-CN')

// 仅按时服药的项（排除一次性）
const dailyMeds = medications.filter((m) => !m.times.includes('一次性'))

function take(medId: string, time: string) {
  care.setCheckin(medId, time, 'taken')
  ElMessage.success('已打卡：按时服药')
}
function miss(medId: string, time: string) {
  care.setCheckin(medId, time, 'missed')
  ElMessage.warning('已记录漏服，30 分钟后会再次提醒')
}
</script>

<template>
  <div class="checkin-page">
    <PhoneNavBar title="用药打卡" back="/patient/care/timeline" />

    <div class="body">
      <div class="adherence">
        <el-progress type="circle" :percentage="care.adherence" :width="80" />
        <div class="ad-text">
          <div class="ad-title">今日依从率</div>
          <div class="ad-date">{{ today }}</div>
          <el-button link type="primary" size="small" @click="router.push('/patient/care/timeline')">查看随访计划</el-button>
        </div>
      </div>

      <div class="card" v-for="m in dailyMeds" :key="m.id">
        <div class="med-head">
          <div>
            <div class="med-name">{{ m.name }}</div>
            <div class="med-dose">{{ m.dose }} · 每日 {{ m.times.length }} 次</div>
          </div>
        </div>
        <div v-if="m.note" class="med-note"><el-icon><InfoFilled /></el-icon> {{ m.note }}</div>
        <div class="times">
          <div v-for="t in m.times" :key="t" class="time-row">
            <span class="time">{{ t }}</span>
            <div class="time-actions">
              <template v-if="care.getCheckin(m.id, t) === 'pending'">
                <el-button type="primary" size="small" @click="take(m.id, t)">已服</el-button>
                <el-button size="small" @click="miss(m.id, t)">漏服</el-button>
              </template>
              <el-tag v-else-if="care.getCheckin(m.id, t) === 'taken'" type="success" size="small">已服 ✓</el-tag>
              <el-tag v-else type="danger" size="small">漏服</el-tag>
            </div>
          </div>
        </div>
      </div>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="一次性用药"
        description="破伤风抗毒素 1500U 已于住院期间完成"
      />
    </div>
  </div>
</template>

<style scoped>
.checkin-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }

.adherence {
  background: #fff; border-radius: 10px; padding: 16px;
  display: flex; align-items: center; gap: 20px;
}
.ad-title { font-size: 15px; font-weight: 600; }
.ad-date { font-size: 12px; color: #909399; margin: 4px 0; }

.card { background: #fff; border-radius: 10px; padding: 14px; }
.med-name { font-size: 15px; font-weight: 600; }
.med-dose { font-size: 12px; color: #909399; margin-top: 2px; }
.med-note {
  font-size: 12px; color: #e6a23c; margin: 8px 0;
  display: flex; align-items: center; gap: 4px;
}
.times { margin-top: 8px; }
.time-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; border-top: 1px dashed #ebeef5;
}
.time { font-size: 14px; font-weight: 500; }
.time-actions { display: flex; gap: 8px; align-items: center; }
</style>
