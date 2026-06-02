<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useCollabStore, MDT_STATUS_LABEL } from '@/stores/collab'

const route = useRoute()
const collab = useCollabStore()

const m = computed(() => collab.getMdt(route.params.id as string))

const chatInput = ref('')
const chat = ref<{ who: string; text: string }[]>([
  { who: '王建华', text: '各位专家好，请看患者最新化验。' },
  { who: '陈志远', text: '建议先纠正凝血。' }
])
function send() {
  if (!chatInput.value.trim()) return
  chat.value.push({ who: '陈志远', text: chatInput.value })
  chatInput.value = ''
}
</script>

<template>
  <div class="mdt-room-app">
    <PhoneNavBar title="MDT 会诊室" :back="m ? `/doctor-app/mdt/${m.id}` : '/doctor-app/inbox'" theme="primary" />
    <div v-if="!m" class="empty"><el-empty description="未找到会诊" /></div>
    <div v-else class="body">
      <div class="topic-card">
        <div class="status"><el-tag size="small">{{ MDT_STATUS_LABEL[m.status] }}</el-tag></div>
        <p class="topic">{{ m.topic }}</p>
        <div class="meta">{{ m.patientName }} · {{ m.scheduledAt }}</div>
      </div>

      <div class="video-strip">
        <div v-for="inv in m.invitees" :key="inv.doctorId" class="tile" :class="{ off: inv.reply !== 'accepted' }">
          <el-icon :size="20"><VideoCamera /></el-icon>
          <span>{{ inv.name }}</span>
        </div>
        <div class="tile host"><el-icon :size="20"><VideoCamera /></el-icon><span>{{ m.host }}</span></div>
      </div>
      <div class="sdk-note">视频会议 SDK 接入点（v2）</div>

      <div class="chat">
        <div v-for="(c, i) in chat" :key="i" class="msg">
          <b>{{ c.who }}：</b>{{ c.text }}
        </div>
      </div>
      <div class="chat-input">
        <el-input v-model="chatInput" placeholder="发言…" @keyup.enter="send" />
        <el-button type="primary" @click="send">发送</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mdt-room-app { min-height: 100%; background: #f0f2f5; display: flex; flex-direction: column; }
.empty { padding-top: 60px; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
.topic-card { background: #fff; border-radius: 10px; padding: 14px; }
.topic { font-size: 14px; line-height: 1.5; margin: 8px 0 6px; }
.meta { font-size: 12px; color: #909399; }
.video-strip { display: flex; gap: 8px; flex-wrap: wrap; }
.tile {
  flex: 1; min-width: 80px; background: #303133; color: #fff; border-radius: 8px; height: 64px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; font-size: 12px;
}
.tile.off { background: #5a5e66; opacity: 0.7; }
.tile.host { background: #409eff; }
.sdk-note { font-size: 12px; color: #e6a23c; text-align: center; }
.chat { background: #fff; border-radius: 10px; padding: 12px; flex: 1; overflow-y: auto; }
.msg { font-size: 13px; margin: 4px 0; line-height: 1.5; }
.chat-input { display: flex; gap: 8px; }
</style>
