<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchFormRef">
      <el-form-item label="名称" prop="name">
        <el-input v-model="searchForm.name" autocomplete="off" placeholder="请输入资源名称" />
      </el-form-item>
      <el-form-item label="类型" prop="itemTypeValue">
        <el-select v-model="searchForm.itemTypeValue" clearable placeholder="请选择资源类型">
          <el-option v-for="item in itemType" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getItem">搜索</el-button>
        <el-button :icon="Refresh" @click="searchFormRef.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="table.data" text-align="center" stripe border>
      <el-table-column prop="id" label="资源编号" v-if="false" />
      <el-table-column prop="name" label="资源名称"></el-table-column>
      <el-table-column prop="state" label="资源状态">
        <template #default="scope">
          <el-button v-if="scope.row.state == true" type="success" :icon="Check" size="small" />
          <el-button v-else type="danger" :icon="Close" size="small" />
        </template>
      </el-table-column>
      <el-table-column prop="itemType.name" label="资源类型"></el-table-column>
      <el-table-column prop="originalTime" label="起源时间" min-width="100px"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="100px"></el-table-column>
      <el-table-column prop="editTime" label="上次编辑时间" min-width="100px"></el-table-column>
      <el-table-column label="操作" min-width="160px" align="center">
        <template #default="scope">
          <el-button size="small" @click="handleCheck(scope.row)">详情</el-button>
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageTop" background :page-sizes="[5, 10, 20, 30]"
      layout="sizes, prev, pager, next, jumper, total" :total="table.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :page-size="table.pageSize" />
    <el-dialog v-model="dialogData.visible" :title="dialogData.title" width="500px" :close-on-click-modal="false"
      draggable>
      <el-form :model="form" :rules="rules" @keyup.enter="updateItem(formRef)" ref="formRef">
        <el-form-item label="资源id" label-width="100px" prop="id" v-if="false">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="名称" label-width="100px" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="id">
          <el-radio-group v-model="form.state">
            <el-radio :label="true">正常</el-radio>
            <el-radio :label="false">审核中</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型" label-width="100px" prop="type">
          <el-select v-model="form.itemType.id" placeholder="请选择资源类型">
            <el-option v-for="item in itemType" :key="item.name" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="起源时间" label-width="100px" prop="originalTime">
          <el-date-picker v-model="form.originalTime" type="year" placeholder="请选择起源时间" :prefix-icon="Check" />
        </el-form-item>
        <el-form-item label="资源简述" label-width="100px" prop="content">
          <el-input type="textarea" autosize v-model="form.content" placeholder="请输入资源简述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogData.visible = false; getItem();">取消</el-button>
          <el-button type="primary" @click="updateItem(formRef)">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, reactive, toRef } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close, Search, Refresh, Calendar } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import axios from 'axios';

const router = useRouter();

const table = reactive({
  data: [],
  total: 0,
  pageSize: 5,
  currentPage: 1,
  orderDirection: "descending",
  orderField: "name"
});
const dialogData = reactive({
  title: "详情",
  visible: false,
  upload: false,
})

const form = ref({
  id: "",
  name: "",
  state: "",
  itemType: {
    id: ""
  },
  originalTime: "",
  content: ""
});
const formRef = ref();
const rules = ref({
  name: [{
    required: true, message: "资源名称不能为空", trigger: "blur"
  }],
});

const itemType = ref([{
  name: "",
  id: ""
}]);

const searchForm = ref({
  name: "",
  itemTypeValue: ""
});
const searchFormRef = ref();

const handleSizeChange = function (val: number) {
  table.pageSize = val;
  getItem();
};

const handleCurrentChange = function (val: number) {
  table.currentPage = val;
  getItem();
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
      axios.post("item/deleteItemById", params).then((res: any) => {
        if (res.data.code === 200) {
          ElMessage.success("删除成功");
          getItem();
        } else {
          ElMessage.error("删除失败");
        }
      });
    })
    .catch(() => {
      ElMessage.info("操作取消");
    });
}

const handleCheck = function (row: any) {
  let routerData = router.resolve({
    name: "itemDetail",
    path: '/itemDetail',
    query: {
      'id': row.id,
    }
  });
  window.open(routerData.href, '_blank');
};

const handleEdit = function (row: any) {
  form.value = row;
  dialogData.visible = true;
};

async function getItem() {
  let params = new URLSearchParams();
  params.append("pageSize", String(table.pageSize));
  params.append("currentPage", String(table.currentPage));
  params.append("orderField", String(table.orderField));
  params.append("orderDirection", String(table.orderDirection));
  params.append("name", searchForm.value.name);
  params.append("itemType", searchForm.value.itemTypeValue);
  await axios.post("item/getAllItem", params).then((res: any) => {
    // console.log(res)
    table.data = res.data.data.content;
    table.total = res.data.data.totalElements;
  });
}

function updateItem(formSubmit: any) {
  formSubmit.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let params = new URLSearchParams();
      params.append("id", value.id);
      params.append("name", value.name);
      params.append("state", value.state);
      params.append("content", value.content);
      params.append("type", value.itemType.id);
      params.append("originalTime", String(new Date(value.originalTime)));
      axios.post("item/updateItem", params).then((res: any) => {
        let result = res.data;
        if (result.code == 200) {
          ElMessage.success("更新成功");
          dialogData.visible = false;
          getItem();
        } else {
          ElMessage.error("更新失败");
        }
      });
    } else {
      return false;
    }
  });
}

onMounted(() => {
  axios.post("itemType/getAllItemType").then((res: any) => {
    itemType.value = res.data.data.content;
  });
  getItem();
});

</script>
<style scoped lang="scss">
.pageTop {
  margin-top: 20px;
}
</style>