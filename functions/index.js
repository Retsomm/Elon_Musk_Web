import { onRequest } from "firebase-functions/v2/https";
import { config } from "firebase-functions";
import axios from "axios";
import cors from "cors";

const corsHandler = cors({ origin: true });

// ✅ 搜尋關鍵字
const searchQueries = ["Elon Musk", "Tesla", "SpaceX", "馬斯克"];

export const getNews = onRequest({
  region: "asia-east1",
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
            apiKey: config().newsapi.key // 使用 Firebase config
          },
          timeout: 10000
        });

        const articles = response.data.articles.map((item) => ({
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
