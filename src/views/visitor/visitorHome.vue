<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :label="item.name" v-for="item in itemTypeTabs" :name="item.id"></el-tab-pane>
  </el-tabs>
  <el-table :data="table.data" style="width: 100%" :show-header="false" @row-click="tableRowClick">
    <el-table-column prop="id" v-if="false" />
    <el-table-column prop="name" />
  </el-table>
  <el-pagination class="pageTop" background :page-sizes="[5, 10, 20, 30]"
    layout="sizes, prev, pager, next, jumper, total" :total="table.total" @size-change="handleSizeChange"
    @current-change="handleCurrentChange" :page-size="table.pageSize" />
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, reactive } from "vue";
import { ElMessage, ElMessageBox, TabsPaneContext } from "element-plus";

import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance() as any;
const router = useRouter();
const itemTypeTabs = ref([{
  name: "",
  id: ""
}]);
const tabId = ref("");
const activeName = ref('first');
const table = reactive({
  data: [],
  total: 0,
  pageSize: 5,
  currentPage: 1,
  orderDirection: "descending",
  orderField: "name"
});

const handleSizeChange = function (val: number) {
  table.pageSize = val;
  getAllItemNormal();
};

const handleCurrentChange = function (val: number) {
  table.currentPage = val;
  getAllItemNormal();
};
const handleClick = (tab: TabsPaneContext, event: Event) => {
  tabId.value = String(tab.props.name);
  table.pageSize = 5;
  table.currentPage = 1;
  getAllItemNormal();
}
const tableRowClick = (row: any) => {
  let routerData = router.resolve({
    name: "visitorDetail",
    path: '/visitorDetail',
    query: {
      'id': row.id,
    }
  });
  window.open(routerData.href, '_blank');
}

function getItemTypeVisiter() {
  proxy.$http.post("itemType/getAllItemTypeTabs").then((res: any) => {
    itemTypeTabs.value = res.data.data;
    if (res.data.data) {
      activeName.value = res.data.data[0].id;
      tabId.value = res.data.data[0].id;
    }
  });
}

function getAllItemNormal() {
  let params = new URLSearchParams();
  params.append("type", tabId.value);
  params.append("pageSize", String(table.pageSize));
  params.append("currentPage", String(table.currentPage));
  proxy.$http.post("item/getAllItemNormal", params).then((res: any) => {
    table.data = res.data.data.content;
    table.total = res.data.data.totalElements;
  });
}
onMounted(() => {
  getItemTypeVisiter();
  getAllItemNormal();
});
</script>
<style scoped >
.pageTop {
  margin-top: 20px;
}
</style>