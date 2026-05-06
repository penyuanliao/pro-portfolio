import { createApp } from 'vue'
import '@/style.css'
import App from './App.vue'
import router from './router' // 引入你剛剛建立的路由實例

const app = createApp(App)
app.use(router) // 將路由實例掛載到 Vue 應用程式
app.mount('#app')
