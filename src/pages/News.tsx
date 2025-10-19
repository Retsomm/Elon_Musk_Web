import React from 'react';
import useFetchNews from "../hooks/useFetchNews";
import type { NewsArticle, NewsResponse } from "../types/news";

/**
 * News 組件介面
 * 使用自訂 Hook 進行新聞資料獲取、快取及重試
 */
export default function News(): React.ReactElement {
  // 使用自訂 Hook 獲取新聞資料及相關狀態
  const { data, error, isLoading, mutate, isValidating } = useFetchNews();

  /**
   * 手動重新抓取新聞
   */
  const retryFetchNews = async (): Promise<void> => {
    try {
      // 使用正確的 mutate 語法重新驗證資料
      await mutate();
    } catch (err) {
      console.error("手動重新抓取失敗:", err);
    }
  };

  // 從 data 中提取新聞列表和最後更新時間
  const news: NewsArticle[] = data?.articles || [];
  const lastUpdated: string | undefined = data?.timestamp;

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
          type="button"
        >
          {isLoading || isValidating ? (
            <span className="loading loading-spinner loading-sm">
              重新載入中...
            </span>
          ) : (
            "重新載入"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-16">
      {/* 控制面板 */}
      <div className="text-center mb-6 p-4 rounded-lg">
        <button
          className="btn btn-secondary mb-3"
          onClick={retryFetchNews}
          disabled={isLoading || isValidating}
          type="button"
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
          {[...Array(10)].map((_, index: number) => (
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
          {news.map((article: NewsArticle, index: number) => (
            <div
              className="newsCard p-4 m-4 w-80 rounded-xl shadow-md bg-base-100 hover:shadow-lg transition-shadow"
              key={`${article.url}-${index}`}
            >
              <h3 className="font-bold text-lg mb-2 leading-loose">
                標題：{article.title}
              </h3>
              <h3 className="text-base mb-2 leading-loose text-gray-600">
                來源：{article.source}
              </h3>
              <p className="text-sm mb-3 leading-loose text-gray-500">
                發布日期：{article.pubDate ? new Date(article.pubDate).toLocaleString("zh-TW") : "未知"}
              </p>
              {article.category && (
                <p className="text-xs text-blue-500 mb-2">
                  分類：{article.category}
                </p>
              )}
              <div className="tooltip tooltip-right" data-tip="前往外部網站">
                {article.url && article.url.trim() !== '' ? (
                  <a
                    className="btn btn-primary w-fit mt-3"
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    閱讀更多
                  </a>
                ) : (
                  <div>
                    <button
                      className="btn btn-disabled w-fit mt-3"
                      disabled
                      title="此新聞沒有可用連結"
                    >
                      無可用連結
                    </button>
                    {/* 開發環境下顯示調試信息 */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="text-xs text-red-500 mt-1">
                        調試: URL = "{article.url}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}