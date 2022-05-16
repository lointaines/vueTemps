<template>
  <div>
    <h3>{{ itemName + '下属资源如下：' }}</h3>
    <el-table :data="table.data" text-align="center" stripe border>
      <el-table-column type="selection" />
      <el-table-column prop="id" v-if="false"></el-table-column>
      <el-table-column prop="imgSrc" label="资源图片">
        <template #default="scope">
          <el-image style="width: 100%; height: 100%"
            :src="'data:' + scope.row.imgType + ';base64,' + scope.row.imgSrc"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180px"></el-table-column>
      <el-table-column label="操作" width="170" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageTop" background :page-sizes="[5, 10, 20, 30]"
      layout="sizes, prev, pager, next, jumper, total" :total="table.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :page-size="table.pageSize" />
       <el-button type="primary" @click="handleAdd" class="addButton">新增图片</el-button>
    <el-dialog v-model="dialogData.visible" :title="dialogData.title" width="500px" :close-on-click-modal="false"
      draggable>
      <el-form :model="form" :rules="rules" @keyup.enter="addOrUpdateItemImg(formRef)" ref="formRef">
        <el-form-item label="资源id" label-width="100px" prop="id" v-if="false">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="资源简述" label-width="100px" prop="description">
          <el-input type="textarea" autosize v-model="form.description" placeholder="请输入资源简述" />
        </el-form-item>
        <el-form-item v-if="dialogData.upload">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogData.visible = false">取消</el-button>
          <el-button type="primary" @click="addOrUpdateItemImg(formRef)">{{ dialogData.title }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance() as any;
const router = useRouter();
const itemId = ref();
const itemName = ref("");
const table = reactive({
  data: [],
  total: 0,
  pageSize: 5,
  currentPage: 1,
  orderDirection: "descending",
  orderField: "name"
});

const dialogData = reactive({
  title: "增加图片",
  visible: false,
  upload: false,
})

const form = ref({
  id: "",
  name: "",
  description: ""
});
const formRef = ref();
const rules = ref({
  name: [{
    required: true, message: "资源名称不能为空", trigger: "blur"
  }],
});

const handleSizeChange = function (val: number) {
  table.pageSize = val;
  getItemImgByItemId();
};

const handleCurrentChange = function (val: number) {
  table.currentPage = val;
  getItemImgByItemId();
};
const handleEdit = function (row: any) {
  dialogData.visible = true;
  dialogData.title = "修改资源描述";
  form.value.id = row.id;
  form.value.name = row.name;
  form.value.description = row.description;
};

const handleAdd = function (row: any) {
  dialogData.visible = true;
  dialogData.title = "新增资源图片及描述";
  form.value.id = '';
  form.value.name = '';
  form.value.description = '';
};

const handleDelete = function (row: any) {
  let params = new URLSearchParams();
  params.append("id", row.id);
  proxy.$http.post("item/deleteItemImgById", params).then((res: any) => {
    if (res.data.code === 200) {
      ElMessage.success("删除成功");
      getItemImgByItemId();
    } else {
      ElMessage.error("删除失败");
    }
  });
};

async function addOrUpdateItemImg(formSubmit: any) {
  await formSubmit.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let params = new URLSearchParams();
      params.append("id", value.id);
      params.append("name", value.name);
      params.append("description", value.description);
      proxy.$http
        .post("itemImg/addOrUpdateItemImg", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success(dialogData.title + "成功");
            dialogData.visible = false;
            getItemImgByItemId();
          } else {
            ElMessage.error(dialogData.title + "类别失败,资源类别名重复");
          }
        });
    } else {
      return false;
    }
  });
}

async function getItemImgByItemId() {
  let params = new URLSearchParams();
  params.append("itemId", String(itemId.value.id));
  params.append("pageSize", String(table.pageSize));
  params.append("currentPage", String(table.currentPage));
  params.append("orderField", String(table.orderField));
  params.append("orderDirection", String(table.orderDirection));

  await proxy.$http.post("itemImg/getItemImgByItemId", params).then((res: any) => {
    table.data = res.data.data.content;
    table.total = res.data.data.totalElements;
  });
}

onMounted(() => {
  itemId.value = router.currentRoute.value.query;
  getItemImgByItemId();
  let params = new URLSearchParams();
  params.append("id", String(itemId.value.id));
  proxy.$http.post("item/getItemById", params).then((res: any) => {
    itemName.value = "“" + res.data.data.name + "”";
  });
});

</script>
<style scoped>
.addButton {
  margin-top: 10px;
  margin-bottom: 10px;
}

.pageTop {
  margin-top: 20px;
  margin-left: 0px;
  padding-left: 0px;
}
</style>