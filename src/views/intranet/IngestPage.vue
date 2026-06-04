<script setup lang="ts">
import MockDataLabel from '@/components/MockDataLabel.vue'

// V1 仅保留最小导入能力；HIS/LIS/PACS/120 接入在 V2 后解锁。
interface SourceStatus {
  name: string
  fromNet: '外网' | '内网'
  phase: 'V1 导入' | 'V2 接入后解锁'
  lastSync: string
  count: number
  errorRate: number
  status: 'ok' | 'warn' | 'error'
}

const sources: SourceStatus[] = [
  { name: '旧专病库迁移', fromNet: '内网', phase: 'V1 导入', lastSync: '2 小时前', count: 5600, errorRate: 4.8, status: 'error' },
  { name: '字段映射模板', fromNet: '内网', phase: 'V1 导入', lastSync: '今天 10:20', count: 186, errorRate: 0.8, status: 'warn' },
  { name: '导入去重结果', fromNet: '内网', phase: 'V1 导入', lastSync: '今天 10:35', count: 432, errorRate: 0, status: 'ok' },
  { name: '患者小程序（求救/上报）', fromNet: '外网', phase: 'V2 接入后解锁', lastSync: '待确认', count: 128, errorRate: 0.2, status: 'warn' },
  { name: '120 出车记录', fromNet: '内网', phase: 'V2 接入后解锁', lastSync: '待接入', count: 36, errorRate: 0, status: 'warn' },
  { name: 'HIS / LIS / PACS', fromNet: '内网', phase: 'V2 接入后解锁', lastSync: '待接入', count: 2975, errorRate: 0, status: 'warn' }
]

const statusType: Record<string, string> = { ok: 'success', warn: 'warning', error: 'danger' }
const statusLabel: Record<string, string> = { ok: '正常', warn: '告警', error: '异常' }

const v1Rows = sources.filter((s) => s.phase === 'V1 导入')
const lockedRows = sources.filter((s) => s.phase === 'V2 接入后解锁')
const importedTotal = v1Rows.reduce((a, b) => a + b.count, 0)
</script>

<template>
  <div class="ingest-page">
    <div class="page-head">
      <div>
        <h2>旧专病库导入</h2>
        <p class="sub">V1 仅保留旧专病库导入、字段映射、去重和错误提示；数据接入监控从左侧菜单隐藏。</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16" class="overview">
      <el-col :span="8">
        <div class="ov-card primary">
          <div class="ov-icon"><el-icon :size="28"><UploadFilled /></el-icon></div>
          <div>
            <div class="ov-title">旧库导入</div>
            <div class="ov-desc">CSV / Excel / 历史专病库包导入</div>
            <div class="ov-stat">{{ importedTotal }} 条 · {{ v1Rows.length }} 个任务</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="ov-card success">
          <div class="ov-icon"><el-icon :size="28"><Connection /></el-icon></div>
          <div>
            <div class="ov-title">字段映射 + 去重</div>
            <div class="ov-desc">V1 最小治理，只处理能演示的导入问题</div>
            <div class="ov-stat">186 个字段 · 432 条疑似重复</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="ov-card warning">
          <div class="ov-icon"><el-icon :size="28"><WarningFilled /></el-icon></div>
          <div>
            <div class="ov-title">导入错误提示</div>
            <div class="ov-desc">错误行、字段冲突、缺失值集中展示</div>
            <div class="ov-stat">4.8% 错误率 · 待处理</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-alert
      type="warning"
      :closable="false"
      show-icon
      class="edge-alert"
      title="网络边界"
      description="外网应用与内网应用的接口、同步和隔离方案待技术确认；C 端不直连内网。"
    />

    <el-card shadow="never">
      <el-table :data="sources" style="width: 100%">
        <el-table-column prop="name" label="导入/接入项" min-width="200" />
        <el-table-column prop="phase" label="版本阶段" width="130">
          <template #default="{ row }">
            <el-tag size="small" :type="row.phase === 'V1 导入' ? 'success' : 'warning'" effect="plain">{{ row.phase }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="网络" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="row.fromNet === '外网' ? 'warning' : 'info'" effect="plain">{{ row.fromNet }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastSync" label="最近同步" width="110" />
        <el-table-column prop="count" label="今日条数" width="100" />
        <el-table-column label="错误率" width="100">
          <template #default="{ row }">{{ row.errorRate }}%</template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="statusType[row.status] as any">{{ statusLabel[row.status] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'error'" link type="danger">查看异常</el-button>
            <el-button v-else-if="row.phase === 'V1 导入'" link type="primary">详情</el-button>
            <el-button v-else link type="info">待接入</el-button>
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

.overview { margin-bottom: 16px; }
.ov-card {
  border-radius: 8px; padding: 16px; display: flex; gap: 14px; align-items: center; color: #fff;
}
.ov-card.primary { background: linear-gradient(135deg, #409eff, #337ecc); }
.ov-card.success { background: linear-gradient(135deg, #67c23a, #529b2e); }
.ov-card.warning { background: linear-gradient(135deg, #e6a23c, #cf9236); }
.ov-icon { opacity: 0.9; }
.ov-title { font-size: 16px; font-weight: 700; }
.ov-desc { font-size: 12px; opacity: 0.9; margin: 4px 0; }
.ov-stat { font-size: 13px; font-weight: 500; }

.edge-alert { margin-bottom: 16px; }
.edge-alert :deep(.el-alert__description) { font-size: 12px; }
</style>
