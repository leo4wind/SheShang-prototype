<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import PhoneNavBar from '@/components/PhoneNavBar.vue'
import { knowledgeArticles, type KnowledgeArticle } from '@/mock/education'

const router = useRouter()
const tags = ['全部', '急救', '用药', '康复', '预防'] as const
const activeTag = ref<(typeof tags)[number]>('全部')

const list = computed<KnowledgeArticle[]>(() =>
  activeTag.value === '全部'
    ? knowledgeArticles
    : knowledgeArticles.filter((a) => a.tag === activeTag.value)
)
</script>

<template>
  <div class="kn-page">
    <PhoneNavBar title="知识中心" back="/patient/care/timeline" />
    <div class="body">
      <div class="tags">
        <span
          v-for="t in tags" :key="t"
          class="tag" :class="{ active: activeTag === t }"
          @click="activeTag = t"
        >{{ t }}</span>
      </div>

      <div
        v-for="a in list" :key="a.id" class="card"
        @click="router.push(`/patient/care/knowledge/${a.id}`)"
      >
        <div class="thumb" :class="a.type">
          <el-icon :size="22"><VideoPlay v-if="a.type === 'video'" /><Document v-else /></el-icon>
        </div>
        <div class="info">
          <div class="title">{{ a.title }}</div>
          <div class="summary">{{ a.summary }}</div>
          <div class="meta">
            <el-tag size="small" type="success" effect="plain">{{ a.tag }}</el-tag>
            <span v-if="a.duration" class="dur">{{ a.duration }}</span>
            <span class="read">{{ a.readCount }} 阅读</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kn-page { min-height: 100%; background: #f0f2f5; }
.body { padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tag { font-size: 13px; color: #606266; background: #fff; border-radius: 14px; padding: 4px 14px; cursor: pointer; }
.tag.active { background: #67c23a; color: #fff; }
.card { background: #fff; border-radius: 10px; padding: 12px; display: flex; gap: 12px; cursor: pointer; }
.thumb { width: 56px; height: 56px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0; }
.thumb.article { background: #409eff; }
.thumb.video { background: #e6a23c; }
.info { flex: 1; min-width: 0; }
.title { font-size: 14px; font-weight: 600; line-height: 1.4; }
.summary { font-size: 12px; color: #909399; margin: 4px 0; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #c0c4cc; }
.dur, .read { font-size: 11px; }
</style>
