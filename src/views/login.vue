<template>
  <el-form :model="form" label-width="120px" v-model="Right">
    <el-form-item label=" name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label=" password">
      <el-input v-model="form.password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">Create</el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import type { FormInstance } from "element-plus";
//默认值
const form = reactive({
  name: "name",
  password: "password",
});

const onSubmit = () => {
  console.log("submit!");
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
