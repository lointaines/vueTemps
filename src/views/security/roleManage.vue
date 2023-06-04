<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchFormRef">
      <el-form-item label="名称" prop="name">
        <el-input v-model="searchForm.name" autocomplete="off" placeholder="请输入角色名称" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="searchForm.description" autocomplete="off" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getRole">搜索</el-button>
        <el-button :icon="Refresh" @click="searchFormRef.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="handleAdd" class="addButton">新增角色</el-button>
    <el-table :data="table.data" text-align="center" stripe border>
      <el-table-column prop="id" label="角色编号" width="140" v-if="false" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="description" label="角色描述" />
      <el-table-column label="操作" width="170" align="center">
        <template #default="scope">
          <div v-if="(scope.row.name != 'admin') && (scope.row.name != 'user') && (scope.row.name != 'superAdmin')">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageTop" background :page-sizes="[5, 10, 20, 30]"
      layout="sizes, prev, pager, next, jumper, total" :total="table.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :page-size="table.pageSize" />
    <el-dialog v-model="dialogFormVisibleAdd" :title="addOrUpdateTitle" width="500px" :close-on-click-modal="false"
      draggable>
      <el-form :model="form" :rules="rules" @keyup.enter="addOrUpdateRole(formRef)" ref="formRef">
        <el-form-item label="角色名称" label-width="100px" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="description">
          <el-input v-model="form.description" placeholder="请输入角色描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
          <el-button type="primary" @click="addOrUpdateRole(formRef)">{{ addOrUpdateTitle }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Search, Refresh } from '@element-plus/icons-vue'
import axios from 'axios';

const table = reactive({
  data: [],
  total: 0,
  pageSize: 5,
  currentPage: 1,
  orderDirection: "descending",
  orderField: "name"
});
const dialogFormVisibleAdd = ref(false);
const addOrUpdateTitle = ref("新增资源类别");

const searchForm = ref({
  name: "",
  description: ""
});
const searchFormRef = ref();
const form = ref({
  id: "",
  name: "",
  description: "",
});
const formRef = ref();
const rules = ref({
  name: [{
    required: true, message: "名称不能为空", trigger: "blur"
  }],
});

const handleDelete = (row: any) => {
  ElMessageBox.confirm("是否删除名称为" + row.name + "的角色？", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      let params = new URLSearchParams();
      params.append("id", row.id);
      axios.post("role/deleteRoleById", params)
        .then((res: any) => {
          if (res.data.code == 200) {
            ElMessage.success("删除成功");
            getRole();
          } else {
            ElMessage.error("删除失败");
          }
        });
    })
    .catch(() => {
      ElMessage.info("操作取消");
    });
};

const handleEdit = function (row: any) {
  dialogFormVisibleAdd.value = true;
  addOrUpdateTitle.value = "修改角色类别";
  form.value.id = row.id;
  form.value.name = row.name;
  form.value.description = row.description;
};

const handleAdd = function (row: any) {
  dialogFormVisibleAdd.value = true;
  addOrUpdateTitle.value = "新增角色类别";
  form.value.id = '';
  form.value.name = '';
  form.value.description = '';
};

const handleSizeChange = function (val: number) {
  table.pageSize = val;
  getRole();
};

const handleCurrentChange = function (val: number) {
  table.currentPage = val;
  getRole();
};

function getRole() {
  let params = new URLSearchParams();
  params.append("pageSize", String(table.pageSize));
  params.append("currentPage", String(table.currentPage));
  params.append("name", searchForm.value.name);
  params.append("description", searchForm.value.description);
  axios.post("role/getAllRole", params).then((res: any) => {
    table.data = res.data.data.content;
    table.total = res.data.data.totalElements;
    console.log(res.data)
  });
}

async function addOrUpdateRole(formSubmit: any) {
  await formSubmit.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let params = new URLSearchParams();
      params.append("id", value.id);
      params.append("name", value.name);
      params.append("description", value.description);
      axios.post("role/addOrUpdateRole", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success(addOrUpdateTitle.value + "成功");
            dialogFormVisibleAdd.value = false;
            getRole();
          } else {
            ElMessage.error(addOrUpdateTitle.value + "失败");
          }
        });
    } else {
      return false;
    }
  });
  getRole();
}

onMounted(() => {
  getRole();
});
</script>
<style scoped>
.addButton {
  margin-bottom: 10px;
}

.pageTop {
  margin-top: 20px;
}
</style>