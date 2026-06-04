import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 替换为你的后端地址
        changeOrigin: true,
        // 如果后端接口没有 /api 前缀，去掉 rewrite
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})