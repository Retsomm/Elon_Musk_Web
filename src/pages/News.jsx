import useFetchNews from "../hooks/useFetchNews";

/**
 * 使用自訂 Hook 進行新聞資料獲取、快取及重試
 */
export default function News() {
  // 移除 URL 參數，現在使用 Firebase httpsCallable
  const { data, error, isLoading, mutate, isValidating } = useFetchNews();

  /**
   * 手動重新抓取新聞
   */
  const retryFetchNews = async () => {
    try {
      //第一個參數 undefined：在 SWR 中，mutate 的第一個參數通常是 key（用於識別要更新的資料）。當傳入 undefined 時，會重新驗證所有快取的資料。
      //第二個參數 { revalidate: true }：表示執行重新驗證（revalidation），也就是強制 SWR 重新向伺服器請求最新的資料並更新快取。
      await mutate(undefined, { revalidate: true });
    } catch (err) {
      console.error("手動重新抓取失敗:", err);
    }
  };

  const news = data?.articles || [];
  const lastUpdated = data?.timestamp;

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

        {lastUpdated && (
          <div className="text-sm text-gray-600">
            最後更新：{new Date(lastUpdated).toLocaleString("zh-TW")}
          </div>
        )}

        {news.length > 0 && (
          <div className="text-sm text-gray-600">
            目前顯示 {news.length} 篇新聞
          </div>
        )}

        {error && news.length > 0 && (
          <div className="alert alert-warning mt-3">
            <span>
              ⚠️ 無法取得最新新聞，顯示先前資料 (錯誤: {error.message})
            </span>
          </div>
        )}

        {isValidating && !isLoading && (
          <div className="text-xs text-blue-500 mt-2">
            🔄 正在背景更新資料...
          </div>
        )}
      </div>

      {/* 新聞內容區域 */}
      {isLoading && news.length === 0 ? (
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
        <div className="text-center p-8">
          <p className="text-lg text-gray-500">目前沒有新聞資料</p>
          <p className="text-sm text-gray-400 mt-2">請點擊上方按鈕重新抓取</p>
        </div>
      ) : (
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
