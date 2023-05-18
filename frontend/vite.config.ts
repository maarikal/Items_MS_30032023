import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Upgrade': 'websocket'
        },
      },
    },
  },
})
