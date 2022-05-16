<template>
  <el-container>
    <!-- 顶部 -->
    <el-header>
      <div class="headerP">
        <homeHeader></homeHeader>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <el-scrollbar>
          <el-menu :default-openeds="['1']" router>
            <el-menu-item index="/Home">
              <!-- <template #title> -->
              <el-icon>
                <home-filled />
              </el-icon>
              <span>首页</span>
              <!-- </template> -->

            </el-menu-item>
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <user-filled />
                </el-icon>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/userInfo">个人信息</el-menu-item>
                <el-menu-item index="/userManage">用户管理</el-menu-item>
                <el-menu-item index="/roleManage">角色管理</el-menu-item>

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
            <el-sub-menu index="3">
              <template #title>
                <el-icon>
                  <Histogram />
                </el-icon>
                <span>安全管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/permissionManage">权限查看</el-menu-item>
                <el-menu-item index="/roleAndPermission">授予权限</el-menu-item>
                <el-menu-item index="/userAndRole">用户授权</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-sub-menu index="4">
              <template #title>
                <el-icon>
                  <View />
                </el-icon>
                <span>游客信息</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="/visitorHome">游客首页</el-menu-item>
                <el-menu-item index="/visitorDetail">详情</el-menu-item>
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
import homeHeader from "@/components/homeHeader.vue"
import { Menu as IconMenu, View, UserFilled, HomeFilled, Histogram } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.el-aside .el-menu {
  background-color: rgb(217, 236, 255);
  height: 100vh;
  overflow: auto
}

.headerP {
  height: 100%;
}

.el-header {
  padding: 0px;
}
</style>
