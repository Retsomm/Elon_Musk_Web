import { useState, useEffect } from "react";
import { functions, httpsCallable } from "../firebase";
// 取得台灣當天日期字串 (yyyy-mm-dd)
function getTaiwanDateString() {
  const now = new Date();
  // 轉換為 UTC+8
  now.setHours(now.getHours() + 8 - now.getTimezoneOffset() / 60);
  return now.toISOString().slice(0, 10);
}
export default function News() {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchNews() {
      const today = getTaiwanDateString();
      const cacheKey = "newsCache";
      const cache = localStorage.getItem(cacheKey);
      if (cache) {
        try {
          const { date, articles } = JSON.parse(cache);
          if (date === today && Array.isArray(articles)) {
            setNews(articles);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          // 快取格式錯誤，忽略
        }
      }
      try {
        const getNews = httpsCallable(functions, "newsApi");
        const result = await getNews();
        const articles = result.data.articles || [];
        setNews(articles);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ date: today, articles })
        );
        setIsLoading(false);
      } catch (err) {
        console.error("抓取新聞失敗:", err);
        setNews([]);
        setError("伺服器錯誤，請稍後再試");
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (error) return <div className="text-red-500 text-center">{error}</div>;

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
              className="newsCard p-4 m-4 w-80 rounded-xl shadow-md leading-loose"
              key={article.link}
            >
              <h3 className="font-bold text-lg mb-2">標題：{article.title}</h3>
              <h3 className="text-base mb-2">來源：{article.source}</h3>
              <p className="text-sm mb-3">
                發布日期：{new Date(article.pubDate).toLocaleString()}
              </p>
              <a
                className="btn btn-primary w-fit mt-3"
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                閱讀更多
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
