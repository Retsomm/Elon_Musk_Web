import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  base: "./", // 确保 base 配置正确
  build: {
    // 優化建置設定
    outDir: 'dist',
    sourcemap: true, // 生產環境不需要 source map
    minify: true,//用 esbuild 壓縮
    chunkSizeWarningLimit: 1600, // 調整 chunk 大小警告限制
    rollupOptions: {
      output: {
        // 優化 chunk 分割
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'class-variance-authority', 'clsx'],
        },
      },
    },
  },
});