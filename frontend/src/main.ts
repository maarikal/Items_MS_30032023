import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
// @ts-ignore
import store from './store/itemsStore.js';

createApp(App).use(store).use(router).mount('#app')