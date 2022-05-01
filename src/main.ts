import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import axios from 'axios'
import 'element-plus/dist/index.css'

const app = createApp(App);

axios.defaults.baseURL = '/api'
app.config.globalProperties.$http = axios

app.use(store).use(router).use(ElementPlus).mount('#app')