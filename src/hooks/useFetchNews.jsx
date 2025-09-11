import useSWR from "swr";
import { getFunctions, httpsCallable } from "firebase/functions";

/**
 * 取得台灣當天日期字串 (yyyy-mm-dd)
 * @returns {string} 格式化為 'yyyy-mm-dd' 的台灣日期
 */
export function getTaiwanDateString() {
  const now = new Date();
  now.setHours(now.getHours() + 8 - now.getTimezoneOffset() / 60);
  return now.toISOString().slice(0, 10);
}

/**
 * 合併和去重新聞文章
 * @param {Array} newArticles - 新獲取的文章
 * @param {Array} existingArticles - 現有的歷史文章
 * @returns {Array} 合併後的文章陣列，最多15篇，按時間排序
 */
function mergeAndDedupeArticles(newArticles, existingArticles = []) {
  const allArticles = [...newArticles, ...existingArticles];

  // 根據標題和來源去重
  const uniqueArticles = allArticles.filter((article, index, arr) => {
    return (
      arr.findIndex(
        (a) => a.title === article.title && a.source === article.source
      ) === index
    );
  });

  // 按發布時間排序（最新在前）
  const sortedArticles = uniqueArticles.sort((a, b) => {
    const dateA = new Date(a.pubDate || a.timestamp);
    const dateB = new Date(b.pubDate || b.timestamp);
    return dateB - dateA;
  });

  // 限制最多15篇
  return sortedArticles.slice(0, 15);
}

/**
 * SWR fetcher 函數 - 使用 Firebase httpsCallable
 * @returns {Promise<Object>} 處理後的新聞資料物件
 */
const fetcher = async () => {
  try {
    // 初始化 Firebase Functions
    const functions = getFunctions();
    const getNews = httpsCallable(functions, "getNews");

    // 呼叫 Cloud Function
    const result = await getNews({ limit: 40 });

    // 改善回應資料檢查
    console.log("Firebase Function 回應:", result);

    // 檢查回應結構
    if (!result || typeof result !== "object") {
      throw new Error("Firebase Function 回應格式不正確");
    }

    let data;
    if (result.data) {
      data = result.data;
    } else if (result.articles) {
      // 如果直接在 result 中有 articles
      data = result;
    } else {
      throw new Error("Firebase Function 回應中缺少 data 或 articles 欄位");
    }

    const newArticles = data.articles || [];

    if (newArticles.length === 0) {
      console.warn("API 回應中沒有新聞資料，使用歷史快取");
      // 不拋出錯誤，而是返回空陣列，讓 SWR 使用 fallbackData
      return {
        articles: [],
        timestamp: new Date().toISOString(),
        date: getTaiwanDateString(),
        newCount: 0,
        totalCount: 0,
        metadata: data.metadata || {},
        error: "沒有新的新聞資料",
      };
    }

    // 獲取現有的歷史新聞
    let existingArticles = [];
    try {
      const cache = localStorage.getItem("newsHistoryCache");
      if (cache) {
        const parsed = JSON.parse(cache);
        existingArticles = parsed.articles || [];
      }
    } catch (e) {
      console.warn("讀取歷史快取失敗:", e);
    }

    // 合併新舊新聞
    const mergedArticles = mergeAndDedupeArticles(
      newArticles,
      existingArticles
    );

    return {
      articles: mergedArticles,
      timestamp: new Date().toISOString(),
      date: getTaiwanDateString(),
      newCount: newArticles.length,
      totalCount: mergedArticles.length,
      metadata: data.metadata || {},
    };
  } catch (error) {
    console.error("Firebase Function 詳細錯誤:", error);

    // Firebase Functions 錯誤處理
    if (error.code) {
      // 針對常見的 Firebase 錯誤提供更友好的錯誤訊息
      switch (error.code) {
        case "functions/internal":
          throw new Error(`伺服器內部錯誤，請稍後重試`);
        case "functions/unavailable":
          throw new Error(`服務暫時無法使用，請稍後重試`);
        case "functions/timeout":
          throw new Error(`請求超時，請檢查網路連線`);
        case "functions/unauthenticated":
          throw new Error(`認證失敗，請重新登入`);
        default:
          throw new Error(`服務錯誤 (${error.code}): ${error.message}`);
      }
    }
    throw error;
  }
};

/**
 * 自訂 Hook：負責「顯示、快取、重試」新聞資料
 * 使用 SWR 優化 API 請求和快取機制，並維護歷史新聞
 *
 * @param {Object} swrOptions - 覆寫 SWR 設定（可選）
 * @returns {{ data: any, error: any, isLoading: boolean, mutate: Function, isValidating: boolean }}
 */
export default function useFetchNews(swrOptions = {}) {
  const defaultOptions = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    errorRetryCount: 3,
    errorRetryInterval: 2000,
    dedupingInterval: 5 * 60 * 1000,
    fallbackData: (() => {
      try {
        const cache = localStorage.getItem("newsHistoryCache");
        if (cache) {
          const parsed = JSON.parse(cache);

          if (Array.isArray(parsed.articles) && parsed.articles.length > 0) {
            console.log("使用歷史快取資料:", parsed.articles.length, "篇新聞");
            return parsed;
          }
        }
      } catch (e) {
        console.warn("讀取歷史快取失敗:", e);
        localStorage.removeItem("newsHistoryCache");
      }
      return null;
    })(),
    onSuccess: (data) => {
      if (data && data.articles) {
        try {
          // 保存到歷史快取
          localStorage.setItem("newsHistoryCache", JSON.stringify(data));

          // 也保存到舊的快取鍵以維持向後兼容
          localStorage.setItem("newsCache", JSON.stringify(data));

          console.log(
            `成功更新新聞: 新增 ${data.newCount} 篇，總計 ${data.totalCount} 篇`
          );
        } catch (e) {
          console.warn("儲存歷史快取失敗:", e);
        }
      }
    },
    onError: (error) => {
      console.error("SWR 錯誤:", error.message);

      // 當發生錯誤時，嘗試使用歷史快取
      try {
        const cache = localStorage.getItem("newsHistoryCache");
        if (cache) {
          const parsed = JSON.parse(cache);
          if (parsed.articles && parsed.articles.length > 0) {
            console.log(
              "錯誤發生時使用歷史快取，共",
              parsed.articles.length,
              "篇新聞"
            );
          }
        }
      } catch (e) {
        console.warn("讀取歷史快取失敗:", e);
      }
    },
  };

  // 使用固定的 key，因為我們不再需要 URL
  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "getNews", // 固定的 key
    fetcher,
    { ...defaultOptions, ...swrOptions }
  );

  return { data, error, isLoading, mutate, isValidating };
}

/**
 * 清除歷史新聞快取的工具函數
 */
export function clearNewsHistory() {
  try {
    localStorage.removeItem("newsHistoryCache");
    localStorage.removeItem("newsCache");
    console.log("歷史新聞快取已清除");
  } catch (e) {
    console.error("清除歷史快取失敗:", e);
  }
}
