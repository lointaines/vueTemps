<template>
  <div>
    <el-table :data="tableData" text-align="center" stripe border>
      <el-table-column type="selection" />
      <el-table-column prop="id" label="资源编号" v-if="false" />
      <el-table-column prop="name" label="资源名称"></el-table-column>
      <el-table-column prop="state" label="资源状态"></el-table-column>
      <el-table-column prop="type" label="资源类型"></el-table-column>
      <el-table-column prop="originalTime" label="起源时间"></el-table-column>
      <el-table-column prop="creatTime" label="创建时间"></el-table-column>
      <el-table-column prop="editTime" label="上次编辑时间"></el-table-column>
      <el-table-column label="操作" width="170" align="center">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">cha</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background :page-sizes="[5, 10, 20, 30]" layout="sizes, prev, pager, next, jumper, total"
      :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" />
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance() as any;

const total = ref(0);
const tableData = ref([]);
const pageSize = ref(5);
const currentPage = ref(1);

const handleSizeChange = function (val: number) {
  pageSize.value = val;
  getItem();
};

const handleCurrentChange = function (val: number) {
  currentPage.value = val;
  getItem();
};

const handleDelete = function (row: any) {
  let params = new URLSearchParams();
  params.append("id", row.id);
  proxy.$http.post("item/deleteById", params).then((res: any) => {
    if (res.data.code === 200) {
      ElMessage.success("删除成功");
    } else {
      ElMessage.success("删除失败");
    }
  });
};

const handleDetail = function (row: any) {
  
};

const handleEdit = function (row: any) {
  
};

async function getItem() {
  let params = new URLSearchParams();
  params.append("pageSize", String(pageSize.value));
  params.append("currentPage", String(currentPage.value));
  await proxy.$http.post("item/getAllItem", params).then((res: any) => {
    tableData.value = res.data.data.content;
    total.value = res.data.data.totalElements;
  });
}

onMounted(() => {
  getItem();
});

</script>
<style scoped>
</style>