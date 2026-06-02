<script setup lang="ts">
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { ElMessage } from 'element-plus'

const smsTemplate = '【蛇伤求救】我在青龙山林场北坡被蛇咬伤，右小腿肿痛，请速救援。定位：28.6829,115.8581'

function copySms() {
  ElMessage.success('短信内容已复制（占位）')
}
</script>

<template>
  <div class="fallback-page">
    <PhoneNavBar title="弱网兜底" back="/patient/sos" theme="danger" />

    <div class="body">
      <el-alert
        type="error"
        :closable="false"
        show-icon
        title="网络信号弱"
        description="检测到当前网络不稳定，已切换到电话 / 短信兜底通道"
        class="warn"
      />

      <div class="big-call">
        <a href="tel:120" class="call-btn">
          <el-icon :size="32"><Phone /></el-icon>
          <span class="num">拨打 120</span>
          <span class="sub">急救电话</span>
        </a>
      </div>

      <div class="card">
        <div class="block-title"><el-icon><Message /></el-icon> 一键发送求救短信</div>
        <div class="sms">{{ smsTemplate }}</div>
        <div class="sms-actions">
          <el-button type="primary" @click="copySms">复制内容</el-button>
          <a href="sms:120" class="sms-link">
            <el-button>打开短信</el-button>
          </a>
        </div>
      </div>

      <div class="card">
        <div class="block-title"><el-icon><PhoneFilled /></el-icon> 紧急联系人</div>
        <div class="contact">
          <span>张小梅（女儿）</span>
          <a href="tel:13900008830"><el-button size="small" type="primary" plain>拨打</el-button></a>
        </div>
      </div>

      <el-alert
        type="info"
        :closable="false"
        title="网络恢复后，求救事件会自动同步到接诊医生工作台"
        show-icon
      />
    </div>
  </div>
</template>

<style scoped>
.fallback-page { min-height: 100%; background: #fff5f5; }
.body { padding: 14px; display: flex; flex-direction: column; gap: 14px; }
.warn :deep(.el-alert__description) { font-size: 12px; }

.big-call { display: flex; justify-content: center; padding: 8px 0; }
.call-btn {
  width: 100%;
  background: linear-gradient(135deg, #f56c6c, #e53935);
  color: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}
.call-btn .num { font-size: 24px; font-weight: 700; }
.call-btn .sub { font-size: 12px; opacity: 0.9; }

.card { background: #fff; border-radius: 10px; padding: 14px; }
.block-title { font-size: 13px; font-weight: 600; display: flex; align-items: center; gap: 4px; margin-bottom: 8px; }
.sms {
  background: #f5f7fa;
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  line-height: 1.5;
  color: #606266;
  margin-bottom: 10px;
}
.sms-actions { display: flex; gap: 10px; }
.sms-link { text-decoration: none; }

.contact { display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
</style>
