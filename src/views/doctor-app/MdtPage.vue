<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useCollabStore, MDT_STATUS_LABEL } from '@/stores/collab'

const route = useRoute()
const router = useRouter()
const collab = useCollabStore()

// 受邀方视角：演示用陈志远(d-03)，因为预置 MDT 邀请了他
const VIEWER_ID = 'd-03'

const mdtId = computed(() => {
  const id = route.params.id as string
  if (id && id !== 'demo') return id
  return collab.mdts[0]?.id ?? ''
})
const m = computed(() => collab.getMdt(mdtId.value))
const myInvite = computed(() => m.value?.invitees.find((i) => i.doctorId === VIEWER_ID))

function accept() {
  if (m.value) { collab.replyMdt(m.value.id, VIEWER_ID, 'accepted'); ElMessage.success('已接受邀请') }
}
function reject() {
  if (m.value) { collab.replyMdt(m.value.id, VIEWER_ID, 'rejected'); ElMessage.info('已拒绝邀请') }
}
function enterRoom() {
  if (m.value) router.push(`/doctor-app/mdt/room/${m.value.id}`)
}
</script>

<template>
  <div class="mdt-detail">
    <PhoneNavBar title="MDT 邀请" back="/doctor-app/inbox" />

    <div v-if="!m" class="empty"><el-empty description="暂无会诊邀请" /></div>

    <div v-else class="body">
      <div class="banner">
        <el-icon><ChatDotRound /></el-icon>
        <span>{{ m.host }} 邀请你参加 MDT · {{ MDT_STATUS_LABEL[m.status] }}</span>
      </div>

      <div class="card">
        <div class="block-title">会诊议题</div>
        <p class="topic">{{ m.topic }}</p>
      </div>

      <div class="card">
        <div class="kv"><span>患者</span><b>{{ m.patientName }}</b></div>
        <div class="kv"><span>时间</span><b>{{ m.scheduledAt }}</b></div>
        <div class="kv"><span>主持</span><b>{{ m.host }}</b></div>
        <div class="kv"><span>我的专科</span><b>{{ myInvite?.specialty ?? '—' }}</b></div>
      </div>

      <div class="card">
        <div class="block-title">参会专家</div>
        <div v-for="inv in m.invitees" :key="inv.doctorId" class="invitee">
          <span>{{ inv.name }} · {{ inv.specialty }}</span>
          <el-tag size="small" :type="inv.reply === 'accepted' ? 'success' : inv.reply === 'rejected' ? 'danger' : 'info'">
            {{ inv.reply === 'accepted' ? '已接受' : inv.reply === 'rejected' ? '已拒绝' : '待回复' }}
          </el-tag>
        </div>
      </div>

      <div v-if="myInvite?.reply === 'pending'" class="actions">
        <el-button type="success" size="large" @click="accept">接受邀请</el-button>
        <el-button size="large" @click="reject">拒绝</el-button>
      </div>
      <div v-else-if="myInvite?.reply === 'accepted'" class="actions">
        <el-button type="primary" size="large" @click="enterRoom">进入会诊室</el-button>
      </div>
      <el-result v-else icon="info" title="已拒绝该邀请" />
    </div>
  </div>
</template>

<style scoped>
.mdt-detail { min-height: 100%; background: #f0f2f5; }
.empty { padding-top: 60px; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }
.banner {
  display: flex; align-items: center; gap: 6px; padding: 10px 14px;
  background: #ecf5ff; color: #409eff; border-radius: 8px; font-size: 14px; font-weight: 600;
}
.card { background: #fff; border-radius: 10px; padding: 14px; }
.block-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.topic { font-size: 14px; line-height: 1.6; margin: 0; }
.kv { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
.kv span { color: #909399; }
.invitee { display: flex; align-items: center; justify-content: space-between; font-size: 13px; padding: 5px 0; }
.actions { display: flex; flex-direction: column; gap: 8px; }
.actions .el-button { width: 100%; margin-left: 0; }
</style>
