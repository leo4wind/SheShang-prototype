<script setup lang="ts">
import { ref } from 'vue'
import { roleDefs, userRows, type RoleDef } from '@/mock/data'
import MockDataLabel from '@/components/MockDataLabel.vue'

const activeTab = ref('roles')

const roleName: Record<string, string> = Object.fromEntries(roleDefs.map((r) => [r.key, r.name]))

const selectedRole = ref<RoleDef | null>(roleDefs[0])
function selectRole(r: RoleDef) {
  selectedRole.value = r
}
</script>

<template>
  <div class="permissions">
    <div class="page-head">
      <div>
        <h2>角色与权限</h2>
        <p class="sub">维护角色、菜单权限、数据权限，以及用户与角色绑定</p>
      </div>
      <MockDataLabel />
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="角色管理" name="roles">
        <el-row :gutter="16">
          <el-col :span="10">
            <el-card shadow="never">
              <template #header><span class="bt">角色列表</span></template>
              <div
                v-for="r in roleDefs"
                :key="r.key"
                class="role-item"
                :class="{ active: selectedRole?.key === r.key }"
                @click="selectRole(r)"
              >
                <div class="role-name">{{ r.name }}</div>
                <el-tag size="small" type="info">{{ r.userCount }} 人</el-tag>
              </div>
            </el-card>
          </el-col>
          <el-col :span="14">
            <el-card v-if="selectedRole" shadow="never">
              <template #header><span class="bt">{{ selectedRole.name }} · 权限配置</span></template>
              <el-form label-width="100px">
                <el-form-item label="可访问终端">
                  <el-checkbox-group :model-value="selectedRole.menus">
                    <el-checkbox v-for="m in ['患者端（小程序）','医生端 PC','医生端 APP','内网端','系统能力']" :key="m" :value="m" :label="m" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="数据权限">
                  <el-radio-group :model-value="selectedRole.dataScope">
                    <el-radio v-for="d in ['本院患者','受邀/共享患者','全部（脱敏）','全部（脱敏，只读）','全部']" :key="d" :value="d" :label="d" />
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary">保存（原型不持久化）</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="用户管理" name="users">
        <el-card shadow="never">
          <template #header>
            <div class="card-head-row">
              <span class="bt">用户列表</span>
              <el-button type="primary" size="small"><el-icon><Plus /></el-icon> 新增用户</el-button>
            </div>
          </template>
          <el-table :data="userRows" style="width: 100%">
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column label="角色" width="140">
              <template #default="{ row }">
                <el-tag size="small">{{ roleName[row.role] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="hospital" label="所属机构" min-width="160" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag size="small" :type="row.status === '在职' ? 'success' : 'info'">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default>
                <el-button link type="primary">编辑</el-button>
                <el-button link type="warning">改角色</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.page-head { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
.page-head h2 { margin: 0; font-size: 20px; }
.page-head .sub { margin: 4px 0 0; font-size: 13px; color: #909399; }
.bt { font-weight: 600; }
.card-head-row { display: flex; align-items: center; justify-content: space-between; }

.role-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; border-radius: 8px; cursor: pointer; margin-bottom: 6px;
  border: 1px solid transparent;
}
.role-item:hover { background: #f5f7fa; }
.role-item.active { background: #ecf5ff; border-color: #d9ecff; }
.role-name { font-size: 14px; font-weight: 500; }
</style>
