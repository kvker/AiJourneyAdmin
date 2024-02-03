import { defineConfig } from 'astro/config'
import vue from "@astrojs/vue"
import tailwind from "@astrojs/tailwind"

// https://astro.build/config
export default defineConfig({
  site: 'https://ai.ilovecats.cn/admin/',
  base: '/admin/',
  outDir: 'admin/', // 使用这个生成路径是为了方便测试结果
  trailingSlash: "always",
  integrations: [vue(), tailwind()],
  compressHTML: true,
})