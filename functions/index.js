import { https } from "firebase-functions";
import axios from "axios";
import cors from "cors";
import { parseStringPromise } from "xml2js";

const corsHandler = cors({ origin: true }); // 允許所有來源

export const getNews = https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    const searchQueries = ["Elon Musk", "Tesla", "SpaceX"];
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
              hl: "zh-TW",
              gl: "TW",
              ceid: "TW:zh-Hant"
            },
            headers: {
              "User-Agent": userAgents[uaIndex],
              "Accept": "application/rss+xml, application/xml, text/xml, */*",
              "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8",
              "Cache-Control": "no-cache"
            },
            timeout: 20000
          });

          const result = await parseStringPromise(response.data);
          const rawItems = result?.rss?.channel?.[0]?.item || [];

          if (rawItems.length === 0) throw new Error("沒有找到新聞項目");

          const articles = rawItems.slice(0, 10).map((item) => ({
            title: item.title?.[0]?.replace(/ - .*$/, "") || "無標題",
            source: item.description?.[0]?.match(/<font color="#6f6f6f">(.*?)<\/font>/)?.[1] || "未知來源",
            link: item.link?.[0] || "",
            description: item.description?.[0]?.replace(/<[^>]*>/g, "") || "",
            pubDate: item.pubDate?.[0] || "未知日期",
          }));

          return res.status(200).json({
            articles,
            source: searchQueries[queryIndex],
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          console.error(`搜尋 ${searchQueries[queryIndex]} 失敗:`, error.message);
        }
      }
    }

    return res.status(500).json({
      error: "目前無法取得新聞資料，請稍後再試"
    });
  });
});