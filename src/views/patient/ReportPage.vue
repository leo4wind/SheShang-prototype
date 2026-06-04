<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useRescueStore, type FieldReport } from '@/stores/rescue'
import { currentPatient } from '@/mock/data'
import mockFieldReportPhoto from '@/assets/mock-field-report.svg'

const router = useRouter()
const rescue = useRescueStore()

const form = reactive<FieldReport>({
  symptoms: '右小腿剧痛、肿胀，伤口两个牙印渗血',
  selfRescue: '已用鞋带在膝盖下方绷扎，并尽量减少走动',
  bittenTime: '13:50 左右',
  snakeDescription: '土黄色，三角头，约 1 米，向草丛逃走',
  hasPhoto: true,
  photoUrl: mockFieldReportPhoto,
  voiceSeconds: 12
})

const recording = ref(false)
const contactLine = computed(() =>
  rescue.isPatientLoggedIn
    ? `${currentPatient.emergencyContact} ${currentPatient.emergencyPhone}`
    : '临时联系人：家属 · 手机尾号 8830'
)

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
  form.photoUrl = mockFieldReportPhoto
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
        <div class="kv"><span>联系人</span><b>{{ contactLine }}</b></div>
      </div>

      <el-alert
        v-if="!rescue.isPatientLoggedIn"
        type="info"
        :closable="false"
        show-icon
        title="未登录也可先上报现场信息，登录或到院核验后再绑定患者档案。"
      />

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
          <div v-if="form.hasPhoto" class="photo-preview">
            <img :src="form.photoUrl" alt="现场照片预览" />
            <div class="photo-meta">
              <b>已添加现场照片</b>
              <span>医生端将同步查看该照片</span>
            </div>
          </div>
          <div class="uploads">
            <div class="upload-box" @click="fakeUpload('蛇')">
              <el-icon :size="24"><Camera /></el-icon>
              <span>拍蛇</span>
            </div>
            <div class="upload-box" @click="fakeUpload('伤口')">
              <el-icon :size="24"><Camera /></el-icon>
              <span>拍伤口</span>
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

.photo-preview {
  width: 100%;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  overflow: hidden;
  background: #f8fbff;
  margin-bottom: 10px;
}
.photo-preview img { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.photo-meta { display: flex; justify-content: space-between; gap: 8px; padding: 8px 10px; font-size: 12px; }
.photo-meta b { color: #303133; }
.photo-meta span { color: #909399; }

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
