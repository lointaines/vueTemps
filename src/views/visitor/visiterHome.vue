<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="User" name="first">User</el-tab-pane>
    <el-tab-pane label="Config" name="second">Config</el-tab-pane>
    <el-tab-pane label="Role" name="third">Role</el-tab-pane>
    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
  </el-tabs>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, } from "vue";
import { ElMessage, ElMessageBox, TabsPaneContext } from "element-plus";
import { Search, Refresh } from '@element-plus/icons-vue'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}

const { proxy } = getCurrentInstance() as any;
const total = ref(0);
const tableData = ref([]);
const pageSize = ref(5);
const currentPage = ref(1);
const dialogFormVisibleAdd = ref(false);

const handleSizeChange = function (val: number) {
  pageSize.value = val;
  getItemTypeVisiter();
};

const handleCurrentChange = function (val: number) {
  currentPage.value = val;
  getItemTypeVisiter();
};

function getItemTypeVisiter() {
  let params = new URLSearchParams();
  proxy.$http.post("role/getAllRole", params).then((res: any) => {
    tableData.value = res.data.data.content;
    total.value = res.data.data.totalElements;
    console.log(res.data)
  });
}

function getItemByItemType() {
  let params = new URLSearchParams();
  params.append("pageSize", String(pageSize.value));
  params.append("currentPage", String(currentPage.value));
  proxy.$http.post("role/getAllRole", params).then((res: any) => {
    tableData.value = res.data.data.content;
    total.value = res.data.data.totalElements;
    console.log(res.data)
  });
}
onMounted(() => {
  getItemTypeVisiter();
  getItemByItemType();
});
</script>
<style scoped >
</style>