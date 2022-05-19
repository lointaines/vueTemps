<template>
  <div>
    <el-select v-model="selectValue" multiple :multiple-limit="5" collapse-tags 
      placeholder="选择查看授权" class="selectClass" @change="selectChange">
      <el-option v-for="item in checkListValue" :value="item.name" :label="item.name" :key="item.name" />
    </el-select>
    <el-table :data="tableData" text-align="center" stripe border>
      <el-table-column prop="id" v-if="false" />
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column :label="'绑定权限：' + item" v-for="item of CheckRow" :key="item">
        <template #default="scope">
          <el-button size="small" :type="buttonColor(scope.column.rawColumnKey, scope.row.id)"
            :icon="buttonIcon(scope.column.rawColumnKey, scope.row.id)"
            @click="buttonClick(scope.column.rawColumnKey, scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close, Search, Refresh } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance() as any;
const selectValue = ref([]);

const tableData = ref([]);
const checkList = ref([]);
const checkListValue = ref();
let CheckRow = ref([]);
let tableDataCopy: any;
let checkListValueCopy: any;
const selectChange = (val: any) => {
  CheckRow.value = selectValue.value;
}

const buttonClick = (permissionName: string, roleId: string) => {
  let permissionId;
  for (let entity of checkListValueCopy) {
    if (entity.name === permissionName) {
      permissionId = entity.id;
      break;
    }
  }
  let params = new URLSearchParams();
  params.append("roleId", roleId);
  params.append("permissionId", permissionId);
  proxy.$http.post("security/updateRoleAndPermission", params).then((res: any) => {
    if (res.data.code === 200) {
      getUserAndRole().then(() => {
        ElMessage.success("更新成功");
      });
    } else {
      ElMessage.error("更新失败");
    }
  });
};

const buttonColor = (permissionName: string, roleId: string) => {
  return successOrFailedMatch(permissionName, roleId) ? "success" : "danger";
};

const buttonIcon = (permissionName: string, roleId: string) => {
  return successOrFailedMatch(permissionName, roleId) ? Check : Close;
};

const successOrFailedMatch = (permissionName: string, roleId: string) => {
  for (let entity of tableDataCopy) {
    if (entity.roleId === roleId && entity.permissionName === permissionName) {
      return true;
    }
  }
  return false;
};

async function getUserAndRole() {
  await proxy.$http.post("security/getAllRoleAndPermission").then((res: any) => {
    tableDataCopy = res.data.data.content;
  });
  await proxy.$http.post("role/getAllRoleCheckBox").then((res: any) => {
    tableData.value = res.data.data;
  });
}

onMounted(() => {
  proxy.$http.post("security/getAllPermissionCheckBox").then((res: any) => {
    checkListValue.value = res.data.data;
    checkListValueCopy = res.data.data;
  });
  getUserAndRole();
});

</script>
<style scoped>

.pageTop {
  margin-top: 20px;
}

.selectClass{
  margin-bottom: 20px;
}
</style>