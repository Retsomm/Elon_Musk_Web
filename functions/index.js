import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import cors from "cors";
//負責「抓取、整理、回傳」新聞資料
const corsHandler = cors({ origin: true });

const searchQueries = [
  '"Elon Musk" OR 馬斯克 OR Tesla OR SpaceX'
];

export const getNews = onRequest({
  region: "us-central1",
  memory: "1GiB",
  timeoutSeconds: 60,
  maxInstances: 10
}, (req, res) => {
  return corsHandler(req, res, async () => {

    const fetchNewsFromNewsAPI = async (query) => {
      try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: query,
            language: "zh", // 優先中文新聞，如果沒有會自動補英文
            sortBy: "publishedAt",
            pageSize: 10,
            apiKey: process.env.NEWS_API_KEY // 使用環境變數
          },
          timeout: 10000
        });

         // 只保留標題或描述有 "Elon Musk" 或 "馬斯克"
    const articles = response.data.articles
      .filter(item =>
        /Elon Musk|馬斯克/i.test(item.title + item.description)
      )
      .map((item) => ({
        title: item.title || "無標題",
        source: item.source?.name || "未知來源",
        link: item.url || "",
        description: item.description || "",
        pubDate: item.publishedAt || "未知時間",
        query
      }));

        return articles;
      } catch (error) {
        console.error(`搜尋 "${query}" 失敗:`, error.message);
        return [];
      }
    };

    try {
      const allResults = [];

      for (const keyword of searchQueries) {
        const results = await fetchNewsFromNewsAPI(keyword);
        allResults.push(...results);

        // 加入一點延遲避免 API 過快觸發限制
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // 整理結果：去除重複、依照時間排序
      const seenTitles = new Set();
      const uniqueArticles = allResults.filter(article => {
        if (seenTitles.has(article.title)) return false;
        seenTitles.add(article.title);
        return true;
      });

      const sorted = uniqueArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      res.status(200).json({
        articles: sorted.slice(0, 15), // 限制最多 15 篇
        timestamp: new Date().toISOString(),
        totalFound: sorted.length
      });

    } catch (err) {
      console.error("獲取新聞失敗:", err);
      res.status(500).json({
        error: "伺服器錯誤，請稍後再試",
        timestamp: new Date().toISOString()
      });
    }
  });
});
