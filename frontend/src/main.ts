import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

// Add webSocket support
let ws = new WebSocket("ws://localhost:3000");
ws.onopen = function () {
    console.log("Client connected!");
    ws.send("Hi, this is a client!");
}

ws.onmessage = function (event) {
    console.log(`Received message from the server => ${event.data}`);
}

ws.onclose = function () {
    console.log("Client disconnected!");
}
