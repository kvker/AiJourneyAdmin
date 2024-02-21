import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        // chunkFileNames: 'static/js/[name]-[hash].js',
        // entryFileNames: 'static/js/[name]-[hash].js',
        // assetFileNames: 'static/[ext]/[name]-[hash][extname]',
        //manualChunks 两种使用形式
        manualChunks: {
          leancloudStorage: ['leancloud-storage'],
          // daisyUI: ['daisyUI'],
          // daisyui: ['daisyui'],
          vue: ['vue'],
          // vueRouter: ['vue-router'],
          echarts: ['echarts'],
        }
        // manualChunks(id) {
        //   if (id.includes('daisyUI')) {
        //     return 'daisyUI'
        //   }
        // }
        // manualChunks(id) {
        //   // id为文件的绝对路径
        //   if (id.includes('node_modules')) {
        //     return id.toString().split('node_modules/')[1].split('/')[0].toString()
        //   }
        // }
      }
    }
  }
})
