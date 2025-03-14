import { createApp } from 'vue'
import { basicSetup } from 'codemirror'
import VueCodemirror from 'vue-codemirror'
import router from './routes'
import { createPinia } from 'pinia'

import './style.css'

import App from './App.vue'


const app = createApp(App)

app.use(createPinia()).use(VueCodemirror).use(router).mount('#app')

//createApp(App).mount('#app')
