<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useCollabStore, REFERRAL_STATUS_LABEL } from '@/stores/collab'

const route = useRoute()
const router = useRouter()
const collab = useCollabStore()

// APP 接收方：默认展示收件箱里第一条待处理，或按 query 指定
const referralId = computed(() => (route.params.id as string) || collab.inboxReferrals[0]?.id || '')
const r = computed(() => collab.getReferral(referralId.value))

const urgencyType: Record<string, string> = { 一般: 'info', 紧急: 'warning', 危急: 'danger' }

function accept() {
  if (r.value) { collab.setReferralStatus(r.value.id, 'accepted'); ElMessage.success('已接受转诊') }
}
function reject() {
  if (r.value) { collab.setReferralStatus(r.value.id, 'rejected'); ElMessage.info('已拒绝转诊') }
}
</script>

<template>
  <div class="referral-detail">
    <PhoneNavBar title="转诊申请" back="/doctor-app/inbox" />

    <div v-if="!r" class="empty"><el-empty description="暂无转诊申请" /></div>

    <div v-else class="body">
      <div class="urgent-banner" :class="r.urgency">
        <el-icon><WarningFilled /></el-icon>
        <span>{{ r.urgency }}转诊 · {{ REFERRAL_STATUS_LABEL[r.status] }}</span>
      </div>

      <div class="card">
        <div class="block-title">患者信息</div>
        <div class="kv"><span>姓名</span><b>{{ r.patientName }}</b></div>
        <div class="kv"><span>现况</span><b>{{ r.snapshot }}</b></div>
        <div class="kv"><span>转出医生</span><b>{{ r.fromDoctor }}</b></div>
        <div class="kv"><span>转运方式</span><b>{{ r.transport }}</b></div>
        <div class="kv"><span>时间</span><b>{{ r.createdAt }}</b></div>
      </div>

      <div class="card">
        <div class="block-title">转诊原因</div>
        <p class="reason">{{ r.reason }}</p>
      </div>

      <div class="card">
        <div class="block-title">患者完整资料</div>
        <el-button link type="primary">查看病历 / 影像（专病库 D1+D2）</el-button>
      </div>

      <div v-if="r.status === 'pending'" class="actions">
        <el-button type="success" size="large" @click="accept">接受转诊</el-button>
        <el-button size="large" @click="reject">拒绝</el-button>
        <el-button link type="primary">申请补充资料</el-button>
      </div>
      <el-result v-else :icon="r.status === 'rejected' ? 'info' : 'success'" :title="REFERRAL_STATUS_LABEL[r.status]" />
    </div>
  </div>
</template>

<style scoped>
.referral-detail { min-height: 100%; background: #f0f2f5; }
.empty { padding-top: 60px; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }

.urgent-banner {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px; border-radius: 8px; font-size: 14px; font-weight: 600;
}
.urgent-banner.危急 { background: #fef0f0; color: #f56c6c; }
.urgent-banner.紧急 { background: #fdf6ec; color: #e6a23c; }
.urgent-banner.一般 { background: #f4f4f5; color: #909399; }

.card { background: #fff; border-radius: 10px; padding: 14px; }
.block-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.kv { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
.kv span { color: #909399; }
.reason { font-size: 13px; line-height: 1.6; margin: 0; color: #606266; }

.actions { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.actions .el-button { width: 100%; margin-left: 0; }
</style>
