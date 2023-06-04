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
          <el-image v-if="headSrc" :src="headSrc" @click="headClick"
            style=" border-radius: 50%; height: 120px; width:120px;" />
          <el-avatar v-else :icon="User" class="head" :size="120" @click="headClick" />
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
            <div class="alignRight"> {{ props.msg.name }}</div>
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
            <div class="alignRight">{{ props.msg.phone }}</div>
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
            <div class="alignRight"> {{ props.msg.email }}</div>
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
            <div class="alignRight">{{ props.msg.role }}</div>
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
            <div class="alignRight">{{ props.msg.createTime }}</div>
          </el-col>
        </el-row>
        <el-divider class="divider" />
      </div>
    </el-card>
    <el-dialog v-model="dialogVisible" title="修改图像" width="700px" :close-on-click-modal="false" draggable>
      <el-container class="cHeight">
        <el-aside>
          <vueCropper ref="cropper" @crop-moving="realTime" :autoCrop="true" :autoCropWidth="200" :autoCropHeight="180"
            :outputType="option.outputType" :outputSize="1" :img="option.img" :canMove="false" :canScale="true">
          </vueCropper>
        </el-aside>
        <el-main>
          <el-image :src="temp" class="imageT"></el-image>
        </el-main>
      </el-container>
      <el-upload accept=".jpg,.png,.jpeg" action="" :on-change="newHeader" :auto-upload="false"
        :before-upload="beforeAvatarUpload" :show-file-list="false">
        <template #trigger>
          <el-button type="primary" class="uploadButton">选择新头像</el-button>
        </template>

        <el-button type="primary" @click="headAction">上传头像</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, defineProps } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { User, Iphone, Message, Calendar, Postcard } from '@element-plus/icons-vue'
import axios from 'axios';

const dialogVisible = ref(false);
const props = defineProps({
  msg: {
    type: Object,
    default: {
    }
  }
});
const option = ref({
  img: "",
  outputType: "png",
});
const temp = ref("");
const cropper = ref();
const headSrc = ref();
const time = ref(0);
const headFile = ref();

function realTime(e: any) {
  time.value++;
  if (time.value > 1) {
    return;
  } else {
    setTimeout(() => {
      time.value = 0;
    }, 300);
    cropper.value.getCropData((data: any) => {
      console.log(data)
      temp.value = data;
    });
    cropper.value.getCropBlob((data: any) => {
      headFile.value = data;
    });
  };
}
function headClick() {
  dialogVisible.value = true;
}

function newHeader(file: any) {
  option.value.img = URL.createObjectURL(file.raw);
  temp.value = option.value.img;
}

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

const headAction = () => {
  let formData = new FormData();
  formData.append("id", props.msg.id);
  formData.append("file", headFile.value)
  axios.post("user/updateUserHeadById", formData)
    .then((res: any) => {
      let result = res.data;
      if (result.code == 200) {
        dialogVisible.value = false;
        getUserHead();
      } else {
        ElMessage.error("获取头像失败");
      }
    });
};

const getUserHead = () => {
  let params = new URLSearchParams();
  let id = window.localStorage.getItem("userId");
  params.append("id", String(id));
  axios.post("user/getUserHeadById", params)
    .then((res: any) => {
      let result = res.data;
      if (result.code == 200) {
        headSrc.value = "data:image/png;base64," + result.data;
        temp.value = headSrc.value;
        option.value.img = headSrc.value;
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
}

.head {
  font-size: 50px;
}

.cHeight {
  margin-left: 40px;
  width: 600px;
  height: 300px;
}

.imageT {
  margin-left: 50px;
  margin-top: 25px;
  text-align: center;
  width: 200px;
  border-radius: 50%;
  height: 200px;
}

.uploadButton {
  margin-top: 20px;
  margin-left: 135px;
  margin-right: 205px;
}
</style>