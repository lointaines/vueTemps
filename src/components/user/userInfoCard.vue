<template>
  <div class="common-layout">
    <el-card class="box-card" shadow="always">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>
      <div class="text ">
        <div class="headBackground">
          <el-upload :action="headAction" :on-success="handleAvatarSuccess" :show-file-list="false"
            :before-upload="beforeAvatarUpload" :on-error="handleAvatarError" accept=".jpg, .png, .jpeg">
            <img v-if="headSrc" :src="headSrc" class="avatar" />
            <el-avatar v-else :icon="User" class="head" :size="120" :src="headSrc" />
            <template #tip>
              <div class="el-upload__tip">
                点击更换头像
              </div>
            </template>
          </el-upload>
        </div>
        <el-divider class="divider" />
        <el-row>
          <el-col :span="12">
            <div>
              <el-icon>
                <user />
              </el-icon> 用户名称
            </div>
          </el-col>
          <el-col :span="12">
            <div class="alignRight"> {{ props.form.name }}</div>
          </el-col>
        </el-row>
        <el-divider class="divider" />
        <el-row>
          <el-col :span="12">
            <div>
              <el-icon>
                <iphone />
              </el-icon> 手机号码
            </div>
          </el-col>
          <el-col :span="12">
            <div class="alignRight">{{ props.form.phone }}</div>
          </el-col>
        </el-row>
        <el-divider class="divider" />
        <el-row>
          <el-col :span="12">
            <div>
              <el-icon>
                <message />
              </el-icon> 用户邮箱
            </div>
          </el-col>
          <el-col :span="12">
            <div class="alignRight"> {{ props.form.email }}</div>
          </el-col>
        </el-row>
        <el-divider class="divider" />
        <el-row>
          <el-col :span="12">
            <div>
              <el-icon>
                <postcard />
              </el-icon> 角色
            </div>
          </el-col>
          <el-col :span="12">
            <div class="alignRight">{{ props.form.role }}</div>
          </el-col>
        </el-row>
        <el-divider class="divider" />
        <el-row>
          <el-col :span="12">
            <div>
              <el-icon>
                <calendar />
              </el-icon> 创建日期
            </div>
          </el-col>
          <el-col :span="12">
            <div class="alignRight">{{ props.form.createTime }}</div>
          </el-col>
        </el-row>
        <el-divider class="divider" />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, getCurrentScope, onBeforeMount, ref, onMounted, toRef, defineProps } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowLeft, ArrowRight, Delete, Edit, Share, User, Avatar, Iphone, Message, Calendar, Postcard } from '@element-plus/icons-vue'
import { stringify } from "querystring";
const { proxy } = getCurrentInstance() as any;
const props = defineProps({
  form: {
    type:Object,
    default:{

    }
  }
});
const form = props.form;
const headSrc = ref();
const headAction = ref("");
const beforeAvatarUpload = (rawFile: any) => {
  if (!(rawFile.type == 'image/jpeg' || rawFile.type == 'image/png')) {
    ElMessage.error('图片格式必须是jpeg或png');
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小必须小于2MB!');
    return false;
  }
  return true;
}

const handleAvatarError = () => {
  ElMessage.error('服务器错误');
}
const handleAvatarSuccess = () => {
  getUserHead();
}

const getUserHead = () => {
  let params = new URLSearchParams();
  params.append("id", props.form.id);
  proxy.$http
    .post("user/getUserHeadById", params)
    .then((res: any) => {
      let result = res.data;
      if (result.code == 200) {
        // ElMessage.success("修改信息成功");
      } else {
        ElMessage.error("获取头像失败");
      }
    });
}
onMounted(() => {
  getUserHead();
});
</script>
<style scoped>
.box-card {
  width: 380px;
  /* font-size: 12px; */
}

.alignRight {
  text-align: right;
}

.alignLeft {
  text-align: left;
}

.divider {
  margin-top: 10px;
  margin-bottom: 10px;
}

.headBackground {
  text-align: center;
  /* padding-right: 10px; */
  /* background-color: red; */
}

.head {
  font-size: 50px;
}
</style>