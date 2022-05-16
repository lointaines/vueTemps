<template>
  <div>
    <h3>{{ item.name + '：' }}</h3>
    <span>{{ item.content }}</span>
    <el-image v-for="itemImage in itemImages" :src="'data:' + itemImage.imgType + ';base64,' + itemImage.imgSrc">
    </el-image>
  </div>
</template>
<script lang="ts" setup>
import { getCurrentInstance, ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance() as any;
const router = useRouter();
const item = reactive({
  id: "",
  name: "",
  content: ""
});
const itemImages = ref([{
  imgType: "",
  imgSrc: ""
}]);

function getItemImgByItemId() {
  let params = new URLSearchParams();
  params.append("itemId", String(item.id));

  proxy.$http.post("itemImg/getOneItemImgByItemId", params).then((res: any) => {
    console.log(res.data.data.content)
    itemImages.value = res.data.data.content;
  });
}

onMounted(() => {
  item.id = String(router.currentRoute.value.query.id);
  let params = new URLSearchParams();
  params.append("id", String(item.id));
  proxy.$http.post("item/getItemByIdNormal", params).then((res: any) => {
    item.name = "“" + res.data.data.name + "”";
    item.content = res.data.data.content;
  });
  getItemImgByItemId()
});

</script>
<style scoped>
</style>