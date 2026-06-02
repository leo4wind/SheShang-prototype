<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { useGovernanceStore, QC_STATUS_LABEL, type QcTicketStatus } from '@/stores/governance'
import { qcReports } from '@/mock/governance'

const router = useRouter()
const gov = useGovernanceStore()

const statusType: Record<QcTicketStatus, string> = { pending: 'danger', answered: 'warning', locked: 'success' }

function raise() {
  gov.raiseQuery({
    patientCase: 'C-2026-0261 王秀英',
    field: '住院天数',
    issue: '住院天数（3）与出入院日期（相差 5 天）不一致，请核对。',
    raisedBy: '张数据（质控）'
  })
  ElMessage.success('已发起质疑，等待医生答疑')
}
</script>

<template>
  <div class="qc-page">
    <div class="page-head">
      <div>
        <h2>质控工作台</h2>
        <p class="sub">校验报告 + 质疑工单：发现问题向医生发起质疑，答疑后锁定入库</p>
      </div>
      <div class="head-right">
        <el-button type="primary" @click="raise">发起质疑</el-button>
        <MockDataLabel />
      </div>
    </div>

    <el-row :gutter="16" class="batch-row">
      <el-col :span="8" v-for="b in qcReports" :key="b.id">
        <div class="batch">
          <div class="b-title">{{ b.batch }}</div>
          <div class="b-stats">
            <span class="pass">通过 {{ b.passed }}</span>
            <span class="fail">异常 {{ b.failed }}</span>
            <span class="total">/ {{ b.total }}</span>
          </div>
          <el-progress :percentage="Math.round((b.passed / b.total) * 100)" :stroke-width="6" />
        </div>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <template #header><span class="bt">质疑工单（{{ gov.pendingCount }} 待答疑）</span></template>
      <el-table :data="gov.qcTickets" style="width:100%" @row-click="(r:any) => router.push(`/intranet/qc/${r.id}`)" class="clickable">
        <el-table-column prop="id" label="工单号" width="90" />
        <el-table-column prop="patientCase" label="病例" min-width="170" />
        <el-table-column prop="field" label="质疑字段" width="120" />
        <el-table-column prop="issue" label="质疑内容" min-width="240" show-overflow-tooltip />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="statusType[row.status as QcTicketStatus] as any">{{ QC_STATUS_LABEL[row.status as QcTicketStatus] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="router.push(`/intranet/qc/${row.id}`)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.head-right { display: flex; align-items: center; gap: 12px; }
.batch-row { margin-bottom: 16px; }
.batch { background: #fff; border-radius: 8px; padding: 14px; }
.b-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.b-stats { font-size: 13px; margin-bottom: 8px; }
.b-stats .pass { color: #67c23a; margin-right: 10px; }
.b-stats .fail { color: #f56c6c; margin-right: 6px; }
.b-stats .total { color: #c0c4cc; }
.bt { font-weight: 600; }
.clickable :deep(.el-table__row) { cursor: pointer; }
</style>
