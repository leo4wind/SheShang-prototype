<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { queryDimensions, queryResults } from '@/mock/analytics'

const selected = reactive<Record<string, string[]>>({})
queryDimensions.forEach((d) => (selected[d.key] = []))

const searched = ref(false)

function query() {
  searched.value = true
  ElMessage.success(`查询完成，命中 ${queryResults.length} 条（mock）`)
}
function reset() {
  queryDimensions.forEach((d) => (selected[d.key] = []))
  searched.value = false
}
function exportData(fmt: string) {
  ElMessage.success(`已导出 ${queryResults.length} 条为 ${fmt}（脱敏，记录审计）`)
}
</script>

<template>
  <div class="query-page">
    <div class="page-head">
      <div>
        <h2>多维查询导出</h2>
        <p class="sub">按蛇种 / 严重度 / 医院 / 转归等维度组合查询，导出供科研使用（已脱敏）</p>
      </div>
      <MockDataLabel />
    </div>

    <el-card shadow="never" class="filter-card">
      <el-form label-width="80px">
        <el-row :gutter="16">
          <el-col :span="8" v-for="d in queryDimensions" :key="d.key">
            <el-form-item :label="d.label">
              <el-select v-model="selected[d.key]" multiple collapse-tags placeholder="不限" style="width:100%">
                <el-option v-for="o in d.options" :key="o" :label="o" :value="o" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="actions">
          <el-button type="primary" @click="query">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
      </el-form>
    </el-card>

    <el-card shadow="never" v-if="searched">
      <template #header>
        <div class="rh">
          <span class="bt">查询结果（{{ queryResults.length }}）</span>
          <div>
            <el-button size="small" @click="exportData('Excel')">导出 Excel</el-button>
            <el-button size="small" @click="exportData('CSV')">导出 CSV</el-button>
          </div>
        </div>
      </template>
      <el-table :data="queryResults" style="width:100%">
        <el-table-column prop="caseId" label="病例号" width="140" />
        <el-table-column prop="snake" label="蛇种" width="100" />
        <el-table-column prop="severity" label="严重度" width="90" />
        <el-table-column prop="hospital" label="收治医院" min-width="140" />
        <el-table-column prop="outcome" label="转归" width="90" />
        <el-table-column prop="los" label="住院天数" width="100" />
      </el-table>
    </el-card>

    <el-empty v-else description="设置维度后点击查询" />
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.filter-card { margin-bottom: 16px; }
.actions { text-align: right; }
.rh { display: flex; align-items: center; justify-content: space-between; }
.bt { font-weight: 600; }
</style>
