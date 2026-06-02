<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useCollabStore, REFERRAL_STATUS_LABEL, MDT_STATUS_LABEL } from '@/stores/collab'

const router = useRouter()
const collab = useCollabStore()

const VIEWER_ID = 'd-03'

// 待我处理的转诊
const pendingReferrals = computed(() => collab.inboxReferrals.filter((r) => r.status === 'pending'))
// 邀请我的 MDT
const myMdts = computed(() =>
  collab.mdts.filter((m) => m.invitees.some((i) => i.doctorId === VIEWER_ID))
)
</script>

<template>
  <div class="inbox">
    <PhoneNavBar title="收件箱" theme="primary" />

    <div class="body">
      <!-- 转诊 -->
      <div class="section">
        <div class="sec-title"><el-icon><Switch /></el-icon> 转诊申请 ({{ pendingReferrals.length }})</div>
        <el-empty v-if="!pendingReferrals.length" description="无" :image-size="50" />
        <div v-for="r in pendingReferrals" :key="r.id" class="item" @click="router.push(`/doctor-app/referral/${r.id}`)">
          <div class="item-top">
            <b>{{ r.patientName }}</b>
            <el-tag size="small" :type="r.urgency === '危急' ? 'danger' : 'warning'">{{ r.urgency }}</el-tag>
          </div>
          <div class="item-sub">{{ r.snapshot }} · 来自 {{ r.fromDoctor }}</div>
          <div class="item-status">{{ REFERRAL_STATUS_LABEL[r.status] }}</div>
        </div>
      </div>

      <!-- MDT -->
      <div class="section">
        <div class="sec-title"><el-icon><ChatDotRound /></el-icon> MDT 会诊邀请 ({{ myMdts.length }})</div>
        <el-empty v-if="!myMdts.length" description="无" :image-size="50" />
        <div v-for="m in myMdts" :key="m.id" class="item" @click="router.push(`/doctor-app/mdt/${m.id}`)">
          <div class="item-top">
            <b>{{ m.patientName }}</b>
            <el-tag size="small" type="info">{{ MDT_STATUS_LABEL[m.status] }}</el-tag>
          </div>
          <div class="item-sub">{{ m.topic }}</div>
          <div class="item-status">{{ m.scheduledAt }} · 主持 {{ m.host }}</div>
        </div>
      </div>

      <!-- 共享 -->
      <div class="section">
        <div class="sec-title"><el-icon><Share /></el-icon> 共享给我的患者 ({{ collab.sharedToMe.length }})</div>
        <el-empty v-if="!collab.sharedToMe.length" description="无" :image-size="50" />
        <div v-for="s in collab.sharedToMe" :key="s.id" class="item" @click="router.push('/doctor-app/shared')">
          <div class="item-top">
            <b>{{ s.patientName }}</b>
            <el-tag size="small" effect="plain">{{ s.scope }}</el-tag>
          </div>
          <div class="item-sub">来自 {{ s.fromDoctor }} · 到期 {{ s.expireAt }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inbox { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 16px; }
.section { }
.sec-title { font-size: 13px; font-weight: 600; color: #303133; display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
.item { background: #fff; border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; cursor: pointer; }
.item-top { display: flex; align-items: center; gap: 8px; }
.item-sub { font-size: 12px; color: #606266; margin-top: 4px; line-height: 1.4; }
.item-status { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
