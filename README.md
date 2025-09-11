# Elon Musk World (EMW)

一個介紹伊隆·馬斯克（Elon Musk）及其相關公司、新聞、書籍、影片與 Podcast 的互動式網站。

## 🚀 特色功能

- 📅 馬斯克生平大事年表互動展示
- 🏢 旗下公司詳細介紹（SpaceX、Tesla、X Corp、The Boring Company、Neuralink、Grok）
- 📰 最新新聞自動抓取與智能快取
- 📚 書籍、YouTube、Podcast 精選與個人收藏
- 👤 完整會員系統（Email/Google OAuth 註冊登入）
- 💬 互動留言板與社群功能
- 📱 響應式設計，支援各種裝置

## 🛠 技術棧

### 前端

- **React 18** + **Vite** - 現代化前端開發框架
- **Tailwind CSS** + **DaisyUI** - 原子化 CSS 框架與 UI 元件庫
- **React Router DOM** - 單頁應用路由管理
- **SWR** - 資料獲取與快取
- **Zustand** - 輕量級狀態管理

### 後端與服務

- **Firebase Authentication** - 身份驗證服務
- **Firebase Realtime Database** - 即時資料庫
- **Firebase Hosting** - 靜態網站部署
- **Firebase Cloud Functions** - 伺服器端邏輯
- **NewsAPI** - 新聞資料來源

### 開發工具

- **ESLint** - 程式碼品質檢查
- **PostCSS** - CSS 後處理器
- **Vite** - 快速建置工具
- **GitHub Actions** - CI/CD 自動化部署

## 📁 實際專案架構

```
EMW-main/
├── 📁 src/                          # 主要原始碼目錄
│   ├── 📁 component/                # 可重用元件
│   │   ├── 📄 Layout.jsx           # 主要版面配置
│   │   ├── 📄 DesktopNavbar.jsx    # 桌面版導航列
│   │   ├── 📄 MobileNavbar.jsx     # 手機版導航列
│   │   ├── 📄 Footer.jsx           # 網站頁尾
│   │   ├── 📄 MessageBoard.jsx     # 留言板元件
│   │   ├── 📄 Timeline.jsx         # 時間軸元件
│   │   ├── 📄 ToTop.jsx            # 回到頂部按鈕
│   │   ├── 📄 Toast.jsx            # 提示訊息元件
│   │   ├── 📄 FavoriteButton.jsx   # 收藏按鈕元件
│   │   ├── 📄 CollectList.jsx      # 收藏清單元件
│   │   ├── 📄 Nebula.jsx           # 星雲動畫背景
│   │   ├── 📄 MediaModal.jsx       # 媒體彈出視窗
│   │   └── 📄 ErrorBoundary.jsx    # 錯誤邊界元件
│   │
│   ├── 📁 pages/                    # 主要頁面元件
│   │   ├── 📄 Home.jsx             # 首頁
│   │   ├── 📄 Life.jsx             # 生平時間軸頁面
│   │   ├── 📄 Company.jsx          # 公司總覽頁面
│   │   ├── 📄 CompanyItem.jsx      # 個別公司詳情頁面
│   │   ├── 📄 News.jsx             # 新聞中心頁面
│   │   ├── 📄 Info.jsx             # 媒體資源總覽頁面
│   │   ├── 📄 InfoItem.jsx         # 個別媒體詳情頁面
│   │   └── 📄 Member.jsx           # 會員中心頁面
│   │
│   ├── 📁 data/                     # 靜態數據文件
│   │   ├── 📄 books.json           # 書籍數據
│   │   ├── 📄 companies.json       # 公司資訊數據
│   │   ├── 📄 events.json          # 生平事件數據
│   │   ├── 📄 youtubes.json        # YouTube 影片數據
│   │   └── 📄 podcasts.json        # Podcast 數據
│   │
│   ├── 📁 store/                    # Zustand 狀態管理
│   │   ├── 📄 authStore.js         # 身份驗證狀態
│   │   ├── 📄 toastStore.js        # 提示訊息狀態
│   │   └── 📄 collectStore.js      # 收藏功能狀態
│   │
│   ├── 📁 utils/                    # 工具函數
│   │   ├── 📄 authHandlers.js      # 身份驗證處理
│   │   └── 📄 firebase.js          # Firebase 設定與初始化
│   │
│   ├── 📄 App.jsx                  # 主應用程式元件
│   ├── 📄 main.jsx                 # 應用程式入口點
│   └── 📄 index.css                # 主要樣式文件
│
├── 📁 functions/                    # Firebase Cloud Functions
│   ├── 📄 index.js                 # Functions 入口點（新聞抓取 API）
│   ├── 📄 package.json             # Functions 依賴
│   ├── 📄 .env                     # Functions 環境變數
│   ├── 📄 .eslintrc.js             # Functions ESLint 設定
│   └── 📄 .gitignore               # Functions Git 忽略設定
│
├── 📁 public/                       # 靜態資源目錄
│   ├── 📄 index.html               # HTML 入口模板
│   ├── 📄 avatar.webp              # 預設頭像
│   ├── 📄 banner.webp              # 網站橫幅
│   ├── 📄 favicon.ico              # 網站圖標
│   ├── 📄 robots.txt               # 搜尋引擎爬蟲設定
│   ├── 📄 sitemap.xml              # 網站地圖
│   └── 📄 ...                      # 其他靜態圖片資源
│
├── 📁 .github/workflows/            # GitHub Actions 工作流程
│   └── 📄 deploy.yml               # 自動化部署設定
│
├── 📁 .firebase/                    # Firebase 部署快取
│   └── 📄 hosting.*.cache          # 部署快取文件
│
├── 📄 .env                         # 環境變數
├── 📄 .firebaserc                  # Firebase 專案設定
├── 📄 .gitignore                   # Git 忽略檔案設定
├── 📄 components.json              # shadcn/ui 元件設定
├── 📄 eslint.config.js             # ESLint 程式碼檢查設定
├── 📄 firebase.json                # Firebase 部署設定
├── 📄 postcss.config.js            # PostCSS 設定
├── 📄 tailwind.config.js           # Tailwind CSS 設定
├── 📄 vite.config.js               # Vite 建置工具設定
├── 📄 package.json                 # 專案依賴與腳本
├── 📄 README.md                    # 專案說明文件
└── 📄 DEPLOY_README.md             # 部署指南文件
```

