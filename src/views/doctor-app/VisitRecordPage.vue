<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useRescueStore } from '@/stores/rescue'

const route = useRoute()
const router = useRouter()
const rescue = useRescueStore()

// APP 端：默认展示治疗中的事件，便于移动补录
const eventId = computed(() => {
  const id = route.params.id as string
  if (id && id !== 'demo') return id
  return rescue.events.find((e) => e.status === 'treating')?.id ?? rescue.events[0]?.id ?? ''
})
const ev = computed(() => rescue.getEvent(eventId.value))
</script>

<template>
  <div class="visit-app">
    <PhoneNavBar title="就诊记录" back="/doctor-app/inbox" />

    <div v-if="!ev" class="empty"><el-empty description="暂无就诊" /></div>

    <div v-else class="body">
      <div class="patient-strip">
        <el-avatar :size="36" style="background:#409eff">{{ ev.patientName.charAt(0) }}</el-avatar>
        <div>
          <div class="name">{{ ev.patientName }}</div>
          <div class="sub">{{ ev.id }} · {{ ev.location }}</div>
        </div>
      </div>

      <div v-if="ev.visitRecord" class="card">
        <div class="block-title">诊断与处置</div>
        <div class="kv"><span>蛇种判定</span><b>{{ ev.visitRecord.snakeJudgment }}</b></div>
        <div class="kv"><span>血清</span><b>{{ ev.visitRecord.serumName }}</b></div>
        <div class="kv"><span>用量</span><b>{{ ev.visitRecord.serumDose }}</b></div>
        <div class="kv col"><span>其它处置</span><p>{{ ev.visitRecord.treatment }}</p></div>
        <el-divider />
        <div class="kv col"><span>诊断说明</span><p>{{ ev.visitRecord.diagnosisNote }}</p></div>
        <div class="kv col"><span>用药记录</span><p>{{ ev.visitRecord.medications }}</p></div>
        <div class="kv col"><span>检验摘要</span><p>{{ ev.visitRecord.labSummary }}</p></div>
        <div class="kv col"><span>影像 / 附件</span><p>{{ ev.visitRecord.imagingSummary }}</p></div>
        <div class="kv col"><span>生命体征</span><p>{{ ev.visitRecord.vitalSigns }}</p></div>
        <div v-if="ev.visitRecord.attachments?.length" class="attachment-list">
          <div v-for="attachment in ev.visitRecord.attachments" :key="attachment.id" class="attachment-item">
            <img :src="attachment.url" :alt="attachment.name" />
            <div>
              <span>{{ attachment.type }}</span>
              <b>{{ attachment.name }}</b>
              <p>{{ attachment.note }}</p>
            </div>
          </div>
        </div>
        <div class="kv"><span>记录医生</span><b>{{ ev.visitRecord.doctorName }} · {{ ev.visitRecord.recordedAt }}</b></div>
      </div>
      <div v-else class="card empty-record">
        <el-icon :size="32" color="#c0c4cc"><DocumentAdd /></el-icon>
        <p>尚未填写就诊记录</p>
        <span>请在医生端 PC 完成首次判定记录</span>
      </div>

      <div class="card">
        <div class="block-title">移动补录</div>
        <p class="补录-hint">治疗过程中可快速补录（化验/影像/用药多从 HIS/LIS/PACS 自动拉取）</p>
        <div class="quick-add">
          <div class="qa"><el-icon><Histogram /></el-icon><span>化验</span></div>
          <div class="qa"><el-icon><Picture /></el-icon><span>影像</span></div>
          <div class="qa"><el-icon><FirstAidKit /></el-icon><span>用药</span></div>
          <div class="qa"><el-icon><TrendCharts /></el-icon><span>生命体征</span></div>
        </div>
      </div>

      <el-button type="primary" size="large" class="full" @click="router.push('/doctor-app/inbox')">返回收件箱</el-button>
    </div>
  </div>
</template>

<style scoped>
.visit-app { min-height: 100%; background: #f0f2f5; }
.empty { padding-top: 60px; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.patient-strip {
  background: #fff; border-radius: 10px; padding: 12px;
  display: flex; align-items: center; gap: 10px;
}
.patient-strip .name { font-size: 15px; font-weight: 600; }
.patient-strip .sub { font-size: 12px; color: #909399; margin-top: 2px; }

.card { background: #fff; border-radius: 10px; padding: 14px; }
.block-title { font-size: 13px; font-weight: 600; margin-bottom: 10px; }
.kv { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
.kv span { color: #909399; }
.kv.col { flex-direction: column; gap: 4px; }
.kv.col p { margin: 0; line-height: 1.5; }
.attachment-list { display: flex; flex-direction: column; gap: 8px; margin: 10px 0; }
.attachment-item { display: flex; gap: 9px; border: 1px solid #ebeef5; border-radius: 8px; padding: 8px; background: #fafafa; }
.attachment-item img { width: 72px; height: 72px; border-radius: 6px; object-fit: cover; flex: 0 0 auto; background: #f5f7fa; }
.attachment-item div { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.attachment-item span { font-size: 11px; color: #909399; }
.attachment-item b { font-size: 13px; color: #303133; line-height: 1.4; word-break: break-word; }
.attachment-item p { margin: 0; font-size: 12px; color: #606266; line-height: 1.5; }

.empty-record { text-align: center; color: #909399; }
.empty-record p { margin: 8px 0 2px; font-size: 14px; }
.empty-record span { font-size: 12px; color: #c0c4cc; }

.补录-hint { font-size: 12px; color: #909399; margin: 0 0 10px; line-height: 1.5; }
.quick-add { display: flex; gap: 10px; }
.qa {
  flex: 1; background: #f5f7fa; border-radius: 8px; padding: 12px 4px;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  font-size: 12px; color: #606266; cursor: pointer;
}
.full { width: 100%; }
</style>
