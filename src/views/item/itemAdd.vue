<template>
  <div class="itemAdd">
    <el-form :model="form" @keyup.enter="addItem(formRef)" class="itemFormAdd" label-width="100px" ref="formRef"
      :rules="rules">
      <el-form-item label="资源名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入资源名称" />
      </el-form-item>
      <el-form-item label="资源类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择资源类型">
          <el-option :label="item.name" v-for="item in itemType" :value="item.id" :key="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="起源时间" prop="date">
        <el-date-picker v-model="form.createTime" type="date" placeholder="请选择起源时间" style="width: 100%" />
      </el-form-item>
      <el-form-item label="相关资料">
        <el-upload action="" ref="imgUpload" multiple :limit="3" :file-list="fileList" :on-change="handleChange"
          accept=".jpg, .png, .jpeg" :auto-upload="false" draggable>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png/jpeg 且总文件大小小于10MB.
            </div>
          </template>
          <el-button type="primary">点击上传文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addItem(formRef)">新增资源</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const { proxy } = getCurrentInstance() as any;
let fileList: any = []
const form = ref({
  name: "",
  state: "",
  type: "",
  createTime: ""
});

const formRef = ref();
const rules = ref({
  name: [{
    required: true, message: "资源名称不能为空", trigger: "blur"
  }],
  type: [{
    required: true, message: "资源类型不能为空", trigger: "blur"
  }],
});
const itemType = ref([{ id: '', name: '' }]);

const handleChange = () => {
  console.log(fileList);
  let formData = new FormData();
  fileList.forEach((element: any) => {
    formData.append("picture", element.raw)
  });
}

async function addItem(formSubmit: any) {
  await formSubmit.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let formData = new FormData();
      fileList.forEach((element: any) => {
        formData.append("files", element.raw);
      });
      formData.append("name", value.name);
      formData.append("type", value.type);
      formData.append("originalTime",value.createTime);
      proxy.$http
        .post("item/addItem", formData)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success("新增资源成功");
            formSubmit.resetFields();
          } else {
            ElMessage.error("新增资源失败");
          }
        });
    } else {
      return false;
    }
  });
};

onMounted(() => {
  let params = new URLSearchParams();
  proxy.$http.post("itemType/getAllItemType", params).then((res: any) => {
    itemType.value = res.data.data.content;
    console.log(res.data.data.content);
  });
});
</script>
<style scoped>
.itemAdd {
  text-align: center;
  /* background-color: rgb(79, 69, 69); */
  height: 100%;
}

.itemFormAdd {
  /* background-color: rgb(227, 78, 78); */
  width: 50%;
  margin: 0 auto;
  padding-top: 80px;
}
</style>