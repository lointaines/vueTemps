<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchFormRef">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="searchForm.name" autocomplete="off" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getUserAndRole">搜索</el-button>
        <el-button :icon="Refresh" @click="searchFormRef.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="checkBox">
      <div>勾选以选择查看授权</div>
      <el-checkbox-group v-model="checkList" @change="handleCheckList">
        <el-checkbox :label="item.name" v-for="item of checkListValue" :key="item.name" border></el-checkbox>
      </el-checkbox-group>

    </div>
    <el-table :data="table.data" text-align="center" stripe border>
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
    <div class="pageTop">
      <el-pagination background :page-sizes="[5, 10, 20, 30]" layout="sizes, prev, pager, next, jumper, total"
        :total="table.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="table.pageSize" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted,reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close, Search, Refresh } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance() as any;
const searchForm = ref({
  name: ""
});
const searchFormRef = ref();
const table = reactive({
  data: [],
  total: 0,
  pageSize: 5,
  currentPage: 1,
  orderDirection: "descending",
  orderField: "name"
});
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
  table.pageSize = val;
  getUserAndRole();
};

const handleCurrentChange = function (val: number) {
  table.currentPage = val;
  getUserAndRole();
};

const handleCheckList = () => {
  CheckRow.value = checkList.value;
}

async function getUserAndRole() {
  let params = new URLSearchParams();
  params.append("pageSize", String(table.pageSize));
  params.append("currentPage", String(table.currentPage));
  params.append("name", searchForm.value.name);
  await proxy.$http.post("userAndRole/getAllUserAndRole", params).then((res: any) => {
    tableDataCopy = res.data.data.content;
    console.log(tableDataCopy)
  });
  await proxy.$http.post("user/getAllUser", params).then((res: any) => {
    table.data = res.data.data.content;
    table.total = res.data.data.totalElements;
  });
}

onMounted(() => {
  proxy.$http.post("role/getAllRoleCheckBox").then((res: any) => {
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