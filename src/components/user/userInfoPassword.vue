<template>
  <div>
    <el-form :rules="passwordRules" ref="passWordFormRef" :model="passwordForm">
      <el-form-item label="原密码" label-width="100px" prop="originalPassword">
        <el-input v-model="passwordForm.originalPassword" placeholder="请输入原密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="新密码" label-width="100px" prop="password">
        <el-input v-model="passwordForm.password" placeholder="请输入登录密码" type="password" show-password />
      </el-form-item>
      <el-form-item label="确认密码" label-width="100px" prop="enterPassword">
        <el-input v-model="passwordForm.enterPassword" placeholder="确认密码" type="password" show-password />
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="updatePassword(passWordFormRef)">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive, getCurrentScope, onBeforeMount, ref, onMounted, toRef, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
const { proxy } = getCurrentInstance() as any;
const passWordFormRef = ref();
const passwordForm = ref({
  password: "",
  originalPassword: "",
  enterPassword: ""
});

const validateEnterPassword = function (rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error("输入不能为空"));
  }
  else if (value != passwordForm.value.password) {
    callback(new Error("密码不一致"))
  } else {
    callback();
  }
};
const passwordRules = ref({
  originalPassword: [{
    required: true, message: "原密码不能为空", trigger: "blur"
  }],
  password: [{
    required: true, message: "密码不能为空", trigger: "blur"
  }],
  enterPassword: [{
    validator: validateEnterPassword, trigger: "blur"
  }],
});
const updatePassword = (formSubmit: any) => {
  formSubmit.validate((valid: any) => {
    if (valid) {
      let value = passwordForm.value;
      let params = new URLSearchParams();
      params.append("id", "148f0368-f26d-4540-a0f8-54de8f6470bc");
      params.append("originalPassword", value.originalPassword);
      params.append("password", value.password);
      proxy.$http
        .post("user/updateUserPasswordById", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success("修改信息成功");
          } else {
            ElMessage.error("修改信息失败");
          }
        });
    } else {
      return false;
    }
  });
}
</script>
<style scoped>
</style>