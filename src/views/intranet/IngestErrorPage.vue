<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ingestErrors } from '@/mock/analytics'

const route = useRoute()
const router = useRouter()

const err = computed(() => {
  const id = route.params.id as string
  return ingestErrors.find((e) => e.id === id) ?? ingestErrors[0]
})

const statusType: Record<string, string> = { 待处理: 'danger', 重试中: 'warning', 已解决: 'success' }

function retry() { ElMessage.success('已触发重试，进入重试队列') }
function ignore() { ElMessage.info('已忽略该条异常（记录审计日志）') }
</script>

<template>
  <div class="ie-page">
    <el-page-header @back="router.push('/intranet/ingest')" class="ph">
      <template #content><span class="title">同步异常详情 · {{ err.id }}</span></template>
    </el-page-header>

    <el-row :gutter="16" class="top">
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="ch">
              <span class="bt">{{ err.type }}</span>
              <el-tag :type="statusType[err.status] as any">{{ err.status }}</el-tag>
            </div>
          </template>
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="数据源">{{ err.source }}</el-descriptions-item>
            <el-descriptions-item label="发生时间">{{ err.occurredAt }}</el-descriptions-item>
            <el-descriptions-item label="重试次数">{{ err.retryCount }}</el-descriptions-item>
            <el-descriptions-item label="错误信息">{{ err.message }}</el-descriptions-item>
          </el-descriptions>

          <div class="block">
            <div class="bt2">调用栈</div>
            <pre class="code">{{ err.stack.join('\n') }}</pre>
          </div>
          <div class="block">
            <div class="bt2">原始报文（已脱敏展示）</div>
            <pre class="code payload">{{ err.payload }}</pre>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never">
          <template #header><span class="bt">处理</span></template>
          <el-button type="primary" class="full" @click="retry">重新同步</el-button>
          <el-button class="full" @click="router.push('/intranet/ingest')">查看数据源</el-button>
          <el-button class="full" @click="ignore">忽略</el-button>
          <el-divider />
          <div class="hint">
            字段映射类异常通常需在「脱敏规则管理 / 映射工作台」补充字典；脱敏校验类异常会被边界网关拦截，不会进入内网。
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.ph { margin-bottom: 16px; }
.title { font-size: 18px; font-weight: 700; }
.ch { display: flex; align-items: center; justify-content: space-between; }
.bt { font-weight: 600; }
.bt2 { font-size: 13px; font-weight: 600; margin: 14px 0 6px; }
.code { background: #1e1e1e; color: #d4d4d4; border-radius: 6px; padding: 12px; font-size: 12px; line-height: 1.6; overflow-x: auto; white-space: pre-wrap; }
.payload { background: #f5f7fa; color: #606266; }
.full { width: 100%; margin: 0 0 10px; }
.hint { font-size: 12px; color: #909399; line-height: 1.6; }
</style>
