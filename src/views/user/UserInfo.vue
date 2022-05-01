<template>
  <div>
    <el-button type="primary" @click="addUser()">新增用户</el-button>
    <el-table :data="tableData" text-align="center" stripe border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="用户编号" width="140" />
      <el-table-column prop="name" label="用户名称" width="120" />
      <el-table-column prop="state" label="状态" />
      <el-table-column prop="sex" label="性别" />
      <el-table-column prop="birthday" label="生日" />
      <el-table-column prop="sign" label="签名" />
      <el-table-column prop="password" label="密码" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column label="操作" width="170">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">Edit</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-sizes="[5, 10, 20, 30]" layout="sizes, prev, pager, next, jumper, total"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" />

    <el-dialog v-model="dialogFormVisible" title="新增用户" width="500px" :close-on-click-modal="false" draggable>
      <el-form :model="form">
        <el-form-item label="登录名" label-width="100px">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="form.password" placeholder="请输入登录密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">新增用户</el-button>
        </span>
      </template>
    </el-dialog>
  </div>

</template>
<script lang="ts" setup>
import { getCurrentInstance, getCurrentScope, onBeforeMount, ref, onMounted, toRef } from "vue";
import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Action } from 'element-plus'

const { proxy } = getCurrentInstance() as any;

const total = ref(90)
const tableData = ref([]);
const pageSize = ref(5);
const currentPage = ref(1);
const dialogFormVisible = ref(false);

const form = ref({
  name: '',
  password: ''
})
const handleEdit = function (row: any) {
  console.log("edit:", row.id);
  getUser();
}

const handleDelete = function (row: any) {
  ElMessageBox.confirm("是否删除名称为" + row.name + "的用户？", '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
  })
    .then(() => {
      const code = ref();
      deleteUserById(row.id).then(res => {
        code.value = res;
      });

      console.log(code);
      console.log(Number(code.value) == 200)
      if (Number(code) == 200) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      } else {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '操作取消',
      })
    })
  getUser();
}

const handleSizeChange = function (val: number) {
  pageSize.value = val; console.log("sizechnage: ", val)
  getUser();
}

const handleCurrentChange = function (val: number) {
  currentPage.value = val;
  getUser();
}


function getUser() {
  let params = new URLSearchParams();
  params.append('pageSize', String(pageSize.value));
  params.append('currentPage', String(currentPage.value));
  proxy.$http
    .post("tibetan/user/getAllUser", params)
    .then((response: any) => {
      console.log(response.data.data);
      tableData.value = response.data.data.content;
      total.value = response.data.data.totalElements;
    });
}

async function deleteUserById(id: string) {
  const code = ref("");
  let params = new URLSearchParams();
  params.append('id', id);
  await proxy.$http
    .post("tibetan/user/deleteUserById", params)
    .then((response: any) => {
      console.log(response.data.code);
      let result = response.data;
      code.value = result.code;
    });
  return code;
}

function addUser() {
  dialogFormVisible.value = true;
  
  getUser();
}
onMounted(() => {
  getUser();
});
</script>
<style scoped>
</style>
