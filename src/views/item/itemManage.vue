<template>
  <div>
    <el-form :model="searchForm" :inline="true" ref="searchFormRef">
      <el-form-item label="名称" prop="name">
        <el-input v-model="searchForm.name" autocomplete="off" placeholder="请输入资源名称" />
      </el-form-item>
      <el-form-item label="类型" prop="itemTypeValue" >
        <el-select v-model="searchForm.itemTypeValue" clearable placeholder="请选择资源类型">
          <el-option v-for="item in itemType" :key="item.name" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :icon="Search" type="primary" @click="getItem">搜索</el-button>
        <el-button :icon="Refresh" @click="searchFormRef.resetFields()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" text-align="center" stripe border>
      <el-table-column type="selection" />
      <el-table-column prop="id" label="资源编号" v-if="false" />
      <el-table-column prop="name" label="资源名称"></el-table-column>
      <el-table-column prop="state" label="资源状态"></el-table-column>
      <el-table-column prop="itemType.name" label="资源类型"></el-table-column>
      <el-table-column prop="originalTime" label="起源时间"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="editTime" label="上次编辑时间"></el-table-column>
      <el-table-column label="操作" width="170" align="center">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">查看</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageTop" background :page-sizes="[5, 10, 20, 30]"
      layout="sizes, prev, pager, next, jumper, total" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :page-size="pageSize" />
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close, Search, Refresh } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance() as any;

const total = ref(0);
const tableData = ref([]);
const pageSize = ref(5);
const currentPage = ref(1);
const orderField = ref("name");
const orderDirection = ref("descending");

const itemType = ref([{
  name: "",
  id: ""
}]);
const router = useRouter();
const searchForm = ref({
  name: "",
  itemTypeValue: ""
});
const searchFormRef = ref();

const handleSizeChange = function (val: number) {
  pageSize.value = val;
  getItem();
};

const handleCurrentChange = function (val: number) {
  currentPage.value = val;
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
      proxy.$http.post("item/deleteItemById", params).then((res: any) => {
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

const handleEdit = function (row: any) {
  let routerData = router.resolve({
    name: "itemDetail",
    path: '/itemDetail',
    query: {
      'id': row.id,
    }
  });
  window.open(routerData.href, '_blank')
};

async function getItem() {
  let params = new URLSearchParams();
  params.append("pageSize", String(pageSize.value));
  params.append("currentPage", String(currentPage.value));
  params.append("orderField", String(orderField.value));
  params.append("orderDirection", String(orderDirection.value));
  params.append("name", searchForm.value.name);
  params.append("itemType", searchForm.value.itemTypeValue);
  await proxy.$http.post("item/getAllItem", params).then((res: any) => {
    tableData.value = res.data.data.content;
    total.value = res.data.data.totalElements;
    // console.log(res.data.data.content);
  });
}

onMounted(() => {
  let params = new URLSearchParams();
  proxy.$http.post("itemType/getAllItemType").then((res: any) => {
    itemType.value = res.data.data.content;

    console.log(res.data);
  });
  getItem();
});

</script>
<style scoped>
.pageTop {
  margin-top: 20px;
}
</style>