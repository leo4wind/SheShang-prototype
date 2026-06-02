<script setup lang="ts">
import { ref } from 'vue'
import MockDataLabel from '@/components/MockDataLabel.vue'

// 数据源接入状态（呼应 docs/data-flow.md 的冷热双通道）
interface SourceStatus {
  name: string
  channel: 'hot' | 'cold'
  fromNet: '外网' | '内网'
  lastSync: string
  count: number
  errorRate: number
  status: 'ok' | 'warn' | 'error'
}

const sources: SourceStatus[] = [
  { name: '患者小程序（求救/上报）', channel: 'hot', fromNet: '外网', lastSync: '刚刚', count: 128, errorRate: 0.2, status: 'ok' },
  { name: '120 出车记录', channel: 'hot', fromNet: '内网', lastSync: '1 分钟前', count: 36, errorRate: 0, status: 'ok' },
  { name: '医生录入（就诊/判定）', channel: 'hot', fromNet: '内网', lastSync: '刚刚', count: 54, errorRate: 0, status: 'ok' },
  { name: 'HIS（病案/医嘱）', channel: 'cold', fromNet: '内网', lastSync: '10 分钟前', count: 1820, errorRate: 1.2, status: 'warn' },
  { name: 'LIS（化验/检验）', channel: 'cold', fromNet: '内网', lastSync: '10 分钟前', count: 942, errorRate: 0.5, status: 'ok' },
  { name: 'PACS（影像）', channel: 'cold', fromNet: '内网', lastSync: '30 分钟前', count: 213, errorRate: 0, status: 'ok' },
  { name: '旧专病库迁移', channel: 'cold', fromNet: '内网', lastSync: '2 小时前', count: 5600, errorRate: 4.8, status: 'error' }
]

const activeTab = ref<'hot' | 'cold'>('hot')

const statusType: Record<string, string> = { ok: 'success', warn: 'warning', error: 'danger' }
const statusLabel: Record<string, string> = { ok: '正常', warn: '告警', error: '异常' }

function rows(channel: 'hot' | 'cold') {
  return sources.filter((s) => s.channel === channel)
}
function sum(channel: 'hot' | 'cold') {
  return rows(channel).reduce((a, b) => a + b.count, 0)
}
</script>

<template>
  <div class="ingest-page">
    <div class="page-head">
      <div>
        <h2>数据接入监控</h2>
        <p class="sub">多源数据按时效冷热分流接入（见 docs/data-flow.md）</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16" class="overview">
      <el-col :span="12">
        <div class="ov-card hot">
          <div class="ov-icon"><el-icon :size="28"><Lightning /></el-icon></div>
          <div>
            <div class="ov-title">热通道（实时）</div>
            <div class="ov-desc">轻量清洗 + 脱敏 → 实时只读库，供急救秒级调阅</div>
            <div class="ov-stat">{{ sum('hot') }} 条 / 今日 · {{ rows('hot').length }} 个源</div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="ov-card cold">
          <div class="ov-icon"><el-icon :size="28"><Coin /></el-icon></div>
          <div>
            <div class="ov-title">冷通道（离线）</div>
            <div class="ov-desc">完整治理（脱敏→清洗→映射→质控）→ 专病库</div>
            <div class="ov-stat">{{ sum('cold') }} 条 / 今日 · {{ rows('cold').length }} 个源</div>
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
      description="外网（C 端小程序）数据经隔离通道进入内网，不直连。C 端来源已标记「外网」。"
    />

    <el-card shadow="never">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="热通道" name="hot" />
        <el-tab-pane label="冷通道" name="cold" />
      </el-tabs>
      <el-table :data="rows(activeTab)" style="width: 100%">
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
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }

.overview { margin-bottom: 16px; }
.ov-card {
  border-radius: 8px; padding: 16px; display: flex; gap: 14px; align-items: center; color: #fff;
}
.ov-card.hot { background: linear-gradient(135deg, #f56c6c, #e6772e); }
.ov-card.cold { background: linear-gradient(135deg, #409eff, #5a4fcf); }
.ov-icon { opacity: 0.9; }
.ov-title { font-size: 16px; font-weight: 700; }
.ov-desc { font-size: 12px; opacity: 0.9; margin: 4px 0; }
.ov-stat { font-size: 13px; font-weight: 500; }

.edge-alert { margin-bottom: 16px; }
.edge-alert :deep(.el-alert__description) { font-size: 12px; }
</style>
