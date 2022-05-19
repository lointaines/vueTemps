<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="380">
        <userInfoCard :msg="formCard" />
      </el-aside>
      <el-main>
        <el-tabs v-model="activeName">
          <el-tab-pane label="基本资料" name="first">
            <el-form :model="form" :rules="rules" ref="formRef">
              <el-form-item label="用户名称" label-width="100px" prop="name">
                <el-input v-model="form.name" />
              </el-form-item>
              <el-form-item label="手机号码" label-width="100px" prop="phone">
                <el-input v-model="form.phone" />
              </el-form-item>
              <el-form-item label="邮箱" label-width="100px" prop="email">
                <el-input v-model="form.email" type="email" />
              </el-form-item>
              
              <el-form-item label-width="100px">
                <el-button type="primary" @click="updateUser(formRef)">修改信息</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="密码修改" name="second">
            <userInfoPassword />
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import userInfoCard from '@/components/user/userInfoCard.vue'
import userInfoPassword from '@/components/user/userInfoPassword.vue'
import { useStore } from "vuex";

const { proxy } = getCurrentInstance() as any;
const store = useStore();

const activeName = ref('first');
const form = ref({
  id: "",
  name: "",
  password: "",
  email: "",
  sex: "",
  phone: "",
});

const formCard = ref({
  id:"",
  name: "",
  email: "",
  sex: "",
  phone: "",
  createTime: "",
  role:""
});
const formRef = ref();
const rules = ref({
  name: [{
    required: true, message: "姓名不能为空", trigger: "blur"
  }],
  phone: [{
    required: true, message: "号码不能为空", trigger: "blur"
  }, {
    pattern: /^((1[345789]\d{9}))$/, message: "号码格式不正确"
  }],
});


const updateUser = (formSubmit: any) => {
  formSubmit.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let params = new URLSearchParams();
      params.append("name", value.name);
      params.append("id", String(window.localStorage.getItem('userId')));
      params.append("email", value.email);
      params.append("phone", value.phone);
      proxy.$http
        .post("user/updateUserInfoById", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success("修改信息成功");
            location.reload();
          } else {
            ElMessage.error("修改信息失败");
          }
        });
    } else {
      return false;
    }
  });
}

function getUserById() {
  let params = new URLSearchParams();
  params.append("id", String(window.localStorage.getItem('userId')));
  proxy.$http.post("user/getUserById", params).then((res: any) => {
    if (res.data.code == 200) {
      form.value = res.data.data;
      let data = res.data.data;
      formCard.value.id = data.id;
      formCard.value.name = data.name;
      formCard.value.phone = data.phone;
      formCard.value.email = data.email;
      formCard.value.createTime = data.createTime;
    }
  });
}

onMounted(() => {
  getUserById();
  let params = new URLSearchParams();
  params.append("userId", String(window.localStorage.getItem('userId')));
  proxy.$http.post("userAndRole/getRoleNameByUserId", params).then((res: any) => {
    if (res.data.code == 200) {
      formCard.value.role = res.data.data;
    }
  });
});
</script>
<style scoped>
</style>