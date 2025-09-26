import './assets/css/app.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import globalMethods from '@/utils/globalMethods';

import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

const app = createApp(App);

// element plus

app.use(ElementPlus)
app.use(createPinia())
app.use(router)


// Global Properties에 등록
Object.keys(globalMethods).forEach((method) => {
    app.config.globalProperties[`$${method}`] = globalMethods[method];
});

// 카카오 SDK 초기화
window.Kakao.init('838a5c93a2abc20701620e873c519934'); // JavaScript 키를 여기에 넣으세요.
console.log('Kakao SDK initialized:', window.Kakao.isInitialized());

app.mount('#app')
