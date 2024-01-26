import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import http from './utils/http'
import './assets/main.css'

const app = createApp(App)
app.use(Antd)
app.mount('#app')

app.config.globalProperties.$axios=http;