<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { followupNodes } from '@/mock/care'

const templates = [
  { id: 'tpl-std', name: '标准蛇伤随访方案', scope: '全部出院患者', nodeCount: followupNodes.length, active: true },
  { id: 'tpl-severe', name: '重症蛇伤强化随访', scope: '重/危重患者', nodeCount: 8, active: true },
  { id: 'tpl-neuro', name: '神经毒类专项随访', scope: '银环蛇等', nodeCount: 7, active: false }
]
const activeTpl = ref('tpl-std')

const allActions = ['复查', '随访问卷', '知识推送'] as const

function save() { ElMessage.success('随访方案已保存（mock）') }
function addNode() { ElMessage.info('新增随访节点（原型占位）') }
</script>

<template>
  <div class="fp-page">
    <div class="page-head">
      <div>
        <h2>随访计划管理</h2>
        <p class="sub">维护随访方案模板，出院时按蛇种/严重度自动套用</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16">
      <el-col :span="7">
        <el-card shadow="never">
          <template #header><span class="bt">方案模板</span></template>
          <div
            v-for="t in templates" :key="t.id"
            class="tpl" :class="{ active: activeTpl === t.id }"
            @click="activeTpl = t.id"
          >
            <div class="tpl-top">
              <b>{{ t.name }}</b>
              <el-tag size="small" :type="t.active ? 'success' : 'info'">{{ t.active ? '启用' : '停用' }}</el-tag>
            </div>
            <div class="tpl-meta">{{ t.scope }} · {{ t.nodeCount }} 个节点</div>
          </div>
          <el-button class="add-tpl" @click="addNode">+ 新建方案</el-button>
        </el-card>
      </el-col>

      <el-col :span="17">
        <el-card shadow="never">
          <template #header>
            <div class="card-head">
              <span class="bt">节点配置 · 标准蛇伤随访方案</span>
              <div>
                <el-button size="small" @click="addNode">新增节点</el-button>
                <el-button size="small" type="primary" @click="save">保存</el-button>
              </div>
            </div>
          </template>
          <el-table :data="followupNodes" style="width:100%">
            <el-table-column prop="dayOffset" label="出院后" width="90">
              <template #default="{ row }">第 {{ row.dayOffset }} 天</template>
            </el-table-column>
            <el-table-column prop="label" label="节点名" min-width="140" />
            <el-table-column label="动作" min-width="220">
              <template #default="{ row }">
                <el-check-tag
                  v-for="a in allActions" :key="a"
                  :checked="row.actions.includes(a)"
                  class="act-tag"
                >{{ a }}</el-check-tag>
              </template>
            </el-table-column>
            <el-table-column label="提醒" width="120">
              <template #default><el-switch :model-value="true" /></template>
            </el-table-column>
          </el-table>
          <div class="note">动作变更将影响所有套用此方案的新出院患者；存量患者计划不变。</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.bt { font-weight: 600; }
.card-head { display: flex; align-items: center; justify-content: space-between; }
.tpl { border: 1px solid #ebeef5; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: pointer; }
.tpl.active { border-color: #409eff; background: #ecf5ff; }
.tpl-top { display: flex; justify-content: space-between; align-items: center; }
.tpl-meta { font-size: 12px; color: #909399; margin-top: 4px; }
.add-tpl { width: 100%; }
.act-tag { margin-right: 6px; }
.note { font-size: 12px; color: #c0c4cc; margin-top: 10px; }
</style>
