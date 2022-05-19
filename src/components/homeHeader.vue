<template>
  <div class="backgroundBlack">
    <el-container>
      <el-aside>
        <div class="headTitle" >西藏民族文化资源信息系统</div>
      </el-aside>
      <el-main>
        <div class="toolbar">
          <el-dropdown @command="handleCommand">
            <el-icon class="setIcon">
              <setting color="white" />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                <el-dropdown-item command="set" divided>设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>登出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{ userName }}</span>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const userName = ref("未登录");
const { proxy } = getCurrentInstance() as any;
const handleCommand = (command: string) => {
  switch (command) {
    case 'userInfo':
      gotoUserInfo();
      break;
    case 'set':
      gotoSet();
      break;
    case 'logout':
      gotoLogout();
      break;
    default:
  }
}

const gotoUserInfo = () => {
  router.push("/userInfo");
}

const gotoSet = () => {
}

const gotoLogout = () => {
  window.localStorage.removeItem('userId');
  window.localStorage.removeItem('satoken');
  router.push("/login");
}
function getUserNameById() {
  let params = new URLSearchParams();
  params.append("id", String(window.localStorage.getItem('userId')));
  proxy.$http.post("user/getUserById", params).then((res: any) => {
    if (res.data.code == 200) {
      userName.value = res.data.data.name;
    }
  });
}

onMounted(() => {
  getUserNameById();
});
</script>
<style scoped>
.backgroundBlack {
  background-color: rgb(84, 92, 100);
  color: #fff;
  height: 100%;
}


.headTitle {
  height: 50px;
  line-height: 50px;
  margin-left: 30px;
  font-size: 20px;
}

.toolbar {
  text-align: right;
  font-size: 20px;
}

.setIcon {
  margin-right: 10px;
  margin-top: 5px;
  font-size: 15px;
}
</style>