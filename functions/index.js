import { onCall, HttpsError } from "firebase-functions/v2/https";
import axios from "axios";
import { parseStringPromise } from "xml2js";

export const newsApi = onCall(
  { 
    timeoutSeconds: 60,
    memory: "256MiB"
  },
  async () => {
    const searchQueries = ["Elon Musk", "Tesla", "SpaceX"]; // 多個搜尋關鍵字備援
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
    ];
    
    for (let queryIndex = 0; queryIndex < searchQueries.length; queryIndex++) {
      for (let uaIndex = 0; uaIndex < userAgents.length; uaIndex++) {
        try {
          console.log(`嘗試搜尋: ${searchQueries[queryIndex]}, UA: ${uaIndex + 1}`);
          
          const response = await axios.get("https://news.google.com/rss/search", {
            params: { 
              q: searchQueries[queryIndex],
              hl: "zh-TW", // 指定語言
              gl: "TW",    // 指定地區
              ceid: "TW:zh-Hant" // 台灣繁體中文
            },
            headers: { 
              "User-Agent": userAgents[uaIndex],
              "Accept": "application/rss+xml, application/xml, text/xml, */*",
              "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
              "Cache-Control": "no-cache"
            },
            timeout: 20000
          });

          if (!response.data || response.data.length < 100) {
            throw new Error("回應資料異常");
          }

          const result = await parseStringPromise(response.data);
          const rawItems = result?.rss?.channel?.[0]?.item || [];
          
          if (rawItems.length === 0) {
            throw new Error("沒有找到新聞項目");
          }

          const articles = rawItems.slice(0, 10).map((item) => ({
            title: item.title?.[0]?.replace(/ - .*$/, "") || "無標題",
            source: item.description?.[0]?.match(/<font color="#6f6f6f">(.*?)<\/font>/)?.[1] || "未知來源",
            link: item.link?.[0] || "",
            description: item.description?.[0]?.replace(/<[^>]*>/g, "") || "",
            pubDate: item.pubDate?.[0] || "未知日期",
          }));

          console.log(`成功取得 ${articles.length} 則新聞`);
          return { 
            articles,
            source: searchQueries[queryIndex],
            timestamp: new Date().toISOString()
          };
          
        } catch (error) {
          console.error(`搜尋 ${searchQueries[queryIndex]} 失敗:`, error.message);
          // 繼續嘗試下一個
        }
      }
    }
    
    // 所有嘗試都失敗了
    throw new HttpsError("unavailable", "目前無法取得新聞資料，請稍後再試");
  }
);