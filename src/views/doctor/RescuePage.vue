<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRescueStore, STATUS_LABEL, type RescueStatus } from '@/stores/rescue'
import { getHospital } from '@/mock/data'
import MockDataLabel from '@/components/MockDataLabel.vue'

const router = useRouter()
const rescue = useRescueStore()

const statusTagType: Record<RescueStatus, string> = {
  sos: 'danger', hospital: 'warning', reported: 'warning',
  accepted: 'primary', arrived: 'primary', treating: 'success', discharged: 'info'
}

function open(id: string) {
  router.push(`/doctor/patient-realtime/${id}`)
}

function hospitalName(id?: string) {
  return id ? getHospital(id)?.name ?? '—' : '待选择'
}
</script>

<template>
  <div class="rescue-board">
    <div class="page-head">
      <div>
        <h2>救助工作台</h2>
        <p class="sub">实时接收周边患者求救事件 · 已出院病例保留在列表中用于回看</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="6"><div class="stat danger"><div class="n">{{ rescue.activeEvents.length }}</div><div class="l">待处理事件</div></div></el-col>
      <el-col :span="6"><div class="stat warning"><div class="n">{{ rescue.activeEvents.filter(e => e.status === 'sos' || e.status === 'hospital').length }}</div><div class="l">新求救（未接诊）</div></div></el-col>
      <el-col :span="6"><div class="stat primary"><div class="n">{{ rescue.activeEvents.filter(e => e.status === 'accepted' || e.status === 'arrived').length }}</div><div class="l">救助中</div></div></el-col>
      <el-col :span="6"><div class="stat success"><div class="n">{{ rescue.workbenchEvents.filter(e => e.status === 'discharged').length }}</div><div class="l">已出院可回看</div></div></el-col>
    </el-row>

    <el-card shadow="never" class="list-card">
      <template #header><span class="card-title">求救事件列表（含已出院）</span></template>
      <el-table :data="rescue.workbenchEvents" style="width: 100%" @row-click="(row: any) => open(row.id)" class="clickable">
        <el-table-column prop="id" label="事件号" width="100" />
        <el-table-column prop="patientName" label="患者" width="90" />
        <el-table-column label="身份" width="120">
          <template #default="{ row }">
            <el-tag
              size="small"
              :type="row.identityStatus === 'bound' ? 'success' : 'warning'"
              effect="plain"
            >
              {{ row.identityStatus === 'bound' ? '已绑定' : '临时身份' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template #default="{ row }">
            <el-tag size="small" :type="statusTagType[row.status as RescueStatus] as any">
              {{ STATUS_LABEL[row.status as RescueStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="80" />
        <el-table-column prop="location" label="位置" min-width="140" show-overflow-tooltip />
        <el-table-column label="目标医院" min-width="120">
          <template #default="{ row }">{{ hospitalName(row.selectedHospitalId) }}</template>
        </el-table-column>
        <el-table-column label="症状摘要" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">{{ row.report?.symptoms ?? '（未上报）' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="open(row.id)">{{ row.status === 'discharged' ? '回看' : '查看' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-alert
      type="info"
      :closable="false"
      show-icon
      title="数据来源"
      description="求救事件由外网应用接口同步到医生 PC 工作台；C 端不直连内网，接口/隔离方案待技术确认。"
      class="src-hint"
    />
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }

.stat-row { margin-bottom: 16px; }
.stat { border-radius: 8px; padding: 16px; color: #fff; }
.stat .n { font-size: 28px; font-weight: 700; }
.stat .l { font-size: 13px; opacity: 0.9; margin-top: 4px; }
.stat.danger { background: linear-gradient(135deg, #f56c6c, #e53935); }
.stat.warning { background: linear-gradient(135deg, #e6a23c, #cf9236); }
.stat.primary { background: linear-gradient(135deg, #409eff, #337ecc); }
.stat.success { background: linear-gradient(135deg, #67c23a, #529b2e); }

.list-card { margin-bottom: 16px; }
.card-title { font-weight: 600; }
.clickable :deep(.el-table__row) { cursor: pointer; }
.src-hint :deep(.el-alert__description) { font-size: 12px; }
</style>
