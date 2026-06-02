<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { desensitizeRules, type DesensitizeRule } from '@/mock/governance'

const rules = reactive<DesensitizeRule[]>(desensitizeRules.map((r) => ({ ...r })))

function toggle(r: DesensitizeRule) {
  ElMessage.success(`${r.field} 脱敏已${r.enabled ? '启用' : '停用'}`)
}
function addRule() { ElMessage.info('新增脱敏规则（原型占位）') }
</script>

<template>
  <div class="ds-page">
    <div class="page-head">
      <div>
        <h2>脱敏规则管理</h2>
        <p class="sub">脱敏前置：数据落库后第一步即脱敏，再进入清洗 / 映射 / 质控</p>
      </div>
      <div class="head-right">
        <el-button type="primary" @click="addRule">新增规则</el-button>
        <MockDataLabel />
      </div>
    </div>

    <el-alert
      type="success" :closable="false" show-icon class="tip"
      title="脱敏在治理链最前端"
      description="落库 → 脱敏 → 清洗 → 映射 → 质控 → 锁定。外网 C 端数据经边界网关进入，明文敏感字段会被拦截。"
    />

    <el-card shadow="never">
      <el-table :data="rules" style="width:100%">
        <el-table-column prop="field" label="字段" width="120" />
        <el-table-column prop="method" label="脱敏方式" min-width="140" />
        <el-table-column label="脱敏前" min-width="180">
          <template #default="{ row }"><span class="before">{{ row.before }}</span></template>
        </el-table-column>
        <el-table-column label="脱敏后" min-width="180">
          <template #default="{ row }"><span class="after">{{ row.after }}</span></template>
        </el-table-column>
        <el-table-column label="启用" width="90">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" @change="toggle(row)" />
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
.tip { margin-bottom: 16px; }
.before { color: #909399; }
.after { color: #67c23a; font-weight: 600; letter-spacing: 1px; }
</style>
