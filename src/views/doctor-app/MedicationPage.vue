<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { patientCareRows } from '@/mock/care'

const sorted = computed(() => [...patientCareRows].sort((a, b) => a.adherence - b.adherence))

const statusType: Record<string, string> = { 依从良好: 'success', 需关注: 'warning', 失访风险: 'danger' }

function remind(name: string) {
  ElMessage.success(`已向 ${name} 推送用药提醒（频次受控，每日最多 1 次）`)
}
</script>

<template>
  <div class="med-page">
    <PhoneNavBar title="用药情况" back="/doctor-app/inbox" theme="primary" />
    <div class="body">
      <div class="tip">
        <el-icon><WarningFilled /></el-icon>
        依从率低的患者优先干预
      </div>

      <div v-for="r in sorted" :key="r.patientId" class="card">
        <div class="top">
          <div class="who">
            <el-avatar :size="34" :style="{ background: r.adherence < 50 ? '#f56c6c' : '#409eff' }">{{ r.name.charAt(0) }}</el-avatar>
            <div>
              <div class="name">{{ r.name }}</div>
              <div class="diag">{{ r.diagnosis }}</div>
            </div>
          </div>
          <el-tag size="small" :type="statusType[r.status] as any">{{ r.status }}</el-tag>
        </div>
        <div class="adh-row">
          <span class="adh-label">用药依从率</span>
          <el-progress
            :percentage="r.adherence" :stroke-width="8" style="flex:1"
            :color="r.adherence >= 70 ? '#67c23a' : r.adherence >= 50 ? '#e6a23c' : '#f56c6c'"
          />
        </div>
        <div class="foot">
          <span class="next">{{ r.nextFollowup }}</span>
          <el-button v-if="r.adherence < 70" size="small" type="primary" plain @click="remind(r.name)">推送提醒</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.med-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.tip { font-size: 12px; color: #e6a23c; display: flex; align-items: center; gap: 4px; }
.card { background: #fff; border-radius: 10px; padding: 12px 14px; }
.top { display: flex; justify-content: space-between; align-items: center; }
.who { display: flex; align-items: center; gap: 10px; }
.name { font-size: 14px; font-weight: 600; }
.diag { font-size: 12px; color: #909399; margin-top: 2px; }
.adh-row { display: flex; align-items: center; gap: 10px; margin: 12px 0 8px; }
.adh-label { font-size: 12px; color: #909399; white-space: nowrap; }
.foot { display: flex; align-items: center; justify-content: space-between; }
.next { font-size: 12px; color: #c0c4cc; }
</style>
