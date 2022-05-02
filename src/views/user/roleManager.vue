<template>
  <div>
    <el-button type="primary" @click="dialogFormVisibleAdd = true">新增角色</el-button>
    <el-table :data="tableData" text-align="center" stripe border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="角色编号" width="140" v-if="false" />
      <el-table-column prop="name" label="角色名称" width="120" />
      <el-table-column prop="description" label="角色描述" align="center"/>
    </el-table>
    <el-pagination background :page-sizes="[5, 10, 20, 30]" layout="sizes, prev, pager, next, jumper, total"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" />
    <el-dialog v-model="dialogFormVisibleAdd" title="新增角色" width="500px" :close-on-click-modal="false" draggable>
      <el-form :model="form" :rules="rules" @keyup.enter="addRole(formRef)" ref="formRef">
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
          <el-button type="primary" @click="addRole(formRef)">新增角色</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, getCurrentScope, onBeforeMount, ref, onMounted, toRef, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowLeft, ArrowRight, Delete, Edit, Share, } from '@element-plus/icons-vue'
const { proxy } = getCurrentInstance() as any;

const total = ref(0);
const tableData = ref([]);
const pageSize = ref(5);
const currentPage = ref(1);
const dialogFormVisibleAdd = ref(false);

const form = ref({
  name: "",
  description: "",
});
const formRef = ref();
const rules = ref({
  name: [{
    required: true, message: "名称不能为空", trigger: "blur"
  }],
});

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

const handleEdit = function (row: any) {
  let params = new URLSearchParams();
  params.append("id", row.id);
  proxy.$http
    .post("tibetan/role/getRoleById", params)
    .then((res: any) => {
      if (res.data.code == 200) {
        ElMessage.success("删除成功");
        getRole();
      } else {
        ElMessage.error("删除失败");
      }
    });
};

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
      proxy.$http
        .post("tibetan/role/deleteRoleById", params)
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

async function addRole(formSubmit: any) {
  await formSubmit.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let params = new URLSearchParams();
      params.append("name", value.name);
      params.append("description", value.description);
      proxy.$http
        .post("tibetan/role/addRole", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success("新增角色成功");
            dialogFormVisibleAdd.value = false
            formSubmit.resetFields();
            getRole();
          } else {
            ElMessage.error("新增角色失败");
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
</style>