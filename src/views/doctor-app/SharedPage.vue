<script setup lang="ts">
import { useCollabStore } from '@/stores/collab'
import { getPatientBrief } from '@/mock/data'
import PhoneNavBar from '@/components/PhoneNavBar.vue'

const collab = useCollabStore()
function brief(id: string) { return getPatientBrief(id) }
</script>

<template>
  <div class="shared-app">
    <PhoneNavBar title="共享给我的" back="/doctor-app/inbox" />
    <div class="body">
      <el-empty v-if="!collab.sharedToMe.length" description="暂无共享" />
      <div v-for="s in collab.sharedToMe" :key="s.id" class="card">
        <div class="top">
          <b>{{ s.patientName }}</b>
          <el-tag size="small" effect="plain">{{ s.scope }}</el-tag>
        </div>
        <div class="sub">{{ brief(s.patientId)?.diagnosis }} · {{ brief(s.patientId)?.severity }}</div>
        <div class="meta">来自 {{ s.fromDoctor }} · 到期 {{ s.expireAt }}</div>
        <el-button link type="primary" size="small">查看患者 360</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shared-app { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.card { background: #fff; border-radius: 10px; padding: 14px; }
.top { display: flex; align-items: center; gap: 8px; }
.sub { font-size: 13px; color: #606266; margin: 6px 0; }
.meta { font-size: 12px; color: #909399; margin-bottom: 6px; }
</style>
