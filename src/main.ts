import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import axios from 'axios'
import 'element-plus/dist/index.css'
import { zhCn } from 'element-plus/lib/locale'
import VueCropper from 'vue-cropper';
import 'vue-cropper/dist/index.css'
const app = createApp(App);

axios.defaults.baseURL = '/api';

app.config.globalProperties.$http = axios
router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + "";
    }
    next();
});

app.use(store).use(router).use(ElementPlus, {
    locale: zhCn
}).use(VueCropper).mount('#app');