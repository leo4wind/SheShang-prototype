<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useGovernanceStore, QC_STATUS_LABEL, type QcTicketStatus } from '@/stores/governance'

const route = useRoute()
const router = useRouter()
const gov = useGovernanceStore()

const ticket = computed(() => {
  const id = route.params.id as string
  return gov.getTicket(id && id !== 'demo' ? id : gov.qcTickets[0]?.id ?? '')
})

const statusType: Record<QcTicketStatus, string> = { pending: 'danger', answered: 'warning', locked: 'success' }

function lock() {
  if (ticket.value) {
    gov.lockQuery(ticket.value.id)
    ElMessage.success('已锁定，该条数据通过质控入库')
  }
}

function viewOriginal() {
  ElMessage.info('原文/复核依据预览为 V3 占位：后续打开 D2 原始病历、检验单或导入原文')
}
</script>

<template>
  <div class="qt-page">
    <el-page-header @back="router.push('/intranet/qc')" class="ph">
      <template #content><span class="title">质疑工单 {{ ticket?.id }}</span></template>
    </el-page-header>

    <div v-if="!ticket" class="empty"><el-empty description="工单不存在" /></div>

    <el-row v-else :gutter="16">
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="ch">
              <span class="bt">{{ ticket.patientCase }}</span>
              <el-tag :type="statusType[ticket.status] as any">{{ QC_STATUS_LABEL[ticket.status] }}</el-tag>
            </div>
          </template>

          <div class="step">
            <div class="s-label"><el-icon color="#f56c6c"><WarningFilled /></el-icon> 质控质疑（{{ ticket.field }}）</div>
            <div class="s-body">{{ ticket.issue }}</div>
            <div class="s-meta">{{ ticket.raisedBy }} · {{ ticket.raisedAt }}</div>
          </div>

          <div class="evidence">
            <div>
              <div class="e-title">复核依据</div>
              <div class="e-desc">查阅 D2 原文、导入记录和医生答疑，确认该字段是否可锁定入库。</div>
            </div>
            <el-button type="primary" plain @click="viewOriginal">查阅原文 / 复核依据</el-button>
          </div>

          <div v-if="ticket.answer" class="step answer">
            <div class="s-label"><el-icon color="#67c23a"><ChatLineSquare /></el-icon> 医生答疑</div>
            <div class="s-body">{{ ticket.answer }}</div>
            <div class="s-meta">{{ ticket.answeredBy }}</div>
          </div>
          <div v-else class="waiting">
            <el-icon><Clock /></el-icon> 等待医生在「数据答疑」回答…
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never">
          <template #header><span class="bt">处理</span></template>
          <el-button
            v-if="ticket.status === 'pending'"
            type="primary" class="full"
            @click="router.push('/doctor/answer')"
          >前往医生「数据答疑」</el-button>
          <el-button
            v-if="ticket.status === 'answered'"
            type="success" class="full" @click="lock"
          >确认答疑并锁定入库</el-button>
          <el-button v-if="ticket.status === 'locked'" class="full" disabled>已锁定结案</el-button>
          <el-divider />
          <div class="hint">质疑 → 答疑 → 锁定 形成数据治理闭环；锁定后该字段不可再改，保证专病库可信。</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.ph { margin-bottom: 16px; }
.title { font-size: 18px; font-weight: 700; }
.empty { padding-top: 40px; }
.ch { display: flex; align-items: center; justify-content: space-between; }
.bt { font-weight: 600; }
.step { padding: 12px 0; }
.step.answer { border-top: 1px dashed #ebeef5; }
.s-label { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.s-body { font-size: 14px; color: #303133; line-height: 1.7; margin: 8px 0 4px; }
.s-meta { font-size: 12px; color: #909399; }
.evidence { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px; margin: 8px 0 12px; border: 1px dashed #b3d8ff; border-radius: 8px; background: #ecf5ff; }
.e-title { font-size: 14px; font-weight: 600; color: #303133; }
.e-desc { margin-top: 4px; font-size: 12px; color: #606266; line-height: 1.5; }
.waiting { color: #e6a23c; font-size: 13px; display: flex; align-items: center; gap: 6px; padding: 12px 0; border-top: 1px dashed #ebeef5; }
.full { width: 100%; margin: 0 0 10px; }
.hint { font-size: 12px; color: #909399; line-height: 1.6; }
</style>
