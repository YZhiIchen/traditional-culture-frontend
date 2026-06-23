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
    host: '0.0.0.0',
    port: 9528,
    proxy: {
      '/api': {
        target: 'http://localhost:9527',  // 替换为你的后端地址
        changeOrigin: true,
        // 如果后端接口没有 /api 前缀，去掉 rewrite
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/uploads': {
        target: 'http://localhost:9527',  // 后端静态资源（上传图片）
        changeOrigin: true
      }
    }
  }
})