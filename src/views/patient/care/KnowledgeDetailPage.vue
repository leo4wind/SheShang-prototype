<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { getKnowledge, knowledgeArticles } from '@/mock/education'

const route = useRoute()
const article = computed(() => {
  const id = route.params.id as string
  return getKnowledge(id && id !== 'demo' ? id : knowledgeArticles[0].id)
})
</script>

<template>
  <div class="kd-page">
    <PhoneNavBar title="知识详情" back="/patient/care/knowledge" />
    <div v-if="!article" class="empty"><el-empty description="文章不存在" /></div>
    <div v-else class="body">
      <h1 class="title">{{ article.title }}</h1>
      <div class="meta">
        <el-tag size="small" type="success" effect="plain">{{ article.tag }}</el-tag>
        <span>{{ article.readCount }} 阅读</span>
        <span v-if="article.duration">{{ article.duration }}</span>
      </div>

      <div v-if="article.type === 'video'" class="video-box">
        <el-icon :size="40"><VideoPlay /></el-icon>
        <span>视频内容（原型占位）</span>
      </div>

      <p v-for="(p, i) in article.content" :key="i" class="para">{{ p }}</p>

      <el-alert
        type="info" :closable="false" show-icon
        title="温馨提示"
        description="科普内容不能替代医生诊断，如有不适请及时联系您的主治医生或拨打急救。"
        class="tip"
      />
    </div>
  </div>
</template>

<style scoped>
.kd-page { min-height: 100%; background: #fff; }
.empty { padding-top: 60px; }
.body { padding: 16px; }
.title { font-size: 19px; font-weight: 700; line-height: 1.4; margin: 0 0 10px; }
.meta { display: flex; align-items: center; gap: 10px; font-size: 12px; color: #909399; margin-bottom: 14px; }
.video-box { height: 160px; background: #303133; border-radius: 10px; color: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; font-size: 13px; margin-bottom: 14px; }
.para { font-size: 15px; line-height: 1.8; color: #303133; margin: 0 0 14px; }
.tip { margin-top: 8px; }
</style>
