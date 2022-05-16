<template>
  <div class="loginAll">
    <el-form :model="form" label-width="80px" class="loginForm" :rules="rule" ref="ruleFormRef" @keyup.enter="submitForm(ruleFormRef)">
      <h3 class="loginTitle"> 西藏民族文化资源信息系统</h3>
      <el-form-item label=" 登录名" prop="name" class="fontColor">
        <el-input v-model="form.name" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label=" 密码" prop="password"  class="fontColor">
        <el-input v-model="form.password" placeholder="请输入密码" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        <el-button @click="resetForm(ruleFormRef)">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance() as any;
const router = useRouter();
const store = useStore();
const form = ref({
  name: "",
  password: "",
});
const rule = ref({
  name: [{
    required: true, message: "姓名不能为空", trigger: "blur"
  }],
  password: [{
    required: true, message: "密码不能为空", trigger: "blur"
  }],
});
const ruleFormRef = ref();
const submitForm = async (formEl: any) => {
  await formEl.validate((valid: any) => {
    if (valid) {
let value = form.value;
let params = new URLSearchParams();
params.append("name", value.name);
params.append("password", value.password);
proxy.$http
  .post("home/login", params)
  .then((res: any) => {
    let result = res.data;
    if (result.code == 200) {
      ElMessage.success("登录成功");
      proxy.$http.defaults.headers.common['satoken'] = result.data.saToken;
      window.localStorage.setItem('userId', result.data.id);
      window.localStorage.setItem('satoken', result.data.saToken);
      router.push("/Main")
    } else {
      ElMessage.error(result.msg);
    }
  });
    }
  });
};

const resetForm = async (formEl: any) => {
  await formEl.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let params = new URLSearchParams();
      params.append("name", value.name);
      params.append("password", value.password);
      proxy.$http
        .post("home/register", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success("注册成功");
            submitForm(formEl);
          } else {
            ElMessage.error(result.msg);
          }
        });
    }
  });
};
</script>
<style >
.loginAll {
  color: aliceblue;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/image/homeBackground.jpg');
  background-size: 100% 100%;
}

.loginForm {
  padding: 10px;
  position: absolute;
  right: 150px;
  top: 100px;
  width: 300px;
  height: 300px;
  background-color: #a0cfff77;
}

.fontColor .el-form-item__label {
  color: aliceblue;
}

.loginTitle {
  width: 100%;
  text-align: center;
  margin-bottom: 80px;
}
</style>