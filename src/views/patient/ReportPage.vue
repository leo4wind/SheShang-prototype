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
  symptoms: '右小腿剧痛、肿胀，伤口两个牙印渗血',
  selfRescue: '已用鞋带在膝盖下方绷扎',
  bittenTime: '13:50 左右',
  snakeDescription: '土黄色，三角头，约 1 米',
  hasPhoto: true,
  voiceSeconds: 12
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
          <div class="photo-grid">
            <div class="photo-card">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="photo-svg">
                <!-- 草地背景 -->
                <rect width="240" height="180" fill="#4a7c3f" rx="6"/>
                <rect y="120" width="240" height="60" fill="#3d6b34" rx="0"/>
                <ellipse cx="60" cy="130" rx="50" ry="8" fill="#5a8c4a" opacity="0.5"/>
                <ellipse cx="180" cy="140" rx="40" ry="6" fill="#5a8c4a" opacity="0.4"/>
                <!-- 蛇身 -->
                <path d="M30,100 Q60,60 100,85 T170,70 T210,90" stroke="#8B7D3C" stroke-width="10" fill="none" stroke-linecap="round"/>
                <path d="M30,100 Q60,60 100,85 T170,70 T210,90" stroke="#A0904A" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="8,6"/>
                <!-- 蛇头 -->
                <ellipse cx="210" cy="90" rx="14" ry="10" fill="#8B7D3C" transform="rotate(-15,210,90)"/>
                <ellipse cx="210" cy="90" rx="10" ry="7" fill="#A0904A" transform="rotate(-15,210,90)"/>
                <!-- 蛇眼 -->
                <circle cx="216" cy="86" r="2.5" fill="#222"/>
                <circle cx="217" cy="85.5" r="1" fill="#fff"/>
                <!-- 蛇信 -->
                <line x1="224" y1="88" x2="230" y2="84" stroke="#c44" stroke-width="1.2"/>
                <line x1="224" y1="88" x2="230" y2="90" stroke="#c44" stroke-width="1.2"/>
                <!-- 三角头标记 -->
                <path d="M200,80 L220,80 L210,75 Z" fill="#8B7D3C" opacity="0.6"/>
                <!-- 时间戳 -->
                <rect x="8" y="158" width="100" height="16" rx="3" fill="rgba(0,0,0,0.5)"/>
                <text x="14" y="170" font-size="10" fill="#fff" font-family="monospace">13:50:23</text>
                <!-- Mock 标记 -->
                <rect x="160" y="8" width="72" height="18" rx="3" fill="rgba(230,162,60,0.85)"/>
                <text x="170" y="21" font-size="10" fill="#fff" font-family="sans-serif">Mock 照片</text>
              </svg>
              <div class="photo-label">蛇 · 土黄色三角头</div>
            </div>
            <div class="photo-card">
              <svg viewBox="0 0 240 180" xmlns="http://www.w3.org/2000/svg" class="photo-svg">
                <!-- 皮肤背景 -->
                <rect width="240" height="180" fill="#D4A574" rx="6"/>
                <ellipse cx="120" cy="90" rx="90" ry="70" fill="#C89660"/>
                <!-- 腿部轮廓 -->
                <ellipse cx="120" cy="90" rx="70" ry="55" fill="#D4A574"/>
                <!-- 伤口肿胀区域 -->
                <ellipse cx="115" cy="88" rx="30" ry="22" fill="#c0392b" opacity="0.3"/>
                <ellipse cx="115" cy="88" rx="22" ry="16" fill="#e74c3c" opacity="0.25"/>
                <!-- 两个牙印 -->
                <ellipse cx="108" cy="82" rx="3" ry="5" fill="#8B0000" transform="rotate(-10,108,82)"/>
                <ellipse cx="122" cy="82" rx="3" ry="5" fill="#8B0000" transform="rotate(10,122,82)"/>
                <!-- 牙印渗血 -->
                <circle cx="108" cy="88" r="2" fill="#6B0000" opacity="0.7"/>
                <circle cx="122" cy="88" r="2" fill="#6B0000" opacity="0.7"/>
                <!-- 肿胀纹理 -->
                <ellipse cx="115" cy="95" rx="25" ry="8" fill="#d4534a" opacity="0.2"/>
                <!-- 绷扎痕迹 -->
                <line x1="80" y1="60" x2="150" y2="60" stroke="#8B6914" stroke-width="3" opacity="0.4"/>
                <line x1="78" y1="115" x2="152" y2="115" stroke="#8B6914" stroke-width="3" opacity="0.4"/>
                <!-- 时间戳 -->
                <rect x="8" y="158" width="100" height="16" rx="3" fill="rgba(0,0,0,0.5)"/>
                <text x="14" y="170" font-size="10" fill="#fff" font-family="monospace">13:51:07</text>
                <!-- Mock 标记 -->
                <rect x="160" y="8" width="72" height="18" rx="3" fill="rgba(230,162,60,0.85)"/>
                <text x="170" y="21" font-size="10" fill="#fff" font-family="sans-serif">Mock 照片</text>
              </svg>
              <div class="photo-label">伤口 · 右小腿两个牙印</div>
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

.photo-grid { display: flex; gap: 10px; }
.photo-card {
  flex: 1;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}
.photo-svg {
  width: 100%;
  display: block;
}
.photo-label {
  font-size: 12px;
  color: #606266;
  padding: 6px 8px;
  background: #fff;
  text-align: center;
}
.upload-hint { font-size: 12px; color: #c0c4cc; margin-top: 6px; }

.submit { width: 100%; }
</style>
