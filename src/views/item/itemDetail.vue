<template>
    <div>
        <el-table :data="tableData" text-align="center" stripe border>
            <el-table-column type="selection" />
            <el-table-column prop="id" v-if="false"></el-table-column>
            <el-table-column prop="imgSrc" label="资源图片">
                <template #default="scope">
                    <el-image style="width: 100%; height: 100%" :preview-teleported="true"
                        :preview-src-list="['data:' + scope.row.imgType + ';base64,' + scope.row.imgSrc]"
                        :src="'data:' + scope.row.imgType + ';base64,' + scope.row.imgSrc"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="desrciption" label="描述"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180px"></el-table-column>
            <el-table-column label="操作" width="170" align="center">
                <template #default="scope">
                    <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background :page-sizes="[5, 10, 20, 30]" layout="sizes, prev, pager, next, jumper, total"
            :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-size="pageSize" />
        <!-- <el-dialog v-model="dialogFormVisibleAdd" title="修改描述" width="500px" :close-on-click-modal="false" draggable>
            <el-form :model="form" :rules="rules" @keyup.enter="addUser(formRef)" ref="formRef">
                <el-form-item label="登录名" label-width="100px" prop="name">
                    <el-input v-model="form.name" autocomplete="off" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码" label-width="100px" prop="password">
                    <el-input v-model="form.password" placeholder="请输入登录密码" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
                    <el-button type="primary" @click="addUser(formRef)">新增用户</el-button>
                </span>
            </template>
        </el-dialog> -->
    </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close } from '@element-plus/icons-vue'
import { useRouter } from "vue-router";
import { useBase64 } from "@vueuse/core";

const { proxy } = getCurrentInstance() as any;

const itemId = ref();
const total = ref(0);
const tableData = ref([]);
const pageSize = ref(5);
const currentPage = ref(1);
const orderField = ref("name");
const orderDirection = ref("descending");
const router = useRouter();

const handleSizeChange = function (val: number) {
    pageSize.value = val;
    getItemImgByItemId();
};

const handleCurrentChange = function (val: number) {
    currentPage.value = val;
    getItemImgByItemId();
};

const handleDelete = function (row: any) {
    let params = new URLSearchParams();
    params.append("id", row.id);
    proxy.$http.post("item/deleteItemImgById", params).then((res: any) => {
        if (res.data.code === 200) {
            ElMessage.success("删除成功");
        } else {
            ElMessage.error("删除失败");
        }
    });
};

const handleDetail = function (row: any) {
    const router = useRouter();
    router.resolve("itemAdd")
};

async function getItemImgByItemId() {
    let params = new URLSearchParams();
    params.append("id", String(itemId.value.id));
    params.append("pageSize", String(pageSize.value));
    params.append("currentPage", String(currentPage.value));
    params.append("orderField", String(orderField.value));
    params.append("orderDirection", String(orderDirection.value));

    await proxy.$http.post("item/getItemImgById", params).then((res: any) => {
        tableData.value = res.data.data.content;
        total.value = res.data.data.totalElements;
        console.log(res.data.data.content)
    });
}

onMounted(() => {
    itemId.value = router.currentRoute.value.query;
    getItemImgByItemId();
});

</script>
<style scoped>
</style>