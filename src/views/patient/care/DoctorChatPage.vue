<script setup lang="ts">
import { ref, nextTick } from 'vue'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useCareStore } from '@/stores/care'

const care = useCareStore()
const input = ref('')
const listRef = ref<HTMLElement | null>(null)

async function scrollDown() {
  await nextTick()
  if (listRef.value) listRef.value.scrollTop = listRef.value.scrollHeight
}
function send() {
  if (!input.value.trim()) return
  care.sendCareMessage('patient', input.value)
  input.value = ''
  scrollDown()
}
</script>

<template>
  <div class="dc-page">
    <PhoneNavBar title="王建华医生" back="/patient/care/timeline" theme="primary" />

    <div class="doctor-bar">
      <el-avatar :size="36" style="background:#409eff">王</el-avatar>
      <div>
        <div class="name">王建华 · 主治医师</div>
        <div class="sub">县人民医院 急诊科</div>
      </div>
      <el-tag size="small" type="success" effect="plain">在线</el-tag>
    </div>

    <div class="chat-list" ref="listRef">
      <div v-for="(m, i) in care.messages" :key="i" class="msg" :class="m.from">
        <el-avatar v-if="m.from === 'doctor'" :size="30" class="avatar doctor">王</el-avatar>
        <div class="wrap">
          <div class="bubble" :class="m.from">{{ m.text }}</div>
          <div class="time">{{ m.at }}</div>
        </div>
        <el-avatar v-if="m.from === 'patient'" :size="30" class="avatar patient">张</el-avatar>
      </div>
    </div>

    <div class="input-area">
      <div class="input-row">
        <el-input v-model="input" placeholder="输入消息…" @keyup.enter="send" />
        <el-button type="primary" @click="send">发送</el-button>
      </div>
      <div class="hint">非急症咨询，医生会在出诊间隙回复；急症请用一键 SOS</div>
    </div>
  </div>
</template>

<style scoped>
.dc-page { min-height: 100%; height: 100%; background: #f0f2f5; display: flex; flex-direction: column; }
.doctor-bar { background: #fff; padding: 10px 12px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #ebeef5; }
.doctor-bar .name { font-size: 14px; font-weight: 600; }
.doctor-bar .sub { font-size: 12px; color: #909399; margin-top: 2px; }
.doctor-bar > div:nth-child(2) { flex: 1; }
.chat-list { flex: 1; overflow-y: auto; padding: 12px; }
.msg { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 14px; }
.msg.patient { flex-direction: row-reverse; }
.avatar.doctor { background: #409eff; }
.avatar.patient { background: #67c23a; }
.wrap { max-width: 70%; }
.bubble { padding: 8px 12px; border-radius: 10px; font-size: 13px; line-height: 1.5; }
.bubble.doctor { background: #fff; border-top-left-radius: 2px; }
.bubble.patient { background: #95ec69; border-top-right-radius: 2px; }
.msg.patient .time { text-align: right; }
.time { font-size: 11px; color: #c0c4cc; margin-top: 3px; }
.input-area { background: #fff; border-top: 1px solid #ebeef5; padding: 8px 12px; }
.input-row { display: flex; gap: 8px; }
.hint { font-size: 11px; color: #c0c4cc; margin-top: 6px; text-align: center; }
</style>
