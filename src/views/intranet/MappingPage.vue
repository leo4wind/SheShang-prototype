<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import AlgoPlaceholder from '@/components/AlgoPlaceholder.vue'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { mappingFreeText, mappingExtracts, type MappingExtract } from '@/mock/governance'

const extracts = reactive<MappingExtract[]>(mappingExtracts.map((e) => ({ ...e })))

function confirm(e: MappingExtract) {
  e.status = '已确认'
  ElMessage.success(`已确认：${e.field} → ${e.mappedTo}`)
}
function correct(e: MappingExtract) {
  ElMessage.info(`人工纠正：${e.field}（原型占位，可改映射目标）`)
}
</script>

<template>
  <div class="map-page">
    <div class="page-head">
      <div>
        <h2>映射工作台</h2>
        <p class="sub">自由文本 → 结构化字段：NLP 抽取 + 字典映射，人工确认 / 纠正</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16">
      <el-col :span="10">
        <el-card shadow="never">
          <template #header><span class="bt">原始病历文本</span></template>
          <p class="freetext">{{ mappingFreeText }}</p>
        </el-card>
      </el-col>
      <el-col :span="14">
        <AlgoPlaceholder kind="nlp" title="NLP 结构化抽取" description="抽取实体并映射到标准字典，低置信度项需人工确认">
          <el-table :data="extracts" style="width:100%" size="small">
            <el-table-column prop="field" label="字段" width="100" />
            <el-table-column prop="value" label="抽取值" min-width="100" />
            <el-table-column prop="mappedTo" label="映射到" min-width="130" />
            <el-table-column label="置信度" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.confidence" :stroke-width="6"
                  :color="row.confidence >= 85 ? '#67c23a' : '#e6a23c'" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130" fixed="right">
              <template #default="{ row }">
                <template v-if="row.status === '待确认'">
                  <el-button link type="success" @click="confirm(row)">确认</el-button>
                  <el-button link type="primary" @click="correct(row)">纠正</el-button>
                </template>
                <el-tag v-else size="small" type="success">已确认</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </AlgoPlaceholder>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.bt { font-weight: 600; }
.freetext { font-size: 14px; line-height: 1.9; color: #303133; margin: 0; }
</style>
