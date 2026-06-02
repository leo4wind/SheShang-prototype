<script setup lang="ts">
import { useRouter } from 'vue-router'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useCareStore } from '@/stores/care'

const router = useRouter()
const care = useCareStore()

const actionColor: Record<string, string> = {
  复查: '#409eff',
  随访问卷: '#67c23a',
  知识推送: '#e6a23c'
}

function openNode(actions: string[]) {
  if (actions.includes('复查')) router.push('/patient/care/recheck/demo')
}
</script>

<template>
  <div class="timeline-page">
    <PhoneNavBar title="我的随访计划" back="/patient/home" />

    <div class="body">
      <div class="summary">
        <div class="s-item"><b>{{ care.completedCount }}</b><span>已完成</span></div>
        <div class="s-item"><b>{{ care.nodes.length }}</b><span>总节点</span></div>
        <div class="s-item" v-if="care.nextNode"><b>{{ care.nextNode.date.slice(5) }}</b><span>下次随访</span></div>
      </div>

      <div class="hint">出院后系统自动生成随访计划，按节点提醒复查、推送问卷与知识</div>

      <el-timeline class="tl">
        <el-timeline-item
          v-for="n in care.nodes"
          :key="n.id"
          :type="n.done ? 'success' : (n === care.nextNode ? 'primary' : 'info')"
          :hollow="!n.done"
          :timestamp="n.date"
          placement="top"
        >
          <div class="node" :class="{ next: n === care.nextNode }" @click="openNode(n.actions)">
            <div class="node-top">
              <span class="node-label">{{ n.label }}</span>
              <el-tag v-if="n.done" size="small" type="success">已完成</el-tag>
              <el-tag v-else-if="n === care.nextNode" size="small" type="primary">待进行</el-tag>
            </div>
            <div class="node-actions">
              <span
                v-for="a in n.actions"
                :key="a"
                class="action-chip"
                :style="{ color: actionColor[a], borderColor: actionColor[a] }"
              >{{ a }}</span>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<style scoped>
.timeline-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 14px; }
.summary {
  background: #fff; border-radius: 10px; padding: 16px;
  display: flex; justify-content: space-around; margin-bottom: 12px;
}
.s-item { text-align: center; }
.s-item b { font-size: 22px; color: #409eff; }
.s-item span { display: block; font-size: 12px; color: #909399; margin-top: 2px; }
.hint { font-size: 12px; color: #909399; margin-bottom: 16px; line-height: 1.5; }

.tl { padding-left: 4px; }
.node {
  background: #fff; border-radius: 8px; padding: 12px; cursor: pointer;
  border: 1px solid transparent;
}
.node.next { border-color: #d9ecff; background: #ecf5ff; }
.node-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.node-label { font-size: 14px; font-weight: 600; }
.node-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.action-chip {
  font-size: 11px; padding: 1px 8px; border: 1px solid; border-radius: 10px;
}
</style>
