<template>
  <div>
    <el-table :data="table.data" text-align="center" stripe border>
      <el-table-column prop="id" label="权限编号" width="140" v-if="false" />
      <el-table-column prop="name" label="权限名称" />
      <el-table-column prop="description" label="权限描述" />
      <el-table-column label="操作" width="170" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">修改描述</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageTop" background :page-sizes="[5, 10, 20, 30]"
      layout="sizes, prev, pager, next, jumper, total" :total="table.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :page-size="table.pageSize" />
    <el-dialog v-model="dialogFormVisible" title="修改描述" width="500px" :close-on-click-modal="false" draggable>
      <el-form :model="form" @keyup.enter="editDescription(formRef)" ref="formRef">
        <el-form-item  label-width="100px" prop="id" v-if="false">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="权限名称" label-width="100px" prop="name">
          <el-input v-model="form.name" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="权限描述" label-width="100px" prop="description">
          <el-input v-model="form.description" placeholder="请输入权限描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false;getPermission()">取消</el-button>
          <el-button type="primary" @click="editDescription(formRef)">修改描述</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, reactive } from "vue";
import { ElMessage } from "element-plus";
import axios from 'axios';

const dialogFormVisible = ref(false);
const table = reactive({
  data: [],
  total: 0,
  pageSize: 5,
  currentPage: 1,
  orderDirection: "descending",
  orderField: "name"
});
const form = ref({
  id: "",
  name: "",
  description: "",
});

const formRef = ref();
function getPermission() {
  let params = new URLSearchParams();
  params.append("pageSize", String(table.pageSize));
  params.append("currentPage", String(table.currentPage));
  axios.post("security/getAllPermission", params).then((res: any) => {
    table.data = res.data.data.content;
    table.total = res.data.data.totalElements;
  });
}
const handleSizeChange = function (val: number) {
  table.pageSize = val;
  getPermission();
};

const handleCurrentChange = function (val: number) {
  table.currentPage = val;
  getPermission();
};

const handleEdit = function (row: any) {
  form.value = row;
  dialogFormVisible.value = true;
};

const editDescription = (formRef: any) => {
  let value = form.value;
      let params = new URLSearchParams();
      params.append("id", value.id);
      params.append("description", value.description);
      axios.post("security/updateDescriptionByPermissionId", params).then((res: any) => {
        let result = res.data;
        if (result.code == 200) {
          ElMessage.success("更新成功");
          dialogFormVisible.value = false;
          getPermission();
        } else {
          ElMessage.error("更新失败");
        }
      });
}

onMounted(() => {
  getPermission();
});
</script>
<style scoped>
.pageTop {
  margin-top: 20px;
}
</style>