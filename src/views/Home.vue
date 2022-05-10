<template>
  <el-container>
    <!-- 顶部 -->
    <el-header>
      <div>资源信息系统</div>
      <div class="toolbar">
        <el-dropdown @command="handleCommand">
          <el-icon style="margin-right: 10px">
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
        <span style="margin-top: 4px">User</span>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu :default-openeds="['1']" router>
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <message />
                </el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/userInfo">个人信息</el-menu-item>
                <el-menu-item index="/userManage">用户管理</el-menu-item>
                <el-menu-item index="/roleManage">角色管理</el-menu-item>
                <el-menu-item index="/userAndRole">用户授权</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <icon-menu />
                </el-icon>
                <span>文化资源管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/itemManage">资源管理</el-menu-item>
                <el-menu-item index="/itemAdd">添加资源</el-menu-item>
                <el-menu-item index="/itemTypeManage">资源类别管理</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { getCurrentInstance, getCurrentScope, onBeforeMount, ref } from "vue";
import { Menu as IconMenu, Message, Setting } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const { proxy } = getCurrentInstance() as any;
const handleCommand = (command: string) => {
  console.log(command)
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
  router.push("/login");
}
</script>

<style scoped lang="scss">
.el-aside .el-menu {
  background-color: rgb(217, 236, 255);
  height: 100vh;
}

.el-header {
  text-align: right;
  font-size: 13px;
  background-color: rgb(84, 92, 100);
  color: #fff;
}

.el-header>div:first-child {
  float: left;
  height: 100%;
  margin-top: 15px;
  margin-left: 10px;
  font-size: 20px;
}

.toolbar {
  vertical-align: center;
  margin-top: 20px;
  margin-left: 10px;
}
</style>
