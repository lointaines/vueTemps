<template>
  <div>
    <el-table :data="tableData" text-align="center" stripe border>
      <el-table-column prop="id" label="权限编号" width="140" v-if="false" />
      <el-table-column prop="name" label="权限名称" />
      <el-table-column prop="description" label="权限描述" />
    </el-table>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, } from "vue";
const { proxy } = getCurrentInstance() as any;

const tableData = ref([]);

function getPermission() {
  let params = new URLSearchParams();
  proxy.$http.post("security/getAllPermission", params).then((res: any) => {
    tableData.value = res.data.data;
  });
}

onMounted(() => {
  getPermission();
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