## 🏗️ 架構說明

### 前端架構

- **組件化設計**：將 UI 拆分為可重用的 React 元件
- **頁面路由**：使用 React Router 管理單頁應用路由
- **狀態管理**：使用 Zustand 管理全域狀態（身份驗證、收藏、提示訊息）
- **資料獲取**：使用 SWR 進行伺服器狀態管理與快取

### 資料流架構

```
用戶操作 → React 元件 → Zustand Store → Firebase API → 資料回傳
```

### 新聞系統架構

```
NewsAPI → Firebase Functions → SWR 快取 → React 元件顯示
```

### 身份驗證架構

```
Firebase Auth → authStore (Zustand) → React 元件 → 頁面存取控制
```

### 收藏系統架構

```
用戶操作 → collectStore (Zustand) → LocalStorage → 持久化儲存
```

## 📱 主要功能頁面

### 首頁 ([`src/pages/Home.jsx`](src/pages/Home.jsx))
- 網站功能導覽
- 各主要區塊入口

### 生平時間軸 ([`src/pages/Life.jsx`](src/pages/Life.jsx))
- 馬斯克生平重要事件展示
- 互動式時間軸介面
- 媒體檢視功能

### 公司介紹 ([`src/pages/Company.jsx`](src/pages/Company.jsx), [`src/pages/CompanyItem.jsx`](src/pages/CompanyItem.jsx))
- 馬斯克旗下公司總覽
- 個別公司詳細資訊
- 響應式卡片設計

### 新聞中心 ([`src/pages/News.jsx`](src/pages/News.jsx))
- 即時新聞抓取
- 智能快取機制
- 相關性評分

### 媒體資源 ([`src/pages/Info.jsx`](src/pages/Info.jsx), [`src/pages/InfoItem.jsx`](src/pages/InfoItem.jsx))
- 書籍、YouTube、Podcast 資源
- 分類篩選功能
- 個人收藏系統

### 會員中心 ([`src/pages/Member.jsx`](src/pages/Member.jsx))
- 個人資料管理
- 收藏清單檢視
- 留言板功能

## 🔧 關鍵元件說明

### 留言板 ([`src/component/MessageBoard.jsx`](src/component/MessageBoard.jsx))
- Firebase Realtime Database 即時同步
- 使用者身份驗證整合
- 訊息驗證與字數限制

### 時間軸 ([`src/component/Timeline.jsx`](src/component/Timeline.jsx))
- 可重用的時間軸展示元件
- 支援媒體內容顯示
- 點擊事件處理

### 收藏功能 ([`src/component/FavoriteButton.jsx`](src/component/FavoriteButton.jsx))
- LocalStorage 持久化儲存
- Zustand 狀態管理
- 即時 UI 更新

### 錯誤邊界 ([`src/component/ErrorBoundary.jsx`](src/component/ErrorBoundary.jsx))
- 全域錯誤捕獲
- 動態模組載入錯誤處理
- 自動重新載入機制

## 🌐 部署資訊

- **生產環境**：Firebase Hosting
- **CI/CD**：GitHub Actions 自動化部署
- **網域**：https://vite-react-elon-5dae6.web.app
- **部署指南**：詳見 [`DEPLOY_README.md`](DEPLOY_README.md)

## 🔑 環境變數

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_SITE_KEY=your_site_key
VITE_SECRET_KEY=your_secret_key
```

## 🚀 快速開始

1. **克隆專案**
```bash
git clone https://github.com/your-username/EMW-main.git
cd EMW-main
```

2. **安裝依賴**
```bash
npm install
```

3. **設定環境變數**
```bash
cp .env.example .env
# 編輯 .env 文件並填入您的 Firebase 配置
```

4. **啟動開發伺服器**
```bash
npm run dev
```

5. **建置生產版本**
```bash
npm run build
```

## 📋 可用指令

- `npm run dev` - 啟動開發伺服器
- `npm run build` - 建置生產版本
- `npm run preview` - 預覽建置結果
- `npm run lint` - 執行 ESLint 檢查
