<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { useRescueStore } from '@/stores/rescue'
import { hospitals, snakeTypes } from '@/mock/data'

const router = useRouter()
const rescue = useRescueStore()

// 按距离排序，有资质优先
const sorted = computed(() =>
  hospitals.slice().sort((a, b) => {
    if (a.hasQualification !== b.hasQualification) return a.hasQualification ? -1 : 1
    return a.distanceKm - b.distanceKm
  })
)

function serumSummary(stock: Record<string, number>): { name: string; count: number }[] {
  return snakeTypes
    .filter((s) => s.venomous && (stock[s.id] ?? 0) > 0)
    .map((s) => ({ name: s.name, count: stock[s.id] }))
}

function totalSerum(stock: Record<string, number>): number {
  return Object.values(stock).reduce((a, b) => a + b, 0)
}

function choose(hospitalId: string) {
  const ev = rescue.currentEvent
  if (!ev) {
    ElMessage.warning('请先在求救首页发起 SOS')
    router.push('/patient/sos')
    return
  }
  rescue.selectHospital(ev.id, hospitalId)
  ElMessage.success('已选定医院，正在通知接诊医生')
  router.push(`/patient/waiting/${ev.id}`)
}
</script>

<template>
  <div class="hospitals-page">
    <PhoneNavBar title="就近医院" back="/patient/sos" />

    <div class="body">
      <div class="bar">
        <span class="bar-title">按距离 + 资质排序</span>
        <MockDataLabel text="赛伦血清库存 · Mock" />
      </div>

      <div v-for="h in sorted" :key="h.id" class="card" :class="{ disabled: !h.hasQualification }">
        <div class="card-top">
          <div class="hname">
            {{ h.name }}
            <el-tag size="small" type="info" effect="plain">{{ h.level }}</el-tag>
          </div>
          <el-tag v-if="h.hasQualification" size="small" type="success">蛇伤资质</el-tag>
          <el-tag v-else size="small" type="danger">无资质</el-tag>
        </div>

        <div class="meta">
          <span><el-icon><LocationFilled /></el-icon> {{ h.distanceKm }}km</span>
          <span><el-icon><Van /></el-icon> 约 {{ h.etaMin }} 分钟</span>
          <span><el-icon><Phone /></el-icon> {{ h.phone }}</span>
        </div>

        <div class="serum">
          <template v-if="h.hasQualification">
            <span class="serum-label">血清库存（{{ totalSerum(h.serumStock) }} 支）：</span>
            <template v-if="serumSummary(h.serumStock).length">
              <el-tag
                v-for="s in serumSummary(h.serumStock)"
                :key="s.name"
                size="small"
                effect="plain"
                class="serum-tag"
              >
                {{ s.name }} ×{{ s.count }}
              </el-tag>
            </template>
            <span v-else class="no-serum">暂无血清库存</span>
          </template>
          <span v-else class="no-serum">不具备蛇伤救治资质，建议转上级</span>
        </div>

        <el-button
          type="primary"
          :disabled="!h.hasQualification"
          class="choose-btn"
          @click="choose(h.id)"
        >
          {{ h.hasQualification ? '选择并前往' : '不可选' }}
        </el-button>
      </div>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="地图与路线"
        description="此处接入地图 SDK 显示路线与导航（原型占位）"
        class="map-hint"
      />
    </div>
  </div>
</template>

<style scoped>
.hospitals-page {
  min-height: 100%;
  background: #f0f2f5;
}
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bar-title { font-size: 13px; color: #909399; }

.card {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
}
.card.disabled { opacity: 0.75; }
.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.hname { font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 6px; }

.meta {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: #606266;
  margin-bottom: 8px;
}
.meta span { display: inline-flex; align-items: center; gap: 3px; }

.serum {
  background: #f5f7fa;
  border-radius: 6px;
  padding: 8px 10px;
  margin-bottom: 12px;
  font-size: 12px;
}
.serum-label { color: #909399; }
.serum-tag { margin: 2px 4px 2px 0; }
.no-serum { color: #f56c6c; }

.choose-btn { width: 100%; }

.map-hint { margin-top: 4px; }
</style>
