import { useState, useEffect } from "react";
import { functions, httpsCallable } from "../firebase";

type Article = {
  title: string;
  source: string;
  pubDate: string;
  link: string;
};
// 取得台灣當天日期字串 (yyyy-mm-dd)
function getTaiwanDateString() {
  const now = new Date();
  // 轉換為 UTC+8
  now.setHours(now.getHours() + 8 - now.getTimezoneOffset() / 60);
  return now.toISOString().slice(0, 10);
}
export default function News() {
  const [news, setNews] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      const today = getTaiwanDateString();
      const cacheKey = "newsCache";
      const cache = localStorage.getItem(cacheKey);

      // 先載入快取資料（如果有的話）
      let cachedArticles: Article[] = [];
      if (cache) {
        try {
          const { date, articles } = JSON.parse(cache) as {
            date: string;
            articles: Article[];
          };
          if (date === today && Array.isArray(articles)) {
            setNews(articles);
            setIsLoading(false);
            return;
          }
          // 即使是舊的快取，也先顯示，避免完全沒有內容
          if (Array.isArray(articles) && articles.length > 0) {
            cachedArticles = articles;
            setNews(articles);
            setIsLoading(false);
          }
        } catch (e) {
          console.log("快取解析錯誤");
        }
      }

      // 嘗試抓取新資料（有重試機制）
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          console.log(`嘗試抓取新聞 (第 ${retryCount + 1} 次)`);
          setIsLoading(cachedArticles.length === 0); // 如果有快取就不顯示載入中

          const getNews = httpsCallable(functions, "newsApi");
          const result = await getNews();
          const articles =
            (result.data as { articles: Article[] }).articles || [];

          if (articles.length > 0) {
            setNews(articles);
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ date: today, articles })
            );
            setError(null);
            setIsLoading(false);
            return; // 成功就結束
          } else {
            throw new Error("沒有取得新聞資料");
          }
        } catch (err) {
          console.error(`第 ${retryCount + 1} 次抓取失敗:`, err);
          retryCount++;

          if (retryCount < maxRetries) {
            // 等待後重試（每次等待時間遞增）
            await new Promise((resolve) =>
              setTimeout(resolve, 2000 * retryCount)
            );
          }
        }
      }

      // 所有重試都失敗了
      if (cachedArticles.length > 0) {
        // 如果有舊的快取資料，繼續顯示並提示使用者
        setError("無法取得最新新聞，顯示先前的新聞內容");
      } else {
        // 完全沒有資料
        setNews([]);
        setError("伺服器錯誤，請稍後再試或重新整理頁面");
      }
      setIsLoading(false);
    }

    fetchNews();
  }, []);
  const retryFetchNews = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const getNews = httpsCallable(functions, "newsApi");
      const result = await getNews();
      const articles = (result.data as { articles: Article[] }).articles || [];
      setNews(articles);

      const today = getTaiwanDateString();
      localStorage.setItem(
        "newsCache",
        JSON.stringify({ date: today, articles })
      );
    } catch (err) {
      console.error("重新抓取失敗:", err);
      setError("重新載入失敗，請稍後再試");
    }
    setIsLoading(false);
  };
  if (error) {
    return (
      <div className="text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          className="btn btn-primary"
          onClick={retryFetchNews}
          disabled={isLoading}
        >
          {isLoading ? "載入中..." : "重新載入"}
        </button>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="newsContainer flex flex-wrap justify-center">
          {[...Array(10)].map((_, index) => (
            <div
              className="newsCard p-4 m-4 w-80 bg-base-100 rounded-xl shadow-md"
              key={`skeleton-${index}`}
            >
              <div className="skeleton h-6 w-full mb-3"></div> {/* 標題 */}
              <div className="skeleton h-6 w-3/4 mb-3"></div> {/* 來源 */}
              <div className="skeleton h-4 w-1/2 mb-3"></div> {/* 日期 */}
              <div className="skeleton h-8 w-24 mt-3"></div> {/* 按鈕 */}
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <p className="text-center">目前沒有新聞</p>
      ) : (
        <div className="newsContainer flex flex-wrap justify-center">
          {news.map((article) => (
            <div
              className="newsCard p-4 m-4 w-80 rounded-xl shadow-md"
              key={article.link}
            >
              <h3 className="font-bold text-lg mb-2 leading-loose">
                標題：{article.title}
              </h3>
              <h3 className="text-base mb-2 leading-loose">
                來源：{article.source}
              </h3>
              <p className="text-sm mb-3 leading-loose">
                發布日期：{new Date(article.pubDate).toLocaleString()}
              </p>
              <div className="tooltip tooltip-right" data-tip="前往外部網站">
                <a
                  className="btn btn-primary w-fit mt-3"
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  閱讀更多
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
