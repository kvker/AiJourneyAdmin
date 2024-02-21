import './assets/main.css'

import { createApp, } from 'vue'
import { createPinia } from 'pinia'
import "tailwindcss/tailwind.css"
import "@/styles/main.css"
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.config.errorHandler = (err, instance, info) => {
  // 处理错误，例如：报告给一个服务
  console.log(err, instance, info)
}

app.mount('#app')