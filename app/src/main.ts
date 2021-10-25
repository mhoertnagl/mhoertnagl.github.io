import { createApp } from 'vue'
import App from '@/App.vue'
import importComponents from './autoreg'

const app = createApp(App)

importComponents(app)

app.mount('#app')
