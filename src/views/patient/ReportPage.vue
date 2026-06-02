<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useRescueStore, type FieldReport } from '@/stores/rescue'
import { currentPatient } from '@/mock/data'

const router = useRouter()
const rescue = useRescueStore()

const form = reactive<FieldReport>({
  symptoms: '',
  selfRescue: '',
  bittenTime: '',
  snakeDescription: '',
  hasPhoto: false,
  voiceSeconds: 0
})

const recording = ref(false)

function toggleVoice() {
  if (recording.value) {
    recording.value = false
    form.voiceSeconds = 10
    ElMessage.success('已录入语音 10 秒（占位）')
  } else {
    recording.value = true
    ElMessage.info('录音中…再次点击结束')
  }
}

function fakeUpload(kind: string) {
  form.hasPhoto = true
  ElMessage.success(`已添加${kind}照片（占位）`)
}

function submit() {
  if (!form.symptoms) {
    ElMessage.warning('请至少口述当前症状')
    return
  }
  const ev = rescue.currentEvent
  if (!ev) {
    ElMessage.warning('请先发起求救')
    router.push('/patient/sos')
    return
  }
  rescue.submitReport(ev.id, { ...form })
  ElMessage.success('上报成功，已推送给接诊医生')
  router.push(`/patient/waiting/${ev.id}`)
}
</script>

<template>
  <div class="report-page">
    <PhoneNavBar title="现场信息上报" back="/patient/sos" />

    <div class="body">
      <div class="auto-info">
        <div class="block-title">自动带入</div>
        <div class="kv"><span>时间</span><b>{{ new Date().toLocaleString('zh-CN') }}</b></div>
        <div class="kv"><span>定位</span><b>青龙山林场北坡</b></div>
        <div class="kv"><span>联系人</span><b>{{ currentPatient.emergencyContact }} {{ currentPatient.emergencyPhone }}</b></div>
      </div>

      <el-form label-position="top" class="form">
        <el-form-item label="当前症状（口述/语音）" required>
          <el-input v-model="form.symptoms" type="textarea" :rows="2" placeholder="如：右小腿剧痛、肿胀、两个牙印渗血" />
          <el-button class="voice-btn" :type="recording ? 'danger' : 'default'" @click="toggleVoice">
            <el-icon><Microphone /></el-icon>
            {{ recording ? '结束录音' : (form.voiceSeconds ? `语音 ${form.voiceSeconds}s` : '语音输入') }}
          </el-button>
        </el-form-item>

        <el-form-item label="已采取的自救措施">
          <el-input v-model="form.selfRescue" placeholder="如：已用鞋带在膝盖下方绷扎" />
        </el-form-item>

        <el-form-item label="咬伤时间">
          <el-input v-model="form.bittenTime" placeholder="如：13:50 左右" />
        </el-form-item>

        <el-form-item label="蛇的描述">
          <el-input v-model="form.snakeDescription" placeholder="颜色、花纹、头型、长度" />
        </el-form-item>

        <el-form-item label="现场照片">
          <div class="uploads">
            <div class="upload-box" @click="fakeUpload('蛇')">
              <el-icon :size="24"><Camera /></el-icon>
              <span>拍蛇</span>
            </div>
            <div class="upload-box" @click="fakeUpload('伤口')">
              <el-icon :size="24"><Camera /></el-icon>
              <span>拍伤口</span>
            </div>
            <div v-if="form.hasPhoto" class="upload-box done">
              <el-icon :size="24"><PictureFilled /></el-icon>
              <span>已添加</span>
            </div>
          </div>
          <div class="upload-hint">蛇逃跑可跳过照片，用上方文字描述</div>
        </el-form-item>
      </el-form>

      <el-button type="primary" size="large" class="submit" @click="submit">提交上报</el-button>
    </div>
  </div>
</template>

<style scoped>
.report-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 12px; }

.auto-info {
  background: #fff;
  border-radius: 10px;
  padding: 12px 14px;
}
.block-title { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.kv { display: flex; justify-content: space-between; font-size: 13px; padding: 3px 0; }
.kv span { color: #909399; }

.form {
  background: #fff;
  border-radius: 10px;
  padding: 14px;
}
.form :deep(.el-form-item__label) { font-size: 13px; padding-bottom: 2px; }
.voice-btn { margin-top: 8px; }

.uploads { display: flex; gap: 10px; }
.upload-box {
  width: 64px;
  height: 64px;
  border: 1px dashed #c0c4cc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
  cursor: pointer;
}
.upload-box.done { border-color: #67c23a; color: #67c23a; border-style: solid; }
.upload-hint { font-size: 12px; color: #c0c4cc; margin-top: 6px; }

.submit { width: 100%; }
</style>
