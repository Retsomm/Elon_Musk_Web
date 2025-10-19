# GitHub Actions 自動化部署設定指南

## 概述

此 GitHub Actions 工作流程會在以下情況自動觸發：

- 推送程式碼到 `main` 或 `master` 分支時：部署到 Firebase Hosting 生產環境
- 創建 Pull Request 時：部署到 Firebase Hosting 預覽環境

## 必要的 GitHub Secrets 設定

在您的 GitHub Repository 中，您需要設定以下 Secrets：

### 1. FIREBASE_SERVICE_ACCOUNT

Firebase 服務帳戶金鑰（JSON 格式）

**取得步驟：**

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇您的專案
3. 點擊左側選單的「專案設定」
4. 切換到「服務帳戶」標籤
5. 點擊「產生新的私密金鑰」
6. 下載 JSON 檔案
7. 打開下載的 JSON 檔案，複製整個檔案內容
8. 在 GitHub Repository 設定中創建名為 `FIREBASE_SERVICE_ACCOUNT` 的 Secret
9. 將複製的 JSON 內容貼上到 Secret 的值欄位中

### 2. FIREBASE_PROJECT_ID

您的 Firebase 專案 ID：`vite-react-elon-5dae6`

**取得步驟：**

1. 在 Firebase Console 的專案設定頁面
2. 在「一般」標籤中找到「專案 ID」
3. 複製專案 ID
4. 在 GitHub Repository 設定中創建名為 `FIREBASE_PROJECT_ID` 的 Secret
5. 將專案 ID 貼上到 Secret 的值欄位中

### 3. 環境變數 Secrets（用於建置時）

由於您的專案使用了環境變數，還需要添加以下 Secrets：

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_SITE_KEY`
- `VITE_SECRET_KEY`

## 如何設定 GitHub Secrets

1. 前往您的 GitHub Repository
2. 點擊「Settings」標籤
3. 在左側選單中選擇「Secrets and variables」> 「Actions」
4. 點擊「New repository secret」
5. 依序添加以下 Secrets：

### 必需的部署 Secrets：

- **Name**: `FIREBASE_SERVICE_ACCOUNT` **Secret**: Firebase 服務帳戶 JSON 內容
- **Name**: `FIREBASE_PROJECT_ID` **Secret**: `vite-react-elon-5dae6`

### 環境變數 Secrets（從您的 .env 檔案）：

- **Name**: `VITE_FIREBASE_API_KEY` **Secret**: `AIzaSyBlnjfYv7p-CS7PfP92OzB-AJhExAUAcaU`
- **Name**: `VITE_FIREBASE_AUTH_DOMAIN` **Secret**: `vite-react-elon-5dae6.firebaseapp.com`
- **Name**: `VITE_FIREBASE_STORAGE_BUCKET` **Secret**: `vite-react-elon-5dae6.firebasestorage.app`
- **Name**: `VITE_FIREBASE_MESSAGING_SENDER_ID` **Secret**: `1028257072356`
- **Name**: `VITE_FIREBASE_APP_ID` **Secret**: `1:1028257072356:web:a58c082ce696aaf1bfd8f1`
- **Name**: `VITE_FIREBASE_MEASUREMENT_ID` **Secret**: `G-QLHK3RFQ0J`
- **Name**: `VITE_SITE_KEY` **Secret**: `0x4AAAAAABeIgNRKsFCYbr5P`
- **Name**: `VITE_SECRET_KEY` **Secret**: `0x4AAAAAABeIgERU7keQtFu1_2zBy62xJ-s`

### 重要提醒

- 總共需要設定 **10 個 Secrets**
- Secret 名稱必須完全符合上述列表
- 建議先設定部署相關的 2 個 Secrets，再設定環境變數

## Firebase CLI 本地設定（可選）

如果您想在本地測試部署，可以安裝 Firebase CLI：

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

## 工作流程說明

### 觸發條件

- **生產部署**：推送到 main/master 分支
- **預覽部署**：創建 Pull Request

### 執行步驟

1. 檢出程式碼
2. 設定 Node.js 環境（版本 18）
3. 快取 node_modules 以加速建置
4. 安裝相依套件
5. 執行 ESLint 檢查（失敗時不會中斷流程）
6. 建置專案
7. 上傳建置檔案作為 artifact
8. 部署到 Firebase Hosting

### 建置產物

建置完成的檔案會儲存在 `dist/` 資料夾中，並上傳為 GitHub Actions artifact。

## 故障排除

### 常見錯誤

1. **FIREBASE_SERVICE_ACCOUNT 無效**

   - 確認 JSON 格式正確
   - 確認服務帳戶有足夠權限

2. **FIREBASE_PROJECT_ID 錯誤**

   - 確認專案 ID 正確
   - 確認專案存在且可存取

3. **建置失敗**
   - 檢查 package.json 中的 build script
   - 確認所有相依套件都已安裝

### 檢查日誌

在 GitHub Repository 的「Actions」標籤中可以查看詳細的執行日誌。

## 進階設定

### 自訂部署分支

如果您想要從其他分支部署，請修改 `.github/workflows/deploy.yml` 中的分支設定：

```yaml
on:
  push:
    branches:
      - main
      - develop # 添加其他分支
```

### 環境變數

如果您的專案需要環境變數，可以在工作流程中添加：

```yaml
env:
  REACT_APP_API_URL: ${{ secrets.API_URL }}
  NODE_ENV: production
```
