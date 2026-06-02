<script setup lang="ts">
import { computed } from 'vue'
import { getPatient360, type Patient360Kind } from '@/mock/clinical'
import { getPatientBrief } from '@/mock/data'
import MockDataLabel from '@/components/MockDataLabel.vue'

const props = defineProps<{ patientId: string; mode?: 'doctor' | 'intranet' }>()

const brief = computed(() => getPatientBrief(props.patientId))
const events = computed(() =>
  getPatient360(props.patientId).slice().sort((a, b) => a.time.localeCompare(b.time))
)

const kindColor: Record<Patient360Kind, string> = {
  急救: '#f56c6c', 就诊: '#409eff', 转诊: '#e6a23c', MDT: '#9254de',
  随访: '#67c23a', 检验: '#13c2c2', 用药: '#fa8c16'
}
const severityColor: Record<string, string> = { 轻: 'info', 中: 'warning', 重: 'danger', 危重: 'danger' }
</script>

<template>
  <div class="p360">
    <div class="head">
      <div class="who">
        <el-avatar :size="44" style="background:#409eff">{{ brief?.name?.charAt(0) ?? '?' }}</el-avatar>
        <div>
          <div class="name">
            {{ brief?.name ?? '未知患者' }}
            <el-tag v-if="brief" size="small" :type="severityColor[brief.severity] as any">{{ brief.severity }}</el-tag>
          </div>
          <div class="sub" v-if="brief">{{ brief.gender }} · {{ brief.age }}岁 · {{ brief.diagnosis }} · 入院 {{ brief.admitDate }}</div>
        </div>
      </div>
      <MockDataLabel />
    </div>

    <el-alert
      v-if="mode === 'intranet'"
      type="warning" :closable="false" show-icon
      title="内网脱敏视角"
      description="此为专病库内网视角，姓名/联系方式已脱敏，仅供数据治理与科研使用。"
      class="mode-alert"
    />

    <div class="dims">
      <div class="dim"><span>跨主线事件</span><b>{{ events.length }}</b></div>
      <div class="dim"><span>诊断</span><b>{{ brief?.diagnosis ?? '—' }}</b></div>
      <div class="dim"><span>严重度</span><b>{{ brief?.severity ?? '—' }}</b></div>
    </div>

    <div class="timeline-card">
      <div class="card-title">全流程时间线（急救 → 就诊 → 协作 → 随访）</div>
      <el-empty v-if="!events.length" description="暂无档案" />
      <el-timeline v-else>
        <el-timeline-item
          v-for="(e, i) in events" :key="i"
          :timestamp="e.time" placement="top"
          :color="kindColor[e.kind]"
        >
          <div class="ev">
            <div class="ev-top">
              <el-tag size="small" :style="{ background: kindColor[e.kind] + '22', color: kindColor[e.kind], border: 'none' }">{{ e.kind }}</el-tag>
              <span class="ev-title">{{ e.title }}</span>
            </div>
            <div class="ev-detail">{{ e.detail }}</div>
            <div class="ev-src">来源：{{ e.source }}</div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style scoped>
.p360 { display: flex; flex-direction: column; gap: 16px; }
.head { display: flex; align-items: flex-start; justify-content: space-between; }
.who { display: flex; align-items: center; gap: 12px; }
.who .name { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.who .sub { font-size: 13px; color: #909399; margin-top: 4px; }
.mode-alert :deep(.el-alert__description) { font-size: 12px; }
.dims { display: flex; gap: 16px; }
.dim { flex: 1; background: #fff; border-radius: 8px; padding: 14px 16px; }
.dim span { font-size: 12px; color: #909399; }
.dim b { display: block; font-size: 18px; margin-top: 4px; }
.timeline-card { background: #fff; border-radius: 8px; padding: 18px; }
.card-title { font-size: 14px; font-weight: 600; margin-bottom: 16px; }
.ev-top { display: flex; align-items: center; gap: 8px; }
.ev-title { font-size: 14px; font-weight: 600; }
.ev-detail { font-size: 13px; color: #606266; margin: 4px 0; }
.ev-src { font-size: 12px; color: #c0c4cc; }
</style>
