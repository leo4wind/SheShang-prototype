<script setup lang="ts">
import { ref, nextTick } from 'vue'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useCareStore } from '@/stores/care'

const care = useCareStore()

// 线程列表：张建国走共享 store，其余为静态预览
const threads = [
  { patientId: 'p-01', name: '张建国', diagnosis: '竹叶青咬伤', shared: true },
  { patientId: 'p-03', name: '赵秀兰', diagnosis: '竹叶青咬伤', last: '医生我能洗澡了吗？', shared: false },
  { patientId: 'p-02', name: '李德海', diagnosis: '五步蛇咬伤', last: '谢谢医生', shared: false }
]

const openId = ref<string | null>(null)
const input = ref('')
const listRef = ref<HTMLElement | null>(null)

async function scrollDown() {
  await nextTick()
  if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
}
function open(id: string) {
  openId.value = id
  scrollDown()
}
function send() {
  if (!input.value.trim()) return
  care.sendCareMessage('doctor', input.value)
  input.value = ''
  scrollDown()
}
</script>

<template>
  <div class="msg-page">
    <!-- 线程列表 -->
    <template v-if="!openId">
      <PhoneNavBar title="患者消息" back="/doctor-app/inbox" theme="primary" />
      <div class="body">
        <div v-for="t in threads" :key="t.patientId" class="thread" @click="open(t.patientId)">
          <el-avatar :size="40" style="background:#409eff">{{ t.name.charAt(0) }}</el-avatar>
          <div class="t-info">
            <div class="t-top">
              <b>{{ t.name }}</b>
              <el-tag v-if="t.shared" size="small" type="success" effect="plain">{{ care.messages.length }} 条</el-tag>
            </div>
            <div class="t-last">{{ t.shared ? care.messages[care.messages.length - 1]?.text : t.last }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- 会话 -->
    <template v-else>
      <div class="conv-nav">
        <el-icon class="back" @click="openId = null"><ArrowLeft /></el-icon>
        <span class="conv-title">张建国</span>
        <span class="conv-pad" />
      </div>
      <div class="chat-list" ref="listRef">
        <div v-for="(m, i) in care.messages" :key="i" class="msg" :class="m.from">
          <el-avatar v-if="m.from === 'patient'" :size="30" class="avatar patient">张</el-avatar>
          <div class="wrap">
            <div class="bubble" :class="m.from">{{ m.text }}</div>
            <div class="time">{{ m.at }}</div>
          </div>
          <el-avatar v-if="m.from === 'doctor'" :size="30" class="avatar doctor">王</el-avatar>
        </div>
      </div>
      <div class="input-area">
        <el-input v-model="input" placeholder="回复患者…" @keyup.enter="send" />
        <el-button type="primary" @click="send">发送</el-button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.msg-page { min-height: 100%; height: 100%; background: #f0f2f5; display: flex; flex-direction: column; }
.conv-nav { height: 44px; background: #409eff; color: #fff; display: flex; align-items: center; padding: 0 12px; font-size: 16px; font-weight: 600; flex-shrink: 0; }
.conv-nav .back { cursor: pointer; font-size: 18px; }
.conv-title { flex: 1; text-align: center; }
.conv-pad { width: 18px; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
.thread { background: #fff; border-radius: 10px; padding: 12px; display: flex; align-items: center; gap: 12px; cursor: pointer; }
.t-info { flex: 1; min-width: 0; }
.t-top { display: flex; align-items: center; gap: 8px; }
.t-last { font-size: 12px; color: #909399; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.chat-list { flex: 1; overflow-y: auto; padding: 12px; }
.msg { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 14px; }
.msg.doctor { flex-direction: row-reverse; }
.avatar.doctor { background: #409eff; }
.avatar.patient { background: #67c23a; }
.wrap { max-width: 70%; }
.bubble { padding: 8px 12px; border-radius: 10px; font-size: 13px; line-height: 1.5; }
.bubble.patient { background: #fff; border-top-left-radius: 2px; }
.bubble.doctor { background: #95ec69; border-top-right-radius: 2px; }
.msg.doctor .time { text-align: right; }
.time { font-size: 11px; color: #c0c4cc; margin-top: 3px; }
.input-area { background: #fff; border-top: 1px solid #ebeef5; padding: 8px 12px; display: flex; gap: 8px; }
</style>
