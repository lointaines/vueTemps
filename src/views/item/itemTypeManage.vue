<template>
  <div>
    <el-button type="primary" @click="handleAdd" class="addButton">新增类型</el-button>
    <el-table :data="tableData" text-align="center" stripe border>
      <el-table-column type="selection" />
      <el-table-column prop="id" label="资源类别编号" v-if="false" />
      <el-table-column prop="name" label="资源类别名称"></el-table-column>
      <el-table-column prop="description" label="资源类别描述"></el-table-column>
      <el-table-column label="操作" width="170" align="center">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageTop" background :page-sizes="[5, 10, 20, 30]"
      layout="sizes, prev, pager, next, jumper, total" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :page-size="pageSize" />
    <el-dialog v-model="dialogFormVisibleAdd" :title="addOrUpdateTitle" width="500px" :close-on-click-modal="false"
      draggable>
      <el-form :model="form" :rules="rules" @keyup.enter="addOrUpdateItemType(formRef)" ref="formRef">
        <el-form-item label="资源id" label-width="100px" prop="id" v-if="false">
          <el-input v-model="form.id" autocomplete="off" placeholder="请输入资源类别" />
        </el-form-item>
        <el-form-item label="资源类别" label-width="100px" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入资源类别" />
        </el-form-item>
        <el-form-item label="资源简述" label-width="100px" prop="description">
          <el-input type="textarea" autosize v-model="form.description" placeholder="请输入资源简述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
          <el-button type="primary" @click="addOrUpdateItemType(formRef)">{{ addOrUpdateTitle }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const { proxy } = getCurrentInstance() as any;

const total = ref(0);
const tableData = ref([]);
const pageSize = ref(5);
const currentPage = ref(1);
const orderField = ref("name");
const orderDirection = ref("descending");
const dialogFormVisibleAdd = ref(false);
const addOrUpdateTitle = ref("新增资源类别");

const form = ref({
  id: "",
  name: "",
  description: "",
});
const formRef = ref();
const rules = ref({
  name: [{
    required: true, message: "资源名称不能为空", trigger: "blur"
  }],
});

const handleSizeChange = function (val: number) {
  pageSize.value = val;
  getItemType();
};

const handleCurrentChange = function (val: number) {
  currentPage.value = val;
  getItemType();
};

const handleDelete = function (row: any) {
  ElMessageBox.confirm("确定删除'" + row.name + "'?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
    draggable: true,
  })
    .then(() => {
      let params = new URLSearchParams();
      params.append("id", row.id);
      proxy.$http.post("itemType/deleteItemTypeById", params).then((res: any) => {
        if (res.data.code === 200) {
          ElMessage.success("删除成功");
          getItemType();
        } else {
          ElMessage.error("删除失败,该资源类别仍存在资源");
        }
      });
    })
    .catch(() => {
      ElMessage.info("操作取消");
    });;
};

const handleEdit = function (row: any) {
  dialogFormVisibleAdd.value = true;
  addOrUpdateTitle.value = "修改资源类别";
  form.value.id = row.id;
  form.value.name = row.name;
  form.value.description = row.description;
};

const handleAdd = function (row: any) {
  dialogFormVisibleAdd.value = true;
  addOrUpdateTitle.value = "新增资源类别";
  form.value.id = '';
  form.value.name = '';
  form.value.description = '';
};

function getItemType() {
  let params = new URLSearchParams();
  params.append("pageSize", String(pageSize.value));
  params.append("currentPage", String(currentPage.value));
  proxy.$http.post("itemType/getAllItemType", params).then((res: any) => {
    tableData.value = res.data.data.content;
    total.value = res.data.data.totalElements;
  });
}

async function addOrUpdateItemType(formSubmit: any) {
  await formSubmit.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let params = new URLSearchParams();
      params.append("id", value.id);
      params.append("name", value.name);
      params.append("description", value.description);
      proxy.$http
        .post("itemType/addOrUpdateItemType", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success(addOrUpdateTitle.value + "成功");
            dialogFormVisibleAdd.value = false;
            getItemType();
          } else {
            ElMessage.error(addOrUpdateTitle.value + "类别失败,资源类别名重复");
          }
        });
    } else {
      return false;
    }
  });
}

onMounted(() => {
  getItemType();
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