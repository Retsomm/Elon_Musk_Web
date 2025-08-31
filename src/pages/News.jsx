import useSWR from "swr";

/**
 * 負責「顯示、快取、重試」新聞資料
 * 使用 SWR 優化 API 請求和快取機制
 */

/**
 * 取得台灣當天日期字串 (yyyy-mm-dd)
 * @returns {string} 格式化為 'yyyy-mm-dd' 的台灣日期
 */
function getTaiwanDateString() {
  const now = new Date(); // 建立當前日期物件
  // 將本地時間調整為台灣時間 (UTC+8)，減去時區偏移量以確保正確轉換
  now.setHours(now.getHours() + 8 - now.getTimezoneOffset() / 60);
  // 從 ISO 字符串中截取 yyyy-mm-dd 部分
  return now.toISOString().slice(0, 10);
}

/**
 * SWR fetcher 函數 - 負責從 API 獲取資料並進行初步處理
 * @param {string} url - API 端點
 * @returns {Promise<Object>} 處理後的新聞資料物件
 * @property {Array} articles - 新聞文章陣列
 * @property {string} timestamp - 資料獲取時間戳
 * @property {string} date - 台灣日期
 */
const fetcher = async (url) => {
  // 建立 AbortController 實例用於請求超時控制
  const controller = new AbortController();
  // 設定 30 秒超時，超過時間自動中止請求
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    // 發送 API 請求，帶入中止信號和緩存控制頭
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "Cache-Control": "default", // 使用瀏覽器默認的緩存策略
      },
    });

    clearTimeout(timeoutId); // 清除超時計時器

    // 檢查 HTTP 回應狀態
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // 解析 JSON 回應
    const result = await response.json();
    // 從回應中提取文章陣列，若不存在則使用空陣列
    const articles = result.articles || [];

    // 驗證是否有新聞資料
    if (articles.length === 0) {
      throw new Error("API 回應中沒有新聞資料");
    }

    // 返回格式化的資料物件
    return {
      articles, // 新聞文章陣列
      timestamp: new Date().toISOString(), // 當前時間戳
      date: getTaiwanDateString(), // 台灣日期
    };
  } catch (error) {
    clearTimeout(timeoutId); // 確保在錯誤情況下也清除計時器
    throw error; // 將錯誤向上拋出，由 SWR 處理
  }
};

export default function News() {
  const API_URL =
    "https://us-central1-vite-react-elon-5dae6.cloudfunctions.net/getNews";
  /**
   * 使用 SWR Hook 進行資料獲取、快取和狀態管理
   * @param {string} API_URL - 新聞 API 網址
   * @param {Function} fetcher - 資料獲取函數
   * @returns {Object} SWR 響應物件
   * @property {Object} data - 獲取的資料或快取資料
   * @property {Error} error - 獲取過程中的錯誤
   * @property {boolean} isLoading - 首次載入狀態
   * @property {Function} mutate - 手動重新獲取資料的函數
   * @property {boolean} isValidating - 背景重新驗證狀態
   */
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

      // 快取策略：IIFE 立即執行函數，優先從本地存儲讀取資料作為初始值
      fallbackData: (() => {
        try {
          // 從 localStorage 讀取快取資料
          const cache = localStorage.getItem("newsCache");
          if (cache) {
            // 解析 JSON 格式的快取資料
            const parsed = JSON.parse(cache);
            const today = getTaiwanDateString();

            // 檢查是否為今天的有效快取資料
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
              return parsed; // 返回今天的快取資料
            }

            // 如果非當天但有效的舊資料也可作為備用
            if (Array.isArray(parsed.articles) && parsed.articles.length > 0) {
              console.log(
                "使用舊的 localStorage 快取資料:",
                parsed.articles.length,
                "篇新聞"
              );
              return parsed; // 返回舊的快取資料
            }
          }
        } catch (e) {
          // 處理快取讀取錯誤，清除損壞的快取
          console.warn("讀取快取失敗:", e);
          localStorage.removeItem("newsCache");
        }
        return null; // 無可用快取時返回 null
      })(),

      // 成功回調：更新本地快取
      onSuccess: (data) => {
        if (data && data.articles) {
          try {
            // 將新獲取的資料序列化後存入 localStorage
            localStorage.setItem("newsCache", JSON.stringify(data));
            console.log(`新聞資料已更新並快取，共 ${data.articles.length} 篇`);
          } catch (e) {
            console.warn("儲存快取失敗:", e);
          }
        }
      },

      // 錯誤回調：記錄錯誤
      onError: (error) => {
        console.error("SWR 錯誤:", error.message);
      },
    }
  );

  /**
   * 手動重新抓取新聞
   * 使用 SWR 的 mutate 函數強制重新驗證
   * @async
   * @returns {Promise<void>} 無返回值的 Promise
   */
  const retryFetchNews = async () => {
    console.log("用戶觸發手動重新抓取");
    try {
      // 調用 mutate 方法強制重新驗證，跳過快取
      // undefined 表示使用原始的 key (API_URL)
      // { revalidate: true } 表示強制重新獲取資料
      await mutate(undefined, { revalidate: true });
    } catch (err) {
      console.error("手動重新抓取失敗:", err);
    }
  };

  // 從 data 中解構並提取新聞陣列，若無資料則使用空陣列
  const news = data?.articles || [];
  // 提取最後更新時間戳
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
              {/* 條件渲染：只有當存在相關性評分時才顯示 */}
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
