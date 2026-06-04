<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { useRescueStore } from '@/stores/rescue'

const router = useRouter()
const rescue = useRescueStore()

function login() {
  const hadCurrentEvent = Boolean(rescue.currentEvent)
  rescue.loginPatient()
  ElMessage.success(hadCurrentEvent ? '登录成功，已关联当前求救事件' : '登录成功（原型免密）')
  router.push('/patient/home')
}
</script>

<template>
  <div class="login-page">
    <PhoneNavBar title="登录" theme="primary" />
    <div class="body">
      <div class="logo">
        <el-icon :size="56" color="#409eff"><FirstAidKit /></el-icon>
        <div class="app-name">人民蛇伤</div>
        <div class="app-sub">蛇伤急救与健康陪护</div>
      </div>

      <el-form label-position="top" class="form">
        <el-form-item label="手机号">
          <el-input model-value="138****6621" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="验证码">
          <div class="code-row">
            <el-input placeholder="短信验证码" />
            <el-button>获取验证码</el-button>
          </div>
        </el-form-item>
      </el-form>

      <el-button type="primary" size="large" class="login-btn" @click="login">登录 / 注册</el-button>
      <el-button link class="wx-login" @click="login">微信一键登录</el-button>

      <el-alert
        type="info"
        :closable="false"
        show-icon
        title="登录后自动关联当前求救事件，已上报信息不会丢失。"
      />

      <div class="agreement">登录即代表同意《用户协议》《隐私政策》</div>
    </div>
  </div>
</template>

<style scoped>
.login-page { min-height: 100%; background: #fff; }
.body { padding: 24px 20px; display: flex; flex-direction: column; gap: 16px; }
.logo { text-align: center; padding: 24px 0; }
.app-name { font-size: 22px; font-weight: 700; margin-top: 8px; }
.app-sub { font-size: 13px; color: #909399; margin-top: 4px; }
.code-row { display: flex; gap: 8px; width: 100%; }
.login-btn { width: 100%; margin-top: 8px; }
.wx-login { width: 100%; }
.agreement { text-align: center; font-size: 12px; color: #c0c4cc; margin-top: 16px; }
</style>
