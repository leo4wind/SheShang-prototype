<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCollabStore, REFERRAL_STATUS_LABEL, type ReferralStatus } from '@/stores/collab'

const route = useRoute()
const router = useRouter()
const collab = useCollabStore()

const referralId = computed(() => {
  const id = route.params.id as string
  if (id && id !== 'demo') return id
  return collab.referrals[0]?.id ?? ''
})
const r = computed(() => collab.getReferral(referralId.value))

const TRACK: ReferralStatus[] = ['pending', 'accepted', 'transferring', 'arrived']
const stepIndex = computed(() => {
  if (!r.value) return 0
  if (r.value.status === 'rejected') return 1
  return TRACK.indexOf(r.value.status)
})

const urgencyType: Record<string, string> = { 一般: 'info', 紧急: 'warning', 危急: 'danger' }
</script>

<template>
  <div v-if="!r" class="empty">
    <el-result icon="warning" title="未找到转诊单">
      <template #extra><el-button @click="router.push('/doctor/referral/new')">发起转诊</el-button></template>
    </el-result>
  </div>

  <div v-else class="referral-track">
    <div class="page-head">
      <el-button link @click="router.push('/doctor/referral/new')"><el-icon><ArrowLeft /></el-icon> 新建转诊</el-button>
      <h2>转诊跟踪 · {{ r.id }}</h2>
      <el-tag :type="urgencyType[r.urgency] as any">{{ r.urgency }}</el-tag>
    </div>

    <el-card shadow="never" class="block">
      <el-steps v-if="r.status !== 'rejected'" :active="stepIndex" finish-status="success" align-center>
        <el-step v-for="s in TRACK" :key="s" :title="REFERRAL_STATUS_LABEL[s]" />
      </el-steps>
      <el-alert v-else type="error" :closable="false" show-icon title="接收方已拒绝该转诊" />
    </el-card>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card shadow="never" class="block">
          <template #header><span class="bt">转诊信息</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item label="患者">{{ r.patientName }}</el-descriptions-item>
            <el-descriptions-item label="发起医生">{{ r.fromDoctor }}</el-descriptions-item>
            <el-descriptions-item label="接收医院">{{ r.toHospitalName }}</el-descriptions-item>
            <el-descriptions-item label="转运方式">{{ r.transport }}</el-descriptions-item>
            <el-descriptions-item label="发起时间">{{ r.createdAt }}</el-descriptions-item>
            <el-descriptions-item label="现况">{{ r.snapshot }}</el-descriptions-item>
            <el-descriptions-item label="原因">{{ r.reason }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never" class="block">
          <template #header><span class="bt">演示：模拟接收方操作</span></template>
          <p class="demo-hint">实际由接收医院在「医生端 APP」处理（P207）。这里提供快捷按钮便于演示。</p>
          <div class="demo-actions">
            <el-button type="success" :disabled="r.status !== 'pending'" @click="collab.setReferralStatus(r.id, 'accepted')">接受</el-button>
            <el-button type="danger" :disabled="r.status !== 'pending'" @click="collab.setReferralStatus(r.id, 'rejected')">拒绝</el-button>
            <el-button :disabled="r.status !== 'accepted'" @click="collab.setReferralStatus(r.id, 'transferring')">开始转运</el-button>
            <el-button :disabled="r.status !== 'transferring'" @click="collab.setReferralStatus(r.id, 'arrived')">已到达</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.empty { padding-top: 60px; }
.page-head { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 18px; }
.block { margin-bottom: 16px; }
.bt { font-weight: 600; }
.demo-hint { font-size: 12px; color: #909399; margin: 0 0 12px; }
.demo-actions { display: flex; gap: 10px; flex-wrap: wrap; }
</style>
