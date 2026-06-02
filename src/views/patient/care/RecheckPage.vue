<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { recheckItems } from '@/mock/care'
import { hospitals } from '@/mock/data'

const router = useRouter()

const recheckHospitals = hospitals.filter((h) => h.hasQualification)
const status = ref<'none' | 'booked' | 'done'>('none')

function book() {
  status.value = 'booked'
  ElMessage.success('已预约复查（挂号 SDK 占位）')
}
function markDone() {
  status.value = 'done'
  ElMessage.success('已标记完成')
}
function cannotGo() {
  ElMessage.info('已记录“无法到达”，可改约线上复诊（v2）')
}
</script>

<template>
  <div class="recheck-page">
    <PhoneNavBar title="复查详情" back="/patient/care/timeline" />

    <div class="body">
      <div class="banner" :class="status">
        <el-icon><Calendar /></el-icon>
        <span>
          {{ status === 'none' ? '出院后第 7 天复查 · 待预约'
             : status === 'booked' ? '已预约 · 2026-06-08 上午'
             : '复查已完成' }}
        </span>
      </div>

      <div class="card">
        <div class="block-title">复查项目</div>
        <div v-for="item in recheckItems" :key="item.name" class="recheck-item">
          <el-icon color="#409eff"><CircleCheck /></el-icon>
          <div>
            <div class="ri-name">{{ item.name }}</div>
            <div class="ri-desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="block-title">推荐复查医院</div>
        <div v-for="h in recheckHospitals" :key="h.id" class="hosp">
          <div>
            <div class="h-name">{{ h.name }}</div>
            <div class="h-meta">{{ h.distanceKm }}km · {{ h.level }}</div>
          </div>
          <el-tag size="small" type="success">可复查</el-tag>
        </div>
      </div>

      <div class="actions">
        <template v-if="status === 'none'">
          <el-button type="primary" size="large" @click="book">预约复查</el-button>
          <el-button size="large" @click="cannotGo">无法到达</el-button>
        </template>
        <el-button v-else-if="status === 'booked'" type="success" size="large" @click="markDone">标记已完成</el-button>
        <el-result v-else icon="success" title="复查完成" sub-title="结果将同步至随访档案" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.recheck-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.banner {
  display: flex; align-items: center; gap: 6px; padding: 12px 14px;
  border-radius: 8px; font-size: 14px; font-weight: 600;
}
.banner.none { background: #fdf6ec; color: #e6a23c; }
.banner.booked { background: #ecf5ff; color: #409eff; }
.banner.done { background: #f0f9eb; color: #67c23a; }

.card { background: #fff; border-radius: 10px; padding: 14px; }
.block-title { font-size: 13px; font-weight: 600; margin-bottom: 10px; }
.recheck-item { display: flex; align-items: flex-start; gap: 8px; padding: 6px 0; }
.ri-name { font-size: 14px; }
.ri-desc { font-size: 12px; color: #909399; margin-top: 2px; }

.hosp { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #ebeef5; }
.hosp:last-child { border-bottom: none; }
.h-name { font-size: 14px; font-weight: 500; }
.h-meta { font-size: 12px; color: #909399; margin-top: 2px; }

.actions { display: flex; flex-direction: column; gap: 8px; }
.actions .el-button { width: 100%; margin-left: 0; }
</style>
