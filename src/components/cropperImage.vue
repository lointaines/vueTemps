<template>
  <vueCropper ref="cropper" fixed :img="option.img" :outputSize="option.size" :outputType="option.outputType"
    :autoCropWidth="30" :autoCropHeight="20">
  </vueCropper>
  <el-upload class="upload-demo" action="" :on-change="newHeader" auto-upload="false">
    <el-button type="primary">选择新头像</el-button>

  </el-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { VueCropper } from 'vue-cropper';
const option = ref({
  img: "",
  size: 1,
  outputType: ""
})

const cropper = ref();
const headSrc = ref();

function newHeader(file: any) {
  headSrc.value = URL.createObjectURL(file.raw);
  option.value.img = URL.createObjectURL(file.raw);
  console.log(file)
}
</script>
<style scoped>
</style>