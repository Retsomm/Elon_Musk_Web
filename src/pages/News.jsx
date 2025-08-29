import useSWR from "swr";

/**
 * 負責「顯示、快取、重試」新聞資料
 * 使用 SWR 優化 API 請求和快取機制
 */

/**
 * 取得台灣當天日期字串 (yyyy-mm-dd)
 */
function getTaiwanDateString() {
  const now = new Date();
  now.setHours(now.getHours() + 8 - now.getTimezoneOffset() / 60);
  return now.toISOString().slice(0, 10);
}

/**
 * SWR fetcher 函數
 * @param {string} url - API 端點
 * @returns {Promise} API 回應資料
 */
const fetcher = async (url) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超時

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Cache-Control": "default",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    const articles = result.articles || [];

    if (articles.length === 0) {
      throw new Error("API 回應中沒有新聞資料");
    }

    return {
      articles,
      timestamp: new Date().toISOString(),
      date: getTaiwanDateString(),
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export default function News() {
  const API_URL =
    "https://us-central1-vite-react-elon-5dae6.cloudfunctions.net/getNews";

  // 使用 SWR 進行數據獲取
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    API_URL,
    fetcher,
    {
      // SWR 配置選項
      revalidateOnFocus: false, // 視窗聚焦時不自動重新驗證
      revalidateOnReconnect: true, // 網路重連時重新驗證
      refreshInterval: 0, // 關閉自動刷新
      errorRetryCount: 3, // 錯誤重試次數
      errorRetryInterval: 2000, // 重試間隔 (毫秒)
      dedupingInterval: 5 * 60 * 1000, // 5分鐘內相同請求去重
      // 快取策略：優先返回快取，然後在背景重新驗證
      fallbackData: (() => {
        // 嘗試從 localStorage 讀取快取
        try {
          const cache = localStorage.getItem("newsCache");
          if (cache) {
            const parsed = JSON.parse(cache);
            const today = getTaiwanDateString();

            // 如果是今天的快取，直接使用
            if (
              parsed.date === today &&
              Array.isArray(parsed.articles) &&
              parsed.articles.length > 0
            ) {
              console.log(
                "使用 localStorage 快取資料:",
                parsed.articles.length,
                "篇新聞"
              );
              return parsed;
            }

            // 舊快取也可以作為 fallback
            if (Array.isArray(parsed.articles) && parsed.articles.length > 0) {
              console.log(
                "使用舊的 localStorage 快取資料:",
                parsed.articles.length,
                "篇新聞"
              );
              return parsed;
            }
          }
        } catch (e) {
          console.warn("讀取快取失敗:", e);
          localStorage.removeItem("newsCache");
        }
        return null;
      })(),
      // 成功回調：儲存到 localStorage
      onSuccess: (data) => {
        if (data && data.articles) {
          try {
            localStorage.setItem("newsCache", JSON.stringify(data));
            console.log(`新聞資料已更新並快取，共 ${data.articles.length} 篇`);
          } catch (e) {
            console.warn("儲存快取失敗:", e);
          }
        }
      },
      // 錯誤回調
      onError: (error) => {
        console.error("SWR 錯誤:", error.message);
      },
    }
  );

  /**
   * 手動重新抓取新聞
   * 使用 SWR 的 mutate 函數強制重新驗證
   */
  const retryFetchNews = async () => {
    console.log("用戶觸發手動重新抓取");
    try {
      // 強制重新驗證，不使用快取
      await mutate(undefined, { revalidate: true });
    } catch (err) {
      console.error("手動重新抓取失敗:", err);
    }
  };

  // 從 data 中提取新聞資料
  const news = data?.articles || [];
  const lastUpdated = data?.timestamp;

  // 錯誤狀態 UI
  if (error && news.length === 0) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4 text-lg">
          載入失敗，請檢查網路連線後重試 (錯誤: {error.message})
        </div>
        <button
          className="btn btn-primary"
          onClick={retryFetchNews}
          disabled={isLoading || isValidating}
        >
          {isLoading || isValidating ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              重新載入中...
            </>
          ) : (
            "重新載入"
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 控制面板 */}
      <div className="text-center mb-6 p-4 rounded-lg">
        <button
          className="btn btn-secondary mb-3"
          onClick={retryFetchNews}
          disabled={isLoading || isValidating}
        >
          {isLoading || isValidating ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              {isLoading ? "載入中..." : "更新中..."}
            </>
          ) : (
            "🔄 重新抓取新聞"
          )}
        </button>

        {/* 顯示最後更新時間 */}
        {lastUpdated && (
          <div className="text-sm text-gray-600">
            最後更新：{new Date(lastUpdated).toLocaleString("zh-TW")}
          </div>
        )}

        {/* 顯示新聞數量 */}
        {news.length > 0 && (
          <div className="text-sm text-gray-600">
            目前顯示 {news.length} 篇新聞
          </div>
        )}

        {/* 錯誤警告 (但仍有資料顯示) */}
        {error && news.length > 0 && (
          <div className="alert alert-warning mt-3">
            <span>
              ⚠️ 無法取得最新新聞，顯示先前資料 (錯誤: {error.message})
            </span>
          </div>
        )}

        {/* 背景更新指示器 */}
        {isValidating && !isLoading && (
          <div className="text-xs text-blue-500 mt-2">
            🔄 正在背景更新資料...
          </div>
        )}
      </div>

      {/* 新聞內容區域 */}
      {isLoading && news.length === 0 ? (
        // 載入中的骨架屏
        <div className="newsContainer flex flex-wrap justify-center">
          {[...Array(10)].map((_, index) => (
            <div
              className="newsCard p-4 m-4 w-80 bg-base-100 rounded-xl shadow-md"
              key={`skeleton-${index}`}
            >
              <div className="skeleton h-6 w-full mb-3"></div>
              <div className="skeleton h-6 w-3/4 mb-3"></div>
              <div className="skeleton h-4 w-1/2 mb-3"></div>
              <div className="skeleton h-8 w-24 mt-3"></div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        // 無資料狀態
        <div className="text-center p-8">
          <p className="text-lg text-gray-500">目前沒有新聞資料</p>
          <p className="text-sm text-gray-400 mt-2">請點擊上方按鈕重新抓取</p>
        </div>
      ) : (
        // 新聞列表
        <div className="newsContainer flex flex-wrap justify-center">
          {news.map((article, index) => (
            <div
              className="newsCard p-4 m-4 w-80 rounded-xl shadow-md bg-base-100 hover:shadow-lg transition-shadow"
              key={`${article.link}-${index}`}
            >
              <h3 className="font-bold text-lg mb-2 leading-loose">
                標題：{article.title}
              </h3>
              <h3 className="text-base mb-2 leading-loose text-gray-600">
                來源：{article.source}
              </h3>
              <p className="text-sm mb-3 leading-loose text-gray-500">
                發布日期：{new Date(article.pubDate).toLocaleString("zh-TW")}
              </p>
              {article.relevanceScore && (
                <p className="text-xs text-blue-500 mb-2">
                  相關性評分：{article.relevanceScore}
                </p>
              )}
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
