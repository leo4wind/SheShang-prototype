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
  if (!input.value.trim() || care.chatClosed) return
  care.patientReply(input.value)
  input.value = ''
  scrollDown()
}

function quickReply(text: string) {
  if (care.chatClosed) return
  care.patientReply(text)
  scrollDown()
}

function sendPhoto() {
  if (care.chatClosed) return
  care.patientReply('[伤口照片]', 'photo')
  scrollDown()
}
</script>

<template>
  <div class="chat-page">
    <PhoneNavBar title="陪护对话" back="/patient/care/timeline" />

    <div class="chat-list" ref="listRef">
      <div class="algo-tip">
        <el-icon><MagicStick /></el-icon>
        对话由 AI 助手发起，回答经 NLP 解析后结构化进入随访档案（算法接入点）
      </div>

      <div v-for="(c, i) in care.chat" :key="i" class="msg" :class="c.role">
        <el-avatar v-if="c.role === 'bot'" :size="32" class="avatar bot"><el-icon><Service /></el-icon></el-avatar>
        <div class="bubble" :class="c.role">
          <span v-if="c.type === 'photo'"><el-icon><PictureFilled /></el-icon> 伤口照片</span>
          <span v-else>{{ c.text }}</span>
        </div>
        <el-avatar v-if="c.role === 'patient'" :size="32" class="avatar patient">张</el-avatar>
      </div>

      <div v-if="care.chatClosed" class="closed-tip">
        <el-icon><CircleCheckFilled /></el-icon> 本次陪护对话已完成
      </div>
    </div>

    <div class="input-area">
      <div v-if="!care.chatClosed" class="quick">
        <span class="quick-chip" @click="quickReply('伤口在好转，没什么大碍')">伤口好转</span>
        <span class="quick-chip" @click="quickReply('体温正常，36.5 度')">体温正常</span>
        <span class="quick-chip" @click="sendPhoto">发伤口照片</span>
      </div>
      <div class="input-row">
        <el-button :disabled="care.chatClosed" circle @click="sendPhoto"><el-icon><Camera /></el-icon></el-button>
        <el-input v-model="input" :disabled="care.chatClosed" placeholder="输入回复…" @keyup.enter="send" />
        <el-button type="primary" :disabled="care.chatClosed" @click="send">发送</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-page { min-height: 100%; height: 100%; background: #f0f2f5; display: flex; flex-direction: column; }
.chat-list { flex: 1; overflow-y: auto; padding: 12px; }
.algo-tip {
  font-size: 11px; color: #b88200; background: #fffae6; border: 1px dashed #e6a23c;
  border-radius: 8px; padding: 8px 10px; margin-bottom: 12px; line-height: 1.5;
  display: flex; align-items: flex-start; gap: 4px;
}
.msg { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 12px; }
.msg.patient { flex-direction: row-reverse; }
.avatar { flex-shrink: 0; }
.avatar.bot { background: #409eff; }
.avatar.patient { background: #67c23a; }
.bubble {
  max-width: 70%; padding: 8px 12px; border-radius: 10px; font-size: 13px; line-height: 1.5;
}
.bubble.bot { background: #fff; border-top-left-radius: 2px; }
.bubble.patient { background: #95ec69; border-top-right-radius: 2px; }
.closed-tip {
  text-align: center; font-size: 12px; color: #67c23a; margin: 12px 0;
  display: flex; align-items: center; justify-content: center; gap: 4px;
}

.input-area { background: #fff; border-top: 1px solid #ebeef5; padding: 8px 12px; flex-shrink: 0; }
.quick { display: flex; gap: 6px; margin-bottom: 8px; flex-wrap: wrap; }
.quick-chip {
  font-size: 12px; color: #409eff; background: #ecf5ff; border-radius: 12px;
  padding: 3px 10px; cursor: pointer;
}
.input-row { display: flex; gap: 8px; align-items: center; }
</style>
