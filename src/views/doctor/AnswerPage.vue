<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { useGovernanceStore, QC_STATUS_LABEL, type QcTicketStatus } from '@/stores/governance'

const gov = useGovernanceStore()

const statusType: Record<QcTicketStatus, string> = { pending: 'danger', answered: 'warning', locked: 'success' }

const selectedId = ref<string>('')
const draft = ref('')

const pending = computed(() => gov.qcTickets.filter((t) => t.status === 'pending'))
const selected = computed(() => gov.getTicket(selectedId.value))

watch(pending, (list) => {
  if (!selectedId.value && list.length) selectedId.value = list[0].id
}, { immediate: true })

function answer() {
  if (!selected.value) return
  if (!draft.value.trim()) { ElMessage.warning('请填写答疑内容'); return }
  gov.answerQuery(selected.value.id, draft.value)
  ElMessage.success('已提交答疑，质控可锁定入库')
  draft.value = ''
  selectedId.value = pending.value[0]?.id ?? ''
}
</script>

<template>
  <div class="answer-page">
    <div class="page-head">
      <div>
        <h2>数据答疑</h2>
        <p class="sub">质控对你经治病例的数据提出质疑，在此回答 · 跨主线协作（J2 × 临床）</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16">
      <el-col :span="9">
        <el-card shadow="never">
          <template #header><span class="bt">待我答疑（{{ pending.length }}）</span></template>
          <el-empty v-if="!pending.length" description="暂无待答疑" :image-size="60" />
          <div
            v-for="t in pending" :key="t.id"
            class="ticket" :class="{ active: selectedId === t.id }"
            @click="selectedId = t.id"
          >
            <div class="t-top"><b>{{ t.patientCase }}</b><el-tag size="small" :type="statusType[t.status] as any">{{ QC_STATUS_LABEL[t.status] }}</el-tag></div>
            <div class="t-field">质疑字段：{{ t.field }}</div>
            <div class="t-issue">{{ t.issue }}</div>
          </div>

          <el-divider v-if="gov.qcTickets.some(t => t.status !== 'pending')">已处理</el-divider>
          <div v-for="t in gov.qcTickets.filter(t => t.status !== 'pending')" :key="t.id" class="ticket done">
            <div class="t-top"><b>{{ t.patientCase }}</b><el-tag size="small" :type="statusType[t.status] as any">{{ QC_STATUS_LABEL[t.status] }}</el-tag></div>
            <div class="t-field">{{ t.field }} · {{ t.answeredBy }}</div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="15">
        <el-card shadow="never" v-if="selected">
          <template #header><span class="bt">{{ selected.patientCase }}</span></template>
          <div class="issue-box">
            <div class="ib-label">质控质疑（{{ selected.field }}）</div>
            <div class="ib-body">{{ selected.issue }}</div>
            <div class="ib-meta">{{ selected.raisedBy }} · {{ selected.raisedAt }}</div>
          </div>

          <template v-if="selected.status === 'pending'">
            <el-input v-model="draft" type="textarea" :rows="4" placeholder="请基于病历与处置说明回答质疑…" class="draft" />
            <div class="quick">
              <el-button size="small" @click="draft = '已复核病历，处置符合规范，诊断与记录无误。'">规范无误</el-button>
              <el-button size="small" @click="draft = '已更正记录，请质控复核。'">已更正</el-button>
            </div>
            <el-button type="primary" @click="answer">提交答疑</el-button>
          </template>
          <div v-else class="answered">
            <el-icon color="#67c23a"><CircleCheckFilled /></el-icon> 已答疑：{{ selected.answer }}
          </div>
        </el-card>
        <el-empty v-else description="左侧选择一条质疑" />
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.bt { font-weight: 600; }
.ticket { border: 1px solid #ebeef5; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; }
.ticket.active { border-color: #409eff; background: #ecf5ff; }
.ticket.done { opacity: 0.7; cursor: default; }
.t-top { display: flex; justify-content: space-between; align-items: center; }
.t-field { font-size: 12px; color: #909399; margin: 4px 0; }
.t-issue { font-size: 13px; color: #606266; line-height: 1.5; }
.issue-box { background: #fef0f0; border-radius: 8px; padding: 12px 14px; margin-bottom: 14px; }
.ib-label { font-size: 13px; font-weight: 600; color: #f56c6c; }
.ib-body { font-size: 14px; color: #303133; line-height: 1.7; margin: 6px 0; }
.ib-meta { font-size: 12px; color: #909399; }
.draft { margin-bottom: 10px; }
.quick { display: flex; gap: 8px; margin-bottom: 12px; }
.answered { background: #f0f9eb; border-radius: 8px; padding: 12px 14px; font-size: 14px; color: #67c23a; display: flex; align-items: center; gap: 6px; }
</style>
