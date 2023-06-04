import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import axios, { AxiosError, AxiosResponse } from 'axios';
import 'element-plus/dist/index.css'
import { zhCn } from 'element-plus/lib/locale'
import VueCropper from 'vue-cropper';
import 'vue-cropper/dist/index.css'
const app = createApp(App);
import { ElMessage, ElMessageBox } from "element-plus";

const apiUrl = process.env.NODE_ENV === 'production'
    ? 'http://example.com/api'
    : 'http://localhost:8082/tibetan'

axios.defaults.baseURL = apiUrl;

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title + "";
    }
    next();
});

function handleRequestError(error: AxiosError): void {
    if (error.response) {
        // 服务器返回错误状态码的情况
        ElMessage.error(`请求被拒绝，错误状态码为: ${error.response.status}`, error.response.data);
    } else if (error.request) {
        // 无法连接主机的情况
        ElMessage.error('无法连接主机(可能是后端未启动)');
    } else {
        // 其他类型的错误
        ElMessage.error(`发生了错误: ${error.message}`);
    }
}

function handleResponseError(response: AxiosResponse): AxiosResponse {
    const code = response.data.code;
    if (code === 401) {
        ElMessage.error("请先登录");
        router.push("/login")
    } else if (code == 403) {
        ElMessage.error("权限不足");
    }
    return response;
}

// 添加响应拦截器
axios.interceptors.response.use(
    (response: AxiosResponse) => {
        return handleResponseError(response);
    },
    (error: AxiosError) => {
        handleRequestError(error);
        return Promise.reject(error);
    });

app.use(store).use(router).use(ElementPlus, {
    locale: zhCn
}).use(VueCropper).mount('#app');