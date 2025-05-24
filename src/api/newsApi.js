// 引入 Express.js 套件，用來建立網頁伺服器
import express from 'express';
// 引入 Axios 套件，用來從網路上抓取資料（像是發送 HTTP 請求）
import axios from 'axios';
// 引入 xml2js 的 parseStringPromise 函數，用來將 XML 資料（像是 RSS 饋源）轉成 JSON 格式
import { parseStringPromise } from 'xml2js';

// 建立一個 Express 應用程式（我們的網頁伺服器）
const app = express();

// 定義一個路由，當使用者訪問 '/newsApi' 時，處理 GET 請求
app.get('/newsApi', async (req, res) => {
  // 使用 try-catch 來安全處理可能的錯誤
  try {
    // 從 Google News 的 RSS 饋源抓取關於「Elon Musk」的新聞
    const response = await axios.get('https://news.google.com/rss/search', {
      // 設定查詢參數 'q'，搜尋「Elon Musk」
      params: { q: 'Elon Musk' },
      // 設定 User-Agent 標頭，模擬瀏覽器請求（有些網站需要這個）
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    // 將抓到的 XML 資料（RSS 饋源）轉換成 JavaScript 物件（JSON 格式）
    const result = await parseStringPromise(response.data);
    // 從 RSS 饋源中取出新聞項目，如果沒有則返回空陣列
    const rawItems = result?.rss?.channel?.[0]?.item || [];

    // 處理前 10 則新聞，整理成乾淨的文章列表
    const articles = rawItems.slice(0, 10).map((item) => {
      // 取得新聞描述，若無則設為空字串
      const description = item.description?.[0] || '';
      // 使用正則表達式找出新聞來源（例如「CNN」或「BBC」）
      const sourceMatch = description.match(/<font color="#6f6f6f">(.*?)<\/font>/);
      // 如果有來源就使用，否則設為「未知來源」
      const source = sourceMatch ? sourceMatch[1] : '未知來源';

      // 清理標題，移除來源部分（例如「 - CNN」）
      const title = item.title?.[0]?.replace(/ - .*$/, '') || '無標題';

      // 返回整理好的文章物件
      return {
        title, // 清理後的標題（不含來源）
        source, // 新聞來源（例如 CNN）
        link: item.link?.[0] || '', // 完整文章的網址
        description: description.replace(/<[^>]*>/g, ''), // 移除描述中的 HTML 標籤
        pubDate: item.pubDate?.[0] || '未知日期', // 新聞的發布日期
      };
    });

    // 將整理好的文章列表以 JSON 格式回傳給客戶端
    res.json(articles);
  } catch (error) {
    // 如果發生錯誤，將錯誤訊息記錄到控制台
    console.error('抓取新聞失敗:', error);
    // 回傳 500 狀態碼（伺服器錯誤）並附上錯誤訊息
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

// 啟動伺服器，監聽在 3000 端口
app.listen(3000, () => {
  // 當伺服器啟動時，在控制台顯示訊息
  console.log('伺服器運行在 http://localhost:3000');
});