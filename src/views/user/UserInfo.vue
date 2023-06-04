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
              <el-form-item label="性别" label-width="100px" prop="sex">
                <el-radio-group v-model="form.sex">
                  <el-radio :label="0">男</el-radio>
                  <el-radio :label="1">女</el-radio>
                </el-radio-group>
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
import { ref, onMounted, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import userInfoCard from '@/components/user/userInfoCard.vue'
import userInfoPassword from '@/components/user/userInfoPassword.vue'
import axios from 'axios';

interface UserInfo {
  id: string,
  name: string,
  password: string,
  email: string,
  sex: string,
  phone: string,
  createTime: string,
  role: string
}

const activeName = ref('first');
const form = ref<UserInfo>({} as UserInfo);

const formCard = ref<UserInfo>({} as UserInfo);
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
      axios.post("user/updateUserInfoById", {
        "name": String(form.value.name),
        "id": String(window.localStorage.getItem('userId')),
        "email": form.value.email,
        "phone": form.value.phone,
        "sex": form.value.sex,
      })
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success("修改信息成功");
            getUserById();
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
  axios.get("user/getUserById", {
    params: {
      'id': window.localStorage.getItem('userId')
    }
  }).then((res: any) => {
    if (res.data.code == 200) {
      form.value = res.data.data;
      formCard.value = Object.assign({}, res.data.data);
    }
  });
}

onMounted(() => {
  getUserById();
  let params = new URLSearchParams();
  params.append("userId", String(window.localStorage.getItem('userId')));
  axios.post("userAndRole/getRoleNameByUserId", params).then((res: any) => {
    if (res.data.code == 200) {
      formCard.value.role = res.data.data;
    }
  });
});
</script>
<style scoped></style>