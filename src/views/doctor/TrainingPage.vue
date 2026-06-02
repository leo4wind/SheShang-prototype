<script setup lang="ts">
import { ref, computed } from 'vue'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { trainingCourses } from '@/mock/education'

const cats = ['全部', '诊疗规范', '血清使用', '病例复盘', '设备操作'] as const
const activeCat = ref<(typeof cats)[number]>('全部')

const published = computed(() => trainingCourses.filter((c) => c.status === '已发布'))
const list = computed(() =>
  activeCat.value === '全部' ? published.value : published.value.filter((c) => c.category === activeCat.value)
)
const avgRate = computed(() =>
  Math.round(published.value.reduce((a, b) => a + b.completedRate, 0) / (published.value.length || 1))
)
</script>

<template>
  <div class="train-page">
    <div class="page-head">
      <div>
        <h2>培训中心</h2>
        <p class="sub">蛇伤诊疗规范、血清使用、病例复盘 · 提升基层救治能力</p>
      </div>
      <MockDataLabel />
    </div>

    <el-row :gutter="16" class="stat-row">
      <el-col :span="8"><div class="stat"><div class="n">{{ published.length }}</div><div class="l">已发布课程</div></div></el-col>
      <el-col :span="8"><div class="stat"><div class="n">{{ avgRate }}%</div><div class="l">平均完成率</div></div></el-col>
      <el-col :span="8"><div class="stat"><div class="n">12</div><div class="l">本月学习医生</div></div></el-col>
    </el-row>

    <div class="cats">
      <span v-for="c in cats" :key="c" class="cat" :class="{ active: activeCat === c }" @click="activeCat = c">{{ c }}</span>
    </div>

    <el-row :gutter="16">
      <el-col :span="8" v-for="c in list" :key="c.id">
        <el-card shadow="hover" class="course">
          <div class="thumb" :class="c.type">
            <el-icon :size="26"><VideoPlay v-if="c.type === 'video'" /><Document v-else /></el-icon>
          </div>
          <div class="c-title">{{ c.title }}</div>
          <div class="c-meta">
            <el-tag size="small" effect="plain">{{ c.category }}</el-tag>
            <span>{{ c.duration }}</span>
          </div>
          <div class="c-foot">
            <el-progress :percentage="c.completedRate" :stroke-width="6" />
            <el-button size="small" type="primary" plain>{{ c.completedRate > 0 ? '继续学习' : '开始学习' }}</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.stat-row { margin-bottom: 16px; }
.stat { background: #fff; border-radius: 8px; padding: 16px; text-align: center; }
.stat .n { font-size: 24px; font-weight: 700; color: #409eff; }
.stat .l { font-size: 13px; color: #909399; margin-top: 4px; }
.cats { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.cat { font-size: 13px; color: #606266; background: #fff; border-radius: 14px; padding: 5px 16px; cursor: pointer; }
.cat.active { background: #409eff; color: #fff; }
.course { margin-bottom: 16px; }
.thumb { height: 72px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #fff; margin-bottom: 10px; }
.thumb.article { background: linear-gradient(135deg, #409eff, #337ecc); }
.thumb.video { background: linear-gradient(135deg, #e6a23c, #cf9236); }
.c-title { font-size: 14px; font-weight: 600; line-height: 1.4; min-height: 40px; }
.c-meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #909399; margin: 8px 0; }
.c-foot { display: flex; align-items: center; gap: 10px; }
.c-foot :deep(.el-progress) { flex: 1; }
</style>
