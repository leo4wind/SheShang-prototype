<script setup lang="ts">
import { ref } from 'vue'
import { hospitals, snakeTypes, type Hospital } from '@/mock/data'
import MockDataLabel from '@/components/MockDataLabel.vue'
import AlgoPlaceholder from '@/components/AlgoPlaceholder.vue'

const dialogVisible = ref(false)
const editing = ref<Hospital | null>(null)

function edit(h: Hospital) {
  editing.value = h
  dialogVisible.value = true
}

function serumOf(h: Hospital, snakeId: string): number {
  return h.serumStock[snakeId] ?? 0
}
</script>

<template>
  <div class="hospitals-admin">
    <div class="page-head">
      <div>
        <h2>医院与资质</h2>
        <p class="sub">维护医院、蛇伤救治资质、血清库存（库存对接赛伦生物）</p>
      </div>
      <MockDataLabel />
    </div>

    <AlgoPlaceholder
      kind="rule"
      title="血清库存接入"
      description="血清库存数据由赛伦生物接口实时同步，此处展示为 mock。库存为 0 时该医院在患者端将标记为「无血清」。"
    />

    <el-card shadow="never">
      <template #header>
        <div class="card-head-row">
          <span class="bt">医院列表</span>
          <el-button type="primary" size="small"><el-icon><Plus /></el-icon> 新增医院</el-button>
        </div>
      </template>

      <el-table :data="hospitals" style="width: 100%">
        <el-table-column prop="name" label="医院" min-width="120" />
        <el-table-column prop="level" label="等级" width="80" />
        <el-table-column label="蛇伤资质" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="row.hasQualification ? 'success' : 'danger'">
              {{ row.hasQualification ? '有' : '无' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="140" show-overflow-tooltip />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column label="血清库存（按蛇种）" min-width="240">
          <template #default="{ row }">
            <template v-for="s in snakeTypes.filter(s => s.venomous)" :key="s.id">
              <el-tag
                v-if="serumOf(row, s.id) > 0"
                size="small"
                effect="plain"
                class="serum-tag"
              >
                {{ s.name }} ×{{ serumOf(row, s.id) }}
              </el-tag>
            </template>
            <span v-if="!Object.keys(row.serumStock).length" class="no-serum">无</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="edit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="`编辑 · ${editing?.name ?? ''}`" width="520">
      <el-form v-if="editing" label-width="100px">
        <el-form-item label="医院名称"><el-input :model-value="editing.name" /></el-form-item>
        <el-form-item label="等级"><el-input :model-value="editing.level" /></el-form-item>
        <el-form-item label="蛇伤资质">
          <el-switch :model-value="editing.hasQualification" />
        </el-form-item>
        <el-form-item label="血清库存">
          <div class="serum-edit">
            <div v-for="s in snakeTypes.filter(s => s.venomous)" :key="s.id" class="serum-row">
              <span>{{ s.name }}</span>
              <el-input-number :model-value="serumOf(editing, s.id)" :min="0" size="small" />
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">保存（原型不持久化）</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.bt { font-weight: 600; }
.card-head-row { display: flex; align-items: center; justify-content: space-between; }
.serum-tag { margin: 2px 4px 2px 0; }
.no-serum { color: #f56c6c; }
.serum-edit { display: flex; flex-direction: column; gap: 8px; width: 100%; }
.serum-row { display: flex; align-items: center; justify-content: space-between; }
.serum-row span { font-size: 13px; }
</style>
