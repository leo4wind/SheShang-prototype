<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { crfSections } from '@/mock/governance'

const sections = reactive(crfSections.map((s) => ({ ...s, fields: s.fields.map((f) => ({ ...f })) })))

function save() { ElMessage.success('CRF 已保存（草稿）') }
function submit() { ElMessage.success('CRF 已提交，进入科研数据集（脱敏）') }
function exportCrf() { ElMessage.success('已导出 CRF（PDF / EDC 格式）') }
</script>

<template>
  <div class="crf-page">
    <div class="page-head">
      <div>
        <h2>科研 CRF</h2>
        <p class="sub">病例报告表：从专病库带出脱敏字段，科研人员补录并提交</p>
      </div>
      <div class="head-right">
        <el-button @click="exportCrf">导出</el-button>
        <el-button @click="save">暂存</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
        <MockDataLabel />
      </div>
    </div>

    <el-card v-for="s in sections" :key="s.title" shadow="never" class="sec">
      <template #header><span class="bt">{{ s.title }}</span></template>
      <el-form label-width="140px">
        <el-row :gutter="20">
          <el-col :span="12" v-for="f in s.fields" :key="f.label">
            <el-form-item :label="f.label">
              <el-input v-model="f.value" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.head-right { display: flex; align-items: center; gap: 10px; }
.bt { font-weight: 600; }
.sec { margin-bottom: 16px; }
</style>
