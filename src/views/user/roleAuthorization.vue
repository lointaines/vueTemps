<template>
  <div>
    <el-button type="primary" @click="dialogFormVisibleAdd = true">保存设置</el-button>
    <el-table :data="tableData" text-align="center" stripe border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="角色编号" width="140" v-if="false" />
      <el-table-column prop="useraname" label="用户名称"></el-table-column>
      <el-table-column prop="rolename" label="授予角色" width="120" />
    </el-table>
    <el-pagination background :page-sizes="[5, 10, 20, 30]" layout="sizes, prev, pager, next, jumper, total"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" />
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, getCurrentScope, onBeforeMount, ref, onMounted, toRef, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance() as any;

const total = ref(0);
const tableData = ref([]);
const pageSize = ref(5);
const currentPage = ref(1);
const dialogFormVisibleAdd = ref(false);

const stateChange = (row: any) => {
  let title = row.state == false ? "是否禁用名称为" : "是否启用名称为";
  ElMessageBox.confirm(title + row.name + "的角色？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      let params = new URLSearchParams();
      params.append("id", row.id);
      params.append("state", String(row.state));
      proxy.$http
        .post("tibetan/role/updateRoleById", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success("更新成功");
          } else {
            ElMessage.error("更新失败");
          }
          getRole();
        });
    })
    .catch(() => {
      ElMessage.info("操作取消");
      row.state = !row.state;
    });
}

const handleSizeChange = function (val: number) {
  pageSize.value = val;
  getRole();
};

const handleCurrentChange = function (val: number) {
  currentPage.value = val;
  getRole();
};

function getRole() {
  let params = new URLSearchParams();
  params.append("pageSize", String(pageSize.value));
  params.append("currentPage", String(currentPage.value));
  proxy.$http.post("tibetan/role/getAllRole", params).then((res: any) => {
    tableData.value = res.data.data.content;
    total.value = res.data.data.totalElements;
    console.log(res.data)
  });
}

onMounted(() => {
  getRole();
});
</script>
<style scoped>
</style>