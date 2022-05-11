<template>
  <div>
    <div class="checkBox">
      <div>勾选以选择查看授权</div>
      <el-checkbox-group v-model="checkList" @change="handleCheckList">
        <el-checkbox :label="item.name" v-for="item of checkListValue" :key="item.name" border></el-checkbox>
      </el-checkbox-group>

    </div>
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
const searchForm = ref({
  name: ""
});
const tableData = ref([]);
const checkList = ref([]);
const checkListValue = ref();
let CheckRow = ref([]);
let tableDataCopy: any;
let checkListValueCopy: any;

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

const handleCheckList = () => {
  CheckRow.value = checkList.value;
}

async function getUserAndRole() {
  await proxy.$http.post("security/getAllRoleAndPermission").then((res: any) => {
    tableDataCopy = res.data.data.content;
    console.log(tableDataCopy)
  });
  await proxy.$http.post("role/getAllRoleCheckBox").then((res: any) => {
    tableData.value = res.data.data;
  });
}

onMounted(() => {
  proxy.$http.post("security/getAllPermission").then((res: any) => {
    checkListValue.value = res.data.data;
    checkListValueCopy = res.data.data;
  });
  getUserAndRole();
});

</script>
<style scoped>
.checkBox {
  margin-bottom: 15px;
}

.checkBox>div {
  display: inline;
  margin-right: 10px;
}

.pageTop {
  margin-top: 20px;
}
</style>