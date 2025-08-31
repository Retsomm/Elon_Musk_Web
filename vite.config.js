import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  // 插件陣列 - 使用陣列方法添加所需插件
  plugins: [react()], // React 插件處理 JSX 轉換
  
  // 路徑解析設定物件
  resolve: {
    alias: {
      // 路徑別名物件 - 鍵值對映射，簡化 import 路徑
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
      // 此處使用 path 方法處理目錄路徑，fileURLToPath 將 URL 轉為檔案路徑
    },
  },
  
  // 開發伺服器設定物件
  server: {
    proxy: {
      // 代理設定物件 - 處理 API 請求轉發
      '/api': {
        target: 'http://localhost:3000', // API 目標伺服器
        changeOrigin: true, // 修改請求來源
        // 重寫函式 - 使用函式方法處理路徑字串
        rewrite: (path) => path.replace(/^\/api/, ''), // 路徑轉換，移除 /api 前綴
      },
    },
  },
  
  // 設定基礎路徑
  base: "./", 
  
  // 建置選項物件 - 包含多層巢狀設定
  build: {
    outDir: 'dist', // 輸出目錄
    sourcemap: true, // 生成 sourcemap 便於除錯
    minify: true, // 使用 esbuild 壓縮
    chunkSizeWarningLimit: 1600, // 區塊大小警告閾值
    
    // Rollup 打包選項物件
    rollupOptions: {
      output: {
        // manualChunks 物件 - 手動分割代碼塊的策略
        manualChunks: {
          // 使用物件方法定義分組，每個鍵對應一個代碼塊
          // 值為陣列，包含要包含在該塊中的模組
          vendor: ['react', 'react-dom'], // React 核心庫
          router: ['react-router-dom'], // 路由相關庫
          ui: ['lucide-react', 'class-variance-authority', 'clsx'], // UI 相關庫
        },
      },
    },
  },
});