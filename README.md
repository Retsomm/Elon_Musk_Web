# Elon Musk World (EMW)

一個介紹伊隆·馬斯克（Elon Musk）及其相關公司、新聞、書籍、影片與 Podcast 的互動式網站。

## 特色

- 馬斯克生平大事年表互動展示
- 旗下公司（SpaceX、Tesla、X Corp、The Boring Company、Neuralink、Grok）介紹與產品列表
- 最新新聞自動抓取與快取
- 馬斯克語錄隨機顯示
- 書籍、YouTube、Podcast 精選與收藏功能
- 會員系統（Email/Google 註冊登入）、個人收藏、留言板
- 支援主題切換（淺色/深色）

## 技術棧

- React 18 + Vite
- Firebase Auth & Realtime Database
- Tailwind CSS + DaisyUI
- Express.js (API/Cloud Functions)
- 部署於 Firebase Hosting

## 專案結構

```
├── src/
│   ├── component/         # 共用元件、資料
│   ├── pages/             # 各主頁面
│   ├── contexts/          # React Context
│   └── api/               # API 相關
├── public/                # 靜態資源
├── functions/             # Firebase Functions (Node.js)
├── hooks/                 # React hooks
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 本地開發

1. 安裝依賴
   ```sh
   npm install
   ```
2. 啟動本地伺服器
   ```sh
   npm run dev
   ```
3. 開啟 [http://localhost:5173](http://localhost:5173)

## Firebase 設定

- 請於 `.env` 設定你的 Firebase 專案資訊
- functions 目錄下可部署雲端函數

## 其他指令

- `npm run build`：打包生產環境
- `npm run lint`：程式碼檢查

---

本專案僅供學習與展示用途，無商業行為。
