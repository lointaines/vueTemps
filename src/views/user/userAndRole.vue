<template>
  <div>
    <el-checkbox-group v-model="checkList" @change="handleCheckList">
      <el-checkbox :label="item.name" v-for="item of checkListValue" :key="item.name" border></el-checkbox>
    </el-checkbox-group>

    <el-table :data="tableData" text-align="center" stripe border>
      <el-table-column type="selection" />
      <el-table-column prop="id" label="用户编号" v-if="false" />
      <el-table-column prop="name" label="用户名称"></el-table-column>
      <el-table-column :label="'绑定角色：' + item" v-for="item of CheckRow" :key="item">
        <template #default="scope">
          <el-button size="small" :type="buttonColor(scope.column.rawColumnKey, scope.row.id)"
            :icon="buttonIcon(scope.column.rawColumnKey, scope.row.id)"
            @click="buttonClick(scope.column.rawColumnKey, scope.row.id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-sizes="[5, 10, 20, 30]" layout="sizes, prev, pager, next, jumper, total"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" />
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance() as any;

const total = ref(0);
const tableData = ref([]);
const pageSize = ref(5);
const currentPage = ref(1);
const checkList = ref([]);
const checkListValue = ref();
let CheckRow = ref([]);
let tableDataCopy: any;
let checkListValueCopy: any;

const buttonClick = (roleName: string, userId: string) => {
  let roleId;
  for (let entity of checkListValueCopy) {
    if (entity.name === roleName) {
      roleId = entity.id;
      break;
    }
  }
  let params = new URLSearchParams();
  params.append("roleId", roleId);
  params.append("userId", userId);
  proxy.$http.post("userAndRole/updateUserAndRole", params).then((res: any) => {
    if (res.data.code === 200) {
      getUserAndRole().then(() => {
        ElMessage.success("更新成功");
      });
    } else {
      ElMessage.error("更新失败");
    }
  });
};

const buttonColor = (roleName: string, userId: string) => {
  return successOrFailedMatch(roleName, userId) ? "success" : "danger";
};

const buttonIcon = (roleName: string, userId: string) => {
  return successOrFailedMatch(roleName, userId) ? Check : Close;
};

const successOrFailedMatch = (roleName: string, userId: string) => {
  for (let entity of tableDataCopy) {
    if (entity.userId === userId && entity.roleName === roleName) {
      return true;
    }
  }
  return false;
};

const handleSizeChange = function (val: number) {
  pageSize.value = val;
  getUserAndRole();
};

const handleCurrentChange = function (val: number) {
  currentPage.value = val;
  getUserAndRole();
};

const handleCheckList = () => {
  CheckRow.value = checkList.value;
}

async function getUserAndRole() {
  let params = new URLSearchParams();
  params.append("pageSize", String(pageSize.value));
  params.append("currentPage", String(currentPage.value));

  await proxy.$http.post("userAndRole/getAllUserAndRole", params).then((res: any) => {
    tableDataCopy = res.data.data.content;
    console.log(tableDataCopy)
  });
  await proxy.$http.post("user/getAllUser", params).then((res: any) => {
    tableData.value = res.data.data.content;
    total.value = res.data.data.totalElements;
  });
}

onMounted(() => {
  proxy.$http.post("role/getAllRole").then((res: any) => {
    checkListValue.value = res.data.data.content;
    checkListValueCopy = res.data.data.content;
  });
  getUserAndRole();
});

</script>
<style scoped>
</style>