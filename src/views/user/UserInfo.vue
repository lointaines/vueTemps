<template>
  <div>
    <el-dialog v-model="dialogFormVisibleAdd" title="新增用户" width="500px" :close-on-click-modal="false" draggable>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="登录名" label-width="100px" prop="name">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="form.password" placeholder="请输入登录密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
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

const dialogFormVisibleAdd = ref(false);

const form = ref({
  name: "",
  password: "",
});
const formRef = ref();
const rules = ref({
  name: [{
    required: true, message: "姓名不能为空", trigger: "blur"
  }],
  password: [{
    required: true, message: "密码不能为空", trigger: "blur"
  }],
});

const handleEdit = function (row: any) {
  let params = new URLSearchParams();
  params.append("id", row.id);
  proxy.$http
    .post("user/getUserById", params)
    .then((res: any) => {
      if (res.data.code == 200) {
        ElMessage.success("删除成功");
        getUserById();
      } else {
        ElMessage.error("删除失败");
      }
    });
};

function getUserById() {
  let params = new URLSearchParams();
  proxy.$http.post("user/getUserById", params).then((res: any) => {
    console.log(res.data)
  });
}


onMounted(() => {
  getUserById();
});
</script>
<style scoped>
.addButton {
  margin-bottom: 10px;
}
</style>