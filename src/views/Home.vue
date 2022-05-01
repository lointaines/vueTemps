<template>
  <el-container>
    <!-- 顶部 -->
    <el-header>
      <div>资源信息系统</div>
      <div class="toolbar">
        <el-dropdown>
          <el-icon style="margin-right: 10px">
            <setting color="white" />
          </el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item>登出</el-dropdown-item>
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
                <el-menu-item index="/userInfo">用户信息</el-menu-item>
                <el-menu-item index="/roleManager">角色管理</el-menu-item>
                <el-menu-item index="/roleAuthorization">用户授权</el-menu-item>
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
                <el-menu-item index="2-1">资源信息</el-menu-item>
                <el-menu-item index="2-2">Option 2</el-menu-item>
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

const { proxy } = getCurrentInstance() as any;


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
