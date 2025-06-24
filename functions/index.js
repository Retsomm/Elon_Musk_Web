import { onCall, HttpsError } from "firebase-functions/v2/https";
import axios from "axios";
import { parseStringPromise } from "xml2js";

// 保持函數名稱為 newsApi，但使用 onCall
export const newsApi = onCall(
  { 
    timeoutSeconds: 60,  // 增加超時時間
    memory: "256MiB"     // 增加記憶體配置
  },
  async () => {
    try {
      const response = await axios.get("https://news.google.com/rss/search", {
        params: { q: "Elon Musk" },
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const result = await parseStringPromise(response.data);
      const rawItems = result?.rss?.channel?.[0]?.item || [];

      const articles = rawItems.slice(0, 10).map((item) => ({
        title: item.title?.[0]?.replace(/ - .*$/, "") || "無標題",
        source: item.description?.[0]?.match(/<font color="#6f6f6f">(.*?)<\/font>/)?.[1] || "未知來源",
        link: item.link?.[0] || "",
        description: item.description?.[0]?.replace(/<[^>]*>/g, "") || "",
        pubDate: item.pubDate?.[0] || "未知日期",
      }));

      return { articles };
    } catch (error) {
      console.error("抓取新聞失敗:", error.message);
      throw new HttpsError("internal", "伺服器錯誤，請稍後再試。");
    }
  }
);

// 如果你需要一個額外的 HTTP API，可以創建一個新的函數名稱
export const newsApiHttp = onCall(
  { 
    timeoutSeconds: 60  // 增加超時時間
  },
  async () => {
    // 使用與上面相同的邏輯，或根據需要修改
    // 這是一個範例，實際上可以完全移除這個函數
    try {
      const response = await axios.get("https://news.google.com/rss/search", {
        params: { q: "Elon Musk" },
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const result = await parseStringPromise(response.data);
      const rawItems = result?.rss?.channel?.[0]?.item || [];

      const articles = rawItems.slice(0, 10).map((item) => ({
        title: item.title?.[0]?.replace(/ - .*$/, "") || "無標題",
        source: item.description?.[0]?.match(/<font color="#6f6f6f">(.*?)<\/font>/)?.[1] || "未知來源",
        link: item.link?.[0] || "",
        description: item.description?.[0]?.replace(/<[^>]*>/g, "") || "",
        pubDate: item.pubDate?.[0] || "未知日期",
      }));

      return { articles };
    } catch (error) {
      console.error("抓取新聞失敗:", error.message);
      throw new Error("伺服器錯誤，請稍後再試。");
    }
  }
);