<script setup lang="ts">
import MockDataLabel from '@/components/MockDataLabel.vue'

// 数据源接入状态（单通道统一接入）
interface SourceStatus {
  name: string
  fromNet: '外网' | '内网'
  lastSync: string
  count: number
  errorRate: number
  status: 'ok' | 'warn' | 'error'
}

const sources: SourceStatus[] = [
  { name: '患者小程序（求救/上报）', fromNet: '外网', lastSync: '刚刚', count: 128, errorRate: 0.2, status: 'ok' },
  { name: '120 出车记录', fromNet: '内网', lastSync: '1 分钟前', count: 36, errorRate: 0, status: 'ok' },
  { name: '医生录入（就诊/判定）', fromNet: '内网', lastSync: '刚刚', count: 54, errorRate: 0, status: 'ok' },
  { name: 'HIS（病案/医嘱）', fromNet: '内网', lastSync: '10 分钟前', count: 1820, errorRate: 1.2, status: 'warn' },
  { name: 'LIS（化验/检验）', fromNet: '内网', lastSync: '10 分钟前', count: 942, errorRate: 0.5, status: 'ok' },
  { name: 'PACS（影像）', fromNet: '内网', lastSync: '30 分钟前', count: 213, errorRate: 0, status: 'ok' },
  { name: '旧专病库迁移', fromNet: '内网', lastSync: '2 小时前', count: 5600, errorRate: 4.8, status: 'error' }
]

const totalCount = sources.reduce((a, b) => a + b.count, 0)

const statusType: Record<string, string> = { ok: 'success', warn: 'warning', error: 'danger' }
const statusLabel: Record<string, string> = { ok: '正常', warn: '告警', error: '异常' }
</script>

<template>
  <div class="ingest-page">
    <div class="page-head">
      <div>
        <h2>
          数据接入监控
          <span class="priority-tag v1">v1</span>
          <span class="hidden-hint">（左菜单已隐藏，仅通过路由访问）</span>
        </h2>
        <p class="sub">多源数据统一接入监控 · 删除冷热双通道，改单一同步通道</p>
      </div>
      <MockDataLabel />
    </div>

    <el-alert
      type="warning"
      :closable="false"
      show-icon
      class="edge-alert"
      title="内外网隔离"
      description="外网（C 端小程序）数据经隔离通道进入内网，不直连。C 端来源已标记「外网」。接口方案待技术确认。"
    />

    <el-card shadow="never">
      <template #header>
        <div class="table-head">
          <span>数据源状态</span>
          <span class="table-stat">共 {{ sources.length }} 个源 · 今日 {{ totalCount }} 条</span>
        </div>
      </template>
      <el-table :data="sources" style="width: 100%">
        <el-table-column prop="name" label="数据源" min-width="200" />
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
            <el-button v-else link type="primary">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }

.hidden-hint {
  font-size: 12px;
  color: #e6a23c;
  font-weight: 400;
}

.edge-alert { margin-bottom: 16px; }
.edge-alert :deep(.el-alert__description) { font-size: 12px; }

.table-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
}

.table-stat {
  font-size: 12px;
  color: #909399;
  font-weight: 400;
}
</style>
