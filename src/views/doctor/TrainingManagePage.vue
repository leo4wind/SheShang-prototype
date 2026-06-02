<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import MockDataLabel from '@/components/MockDataLabel.vue'
import { trainingCourses, type TrainingCourse } from '@/mock/education'

const courses = reactive<TrainingCourse[]>(trainingCourses.map((c) => ({ ...c })))

const statusType: Record<string, string> = { 已发布: 'success', 审核中: 'warning', 草稿: 'info' }

function publish(c: TrainingCourse) {
  c.status = '已发布'
  ElMessage.success(`《${c.title}》已发布`)
}
function approve(c: TrainingCourse) {
  c.status = '已发布'
  ElMessage.success(`已通过审核并发布`)
}
function takeDown(c: TrainingCourse) {
  c.status = '草稿'
  ElMessage.warning('已下架为草稿')
}
function upload() {
  ElMessage.info('上传课程（原型占位：支持文档/视频）')
}
</script>

<template>
  <div class="tm-page">
    <div class="page-head">
      <div>
        <h2>培训管理</h2>
        <p class="sub">课程上传、审核、发布与下架</p>
      </div>
      <div class="head-right">
        <el-button type="primary" @click="upload">上传课程</el-button>
        <MockDataLabel />
      </div>
    </div>

    <el-card shadow="never">
      <el-table :data="courses" style="width:100%">
        <el-table-column prop="title" label="课程" min-width="240" />
        <el-table-column prop="category" label="分类" width="110" />
        <el-table-column label="类型" width="80">
          <template #default="{ row }">{{ row.type === 'video' ? '视频' : '文档' }}</template>
        </el-table-column>
        <el-table-column prop="author" label="作者" width="90" />
        <el-table-column prop="updatedAt" label="更新" width="110" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="statusType[row.status] as any">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '审核中'" link type="success" @click="approve(row)">通过</el-button>
            <el-button v-if="row.status === '草稿'" link type="primary" @click="publish(row)">发布</el-button>
            <el-button v-if="row.status === '已发布'" link type="danger" @click="takeDown(row)">下架</el-button>
            <el-button link type="primary">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.head-right { display: flex; align-items: center; gap: 12px; }
</style>
