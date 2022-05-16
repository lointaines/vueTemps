<template>
  <el-container>
    <el-aside width="400px">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>西藏民族文化信息系统</span>
          </div>
        </template>
        <p> 简介：致力于西藏民族文化保护工作的一款基于前后端分离项目</p>
        <p> 当前版本：v1.0.0 </p>
      </el-card>
    </el-aside>
    <el-main class="tech">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>技术选型</span>
          </div>
        </template>
        <p>前端采用Vue 3.2</p>
        <p>后端采用SpringMVC、SpringBoot 2.6.6、Spring Data JPA 2.6.6</p>
        <p>前后端数据交互为Json格式</p>
        <p>安全框架为Sa-Token 3.0.0</p>
      </el-card>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.tech{
  padding-top: 0px;
}
</style>
