<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useRescueStore } from '@/stores/rescue'
import { selfRescueTemplates } from '@/mock/data'

const route = useRoute()
const router = useRouter()
const rescue = useRescueStore()

// 通过 query 关联事件；没有则让医生从下拉选活跃事件
const queryEventId = computed(() => route.query.event as string | undefined)
const selectedEventId = ref<string>(queryEventId.value ?? rescue.activeEvents[0]?.id ?? '')
const ev = computed(() => rescue.getEvent(selectedEventId.value))

const selectedTpl = ref<string[]>([])

function isPushed(tplId: string): boolean {
  return ev.value?.pushedGuides.some((g) => g.templateId === tplId) ?? false
}

function push() {
  if (!ev.value) {
    ElMessage.warning('请选择一个求救事件')
    return
  }
  if (!selectedTpl.value.length) {
    ElMessage.warning('请至少选择一条指引')
    return
  }
  let count = 0
  selectedTpl.value.forEach((id) => {
    const tpl = selfRescueTemplates.find((t) => t.id === id)
    if (tpl && !isPushed(id)) {
      rescue.pushGuide(ev.value!.id, tpl)
      count++
    }
  })
  ElMessage.success(`已推送 ${count} 条自救指引到患者端`)
  selectedTpl.value = []
}
</script>

<template>
  <div class="guide-push">
    <div class="page-head">
      <el-button link @click="router.back()"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
      <h2>自救指引推送</h2>
    </div>

    <el-card shadow="never" class="block">
      <div class="event-select">
        <span class="label">关联事件：</span>
        <el-select v-model="selectedEventId" placeholder="选择求救事件" style="width: 260px">
          <el-option
            v-for="e in rescue.activeEvents"
            :key="e.id"
            :value="e.id"
            :label="`${e.id} · ${e.patientName} · ${e.location}`"
          />
        </el-select>
        <span v-if="ev?.report" class="symptom">症状：{{ ev.report.symptoms }}</span>
      </div>
    </el-card>

    <el-card shadow="never" class="block">
      <template #header><span class="bt">选择要推送的指引模板</span></template>
      <el-checkbox-group v-model="selectedTpl">
        <div v-for="t in selfRescueTemplates" :key="t.id" class="tpl" :class="{ pushed: isPushed(t.id) }">
          <el-checkbox :value="t.id" :disabled="isPushed(t.id)">
            <span class="tpl-title">{{ t.title }}</span>
            <el-tag v-if="isPushed(t.id)" size="small" type="success">已推送</el-tag>
          </el-checkbox>
          <ol class="tpl-steps">
            <li v-for="(s, i) in t.steps" :key="i">{{ s }}</li>
          </ol>
          <div v-if="t.warning" class="tpl-warn"><el-icon><WarningFilled /></el-icon> {{ t.warning }}</div>
        </div>
      </el-checkbox-group>
    </el-card>

    <div class="action-bar">
      <el-button type="primary" :disabled="!selectedTpl.length" @click="push">
        推送选中指引（{{ selectedTpl.length }}）
      </el-button>
      <el-button v-if="ev" type="success" plain @click="router.push(`/doctor/diagnosis-rule/${ev.id}`)">
        前往蛇伤判定 →
      </el-button>
      <el-button v-if="ev" @click="router.push(`/doctor/patient-realtime/${ev.id}`)">返回患者视图</el-button>
    </div>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 18px; }
.block { margin-bottom: 16px; }
.bt { font-weight: 600; }

.event-select { display: flex; align-items: center; gap: 10px; }
.event-select .label { font-size: 13px; color: #606266; }
.event-select .symptom { font-size: 13px; color: #909399; margin-left: 8px; }

.tpl {
  border: 1px solid #ebeef5; border-radius: 8px; padding: 12px 14px; margin-bottom: 12px;
  font-size: 14px; line-height: 1.6;
}
.tpl.pushed { background: #f0f9eb; border-color: #e1f3d8; }
.tpl-title { font-weight: 600; margin-right: 8px; }
.tpl-steps { padding-left: 20px; margin: 8px 0; }
.tpl-steps li { font-size: 13px; line-height: 1.6; margin: 3px 0; color: #606266; }
.tpl-warn { font-size: 12px; line-height: 1.6; color: #f56c6c; display: flex; align-items: center; gap: 4px; }

.action-bar { display: flex; gap: 12px; }
</style>
