<script setup lang="ts">
import { useCollabStore } from '@/stores/collab'
import { getPatientBrief } from '@/mock/data'
import MockDataLabel from '@/components/MockDataLabel.vue'

const collab = useCollabStore()

function brief(patientId: string) {
  return getPatientBrief(patientId)
}
</script>

<template>
  <div class="shared-page">
    <div class="page-head">
      <div>
        <h2>共享给我的患者</h2>
        <p class="sub">其他医生共享给我的患者，在有效期内可查看</p>
      </div>
      <MockDataLabel />
    </div>

    <el-card shadow="never">
      <el-empty v-if="!collab.sharedToMe.length" description="暂无共享" />
      <el-table v-else :data="collab.sharedToMe" style="width: 100%">
        <el-table-column label="患者" min-width="120">
          <template #default="{ row }">
            {{ row.patientName }}
            <span class="diag">{{ brief(row.patientId)?.diagnosis }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fromDoctor" label="共享人" width="100" />
        <el-table-column label="范围" width="110">
          <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.scope }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="expireAt" label="到期日" width="120" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default><el-button link type="primary">查看患者 360</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.diag { font-size: 12px; color: #909399; margin-left: 6px; }
</style>
