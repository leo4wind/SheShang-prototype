<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCollabStore, MDT_STATUS_LABEL } from '@/stores/collab'
import AlgoPlaceholder from '@/components/AlgoPlaceholder.vue'

const route = useRoute()
const router = useRouter()
const collab = useCollabStore()

const mdtId = computed(() => {
  const id = route.params.id as string
  if (id && id !== 'demo') return id
  return collab.mdts[0]?.id ?? ''
})
const m = computed(() => collab.getMdt(mdtId.value))

const conclusion = ref('')
const chatInput = ref('')
const chat = ref<{ who: string; text: string }[]>([
  { who: '王建华', text: '各位专家好，患者凝血指标持续恶化，请看最新化验。' },
  { who: '陈志远', text: '肾功能目前尚可，建议先纠正凝血。' }
])

function send() {
  if (!chatInput.value.trim()) return
  chat.value.push({ who: '王建华', text: chatInput.value })
  chatInput.value = ''
}

function startMeeting() {
  if (m.value) { collab.setMdtStatus(m.value.id, 'ongoing'); ElMessage.success('会诊已开始') }
}

function saveConclusion() {
  if (!conclusion.value) { ElMessage.warning('请填写会诊结论'); return }
  if (m.value) {
    collab.saveMdtConclusion(m.value.id, conclusion.value)
    ElMessage.success('结论已写入就诊记录')
  }
}
</script>

<template>
  <div v-if="!m" class="empty">
    <el-result icon="warning" title="未找到 MDT">
      <template #extra><el-button @click="router.push('/doctor/mdt/new')">发起 MDT</el-button></template>
    </el-result>
  </div>

  <div v-else class="mdt-room">
    <div class="page-head">
      <el-button link @click="router.push('/doctor/mdt/new')"><el-icon><ArrowLeft /></el-icon> 新建 MDT</el-button>
      <h2>MDT 会诊室 · {{ m.id }}</h2>
      <el-tag>{{ MDT_STATUS_LABEL[m.status] }}</el-tag>
    </div>

    <el-row :gutter="16">
      <el-col :span="16">
        <el-card shadow="never" class="block">
          <template #header><span class="bt">{{ m.topic }}</span></template>
          <AlgoPlaceholder kind="rule" title="视频会诊" description="此处接入视频会议 SDK（v2）。v1 用占位 + 文字讨论区演示。">
            <div class="video-grid">
              <div v-for="inv in m.invitees" :key="inv.doctorId" class="video-tile" :class="{ off: inv.reply !== 'accepted' }">
                <el-icon :size="28"><VideoCamera /></el-icon>
                <span>{{ inv.name }}</span>
                <el-tag size="small" :type="inv.reply === 'accepted' ? 'success' : inv.reply === 'rejected' ? 'danger' : 'info'">
                  {{ inv.reply === 'accepted' ? '在线' : inv.reply === 'rejected' ? '已拒绝' : '待接受' }}
                </el-tag>
              </div>
              <div class="video-tile host"><el-icon :size="28"><VideoCamera /></el-icon><span>{{ m.host }}（主持）</span></div>
            </div>
          </AlgoPlaceholder>

          <div class="chat">
            <div class="chat-title">讨论区</div>
            <div class="chat-list">
              <div v-for="(c, i) in chat" :key="i" class="chat-msg">
                <b>{{ c.who }}：</b><span>{{ c.text }}</span>
              </div>
            </div>
            <div class="chat-input">
              <el-input v-model="chatInput" placeholder="输入发言…" @keyup.enter="send" />
              <el-button type="primary" @click="send">发送</el-button>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" class="block">
          <template #header><span class="bt">会诊安排</span></template>
          <div class="kv"><span>患者</span><b>{{ m.patientName }}</b></div>
          <div class="kv"><span>时间</span><b>{{ m.scheduledAt }}</b></div>
          <div class="kv"><span>主持</span><b>{{ m.host }}</b></div>
          <el-button v-if="m.status !== 'ongoing' && m.status !== 'closed'" type="primary" class="full" @click="startMeeting">开始会诊</el-button>
        </el-card>

        <el-card shadow="never" class="block">
          <template #header><span class="bt">会诊结论</span></template>
          <div v-if="m.conclusion" class="conclusion-done">{{ m.conclusion }}</div>
          <template v-else>
            <el-input v-model="conclusion" type="textarea" :rows="4" placeholder="整理 MDT 共识结论，写入就诊记录" />
            <el-button type="success" class="full" @click="saveConclusion">保存结论</el-button>
          </template>
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

.video-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.video-tile {
  background: #303133; color: #fff; border-radius: 8px; height: 90px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; font-size: 13px;
}
.video-tile.off { background: #5a5e66; opacity: 0.7; }
.video-tile.host { background: #409eff; }

.chat { margin-top: 16px; }
.chat-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.chat-list { background: #f5f7fa; border-radius: 8px; padding: 10px; max-height: 200px; overflow-y: auto; }
.chat-msg { font-size: 13px; margin: 4px 0; line-height: 1.5; }
.chat-input { display: flex; gap: 8px; margin-top: 8px; }

.kv { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
.kv span { color: #909399; }
.full { width: 100%; margin-top: 12px; }
.conclusion-done { font-size: 13px; line-height: 1.6; color: #67c23a; }
</style>
