<template>
  <div class="itemAdd">
    <el-form :model="form" @keyup.enter="addItem(formRef)" class="itemFormAdd" label-width="100px" ref="formRef"
      :rules="rules">
      <el-form-item label="资源名称"  prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入资源名称" />
      </el-form-item>
      <!-- <el-form-item label="资源状态" label-width="100px">
        <el-input v-model="form.state" placeholder="请输入状态" />
      </el-form-item> -->
      <el-form-item label="资源类型"  prop="type">
        <el-select v-model="form.type" placeholder="请选择资源类型">
          <el-option :label="item.name" v-for="item in itemType" :value="item.id" :key="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="起源时间" >
          <el-date-picker v-model="form.creatTime" type="date" placeholder="请选择起源时间" style="width: 100%" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addItem(formRef)">新增资源</el-button>
      </el-form-item>
    </el-form>
    <!-- <span class="dialog-footer"> -->
    <!-- <el-button @click="dialogFormVisibleAdd = false">取消</el-button> -->

    <!-- </span> -->

  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Check, Close } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance() as any;

const form = ref({
  name: "",
  state: "",
  type: "",
  creatTime: ""
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
const itemType = ref([{ id: '', name: '' }])

onMounted(() => {
  let params = new URLSearchParams();
  proxy.$http.post("itemType/getAllItemType", params).then((res: any) => {
    itemType.value = res.data.data.content;
    console.log(res.data.data.content);
  });
});


async function addItem(formSubmit: any) {
  await formSubmit.validate((valid: any) => {
    if (valid) {
      let value = form.value;
      let params = new URLSearchParams();
      params.append("name", value.name);
      params.append("type", value.type);
      proxy.$http
        .post("item/addItem", params)
        .then((res: any) => {
          let result = res.data;
          if (result.code == 200) {
            ElMessage.success("新增资源成功");
            formSubmit.resetFields();
          } else {
            ElMessage.error("新增资源失败,资源名重复");
          }
        });
    } else {
      return false;
    }
  });
}
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