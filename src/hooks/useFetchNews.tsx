import useSWR from "swr";
import { getFunctions, httpsCallable } from "firebase/functions";
import type {
  NewsArticle,
  NewsResponse,
  NewsCache,
  FirebaseNewsResponse,
  GetNewsParams,
  UseFetchNewsReturn,
  SwrNewsOptions,
  FirebaseFunctionError,
  DateString,
  ISOString
} from "../types/news";

/**
 * 取得台灣時區（UTC+8）當前日期的字串 (格式: YYYY-MM-DD)。
 *
 * 原理：
 * - 先取得現在的 UTC 時間。
 * - 再將 UTC 小時數加 8，調整為台灣時區。
 * - 以 ISO 格式轉字串，並擷取前 10 碼（即日期部分）。
 *
 * @returns {DateString} 例如 "2025-09-13"
 */
export function getTaiwanDateString(): DateString {
  const now = new Date();
  // UTC + 8 小時，將日期調整到台灣時區
  now.setUTCHours(now.getUTCHours() + 8);
  // 轉成 ISO 字串並擷取 YYYY-MM-DD
  return now.toISOString().slice(0, 10);
}

/**
 * 合併和去重新聞文章
 * @param {NewsArticle[]} newArticles - 新獲取的文章
 * @param {NewsArticle[]} existingArticles - 現有的歷史文章
 * @returns {NewsArticle[]} 合併後的文章陣列，最多15篇，按時間排序
 */
function mergeAndDedupeArticles(newArticles: NewsArticle[], existingArticles: NewsArticle[] = []): NewsArticle[] {
  // 將新文章和現有文章合併成一個陣列
  const allArticles = [...newArticles, ...existingArticles];

  // 根據標題和來源去重：過濾出唯一的文章，只保留第一次出現的
  const uniqueArticles = allArticles.filter((article, index, arr) => {
    return (
      // 回傳陣列中第一個 title 和 source 都跟目前 article 一樣的元素的索引值
      arr.findIndex(
        (a) => a.title === article.title && a.source === article.source
      ) === index
    );
  });

  // 按發布時間排序（最新在前），使用 pubDate 或 timestamp 作為排序依據
  const sortedArticles = uniqueArticles.sort((a, b) => {
    const dateA = new Date(a.pubDate || a.timestamp || 0);
    const dateB = new Date(b.pubDate || b.timestamp || 0);
    return dateB.getTime() - dateA.getTime(); // 降序排序，最新在前
  });

  // 限制最多15篇，返回前15篇
  return sortedArticles.slice(0, 15);
}

/**
 * SWR fetcher 函數 - 使用 Firebase httpsCallable 獲取新聞資料
 * 負責呼叫 Firebase Cloud Function 並處理回應
 * @returns {Promise<NewsResponse>} 處理後的新聞資料物件，包含文章列表、時間戳、日期、新增數量、總數量等
 */
const fetcher = async (): Promise<NewsResponse> => {
  try {
    // 初始化 Firebase Functions 實例
    const functions = getFunctions();
    // 獲取名為 "getNews" 的 Cloud Function
    const getNews = httpsCallable(functions, "getNews");

    // 呼叫 Cloud Function，傳入參數限制最多40個新聞
    const result = await getNews({ limit: 40 } as GetNewsParams);

    // 記錄 Firebase Function 的回應以便除錯
    console.log("Firebase Function 回應:", result);

    // 檢查回應是否為有效物件
    if (!result || typeof result !== "object") {
      throw new Error("Firebase Function 回應格式不正確");
    }

    // 處理 API 回傳的資料格式：有些 API 將資料放在 data 欄位，有些放在 articles
    // 如果兩者都沒有，拋出錯誤
    const firebaseResult = result.data as FirebaseNewsResponse;
    let data: { articles: NewsArticle[]; metadata?: any };
    
    if (firebaseResult?.data) {
      data = firebaseResult.data;
    } else if (firebaseResult?.articles) {
      // 如果直接在 result 中有 articles，但後續需要 data.metadata，所以不直接設為 result.articles
      data = {
        articles: firebaseResult.articles,
        metadata: firebaseResult.metadata
      };
    } else {
      throw new Error("Firebase Function 回應中缺少 data 或 articles 欄位");
    }

    // 提取文章陣列，如果沒有則為空陣列
    const newArticles = data.articles || [];

    // 如果沒有新文章，記錄警告並返回歷史快取資料
    if (newArticles.length === 0) {
      console.warn("API 回應中沒有新聞資料，使用歷史快取");

      // 嘗試從 localStorage 獲取歷史資料
      try {
        const cache = localStorage.getItem("newsHistoryCache");
        if (cache) {
          const parsed: NewsCache = JSON.parse(cache);
          if (parsed.articles && parsed.articles.length > 0) {
            console.log("返回歷史快取資料:", parsed.articles.length, "篇新聞");
            return parsed; // 直接返回歷史快取
          }
        }
      } catch (e) {
        console.warn("讀取歷史快取失敗:", e);
      }

      // 如果沒有歷史快取，才返回空資料
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

    // 嘗試從 localStorage 獲取現有的歷史新聞快取
    let existingArticles: NewsArticle[] = [];
    try {
      // newsHistoryCache 是自訂的 localStorage key，用來存放新聞快取資料
      const cache = localStorage.getItem("newsHistoryCache");
      if (cache) {
        const parsed: NewsCache = JSON.parse(cache);
        existingArticles = parsed.articles || [];
      }
    } catch (e) {
      console.warn("讀取歷史快取失敗:", e);
    }

    // 合併新舊新聞，並去重和排序
    const mergedArticles = mergeAndDedupeArticles(
      newArticles,
      existingArticles
    );

    // 返回處理後的資料物件
    return {
      articles: mergedArticles, // 合併後的文章列表
      timestamp: new Date().toISOString(), // 當前時間戳
      date: getTaiwanDateString(), // 台灣時區日期
      newCount: newArticles.length, // 新增文章數量
      totalCount: mergedArticles.length, // 總文章數量
      metadata: data.metadata || {}, // 元資料
    };
  } catch (error: unknown) {
    // 記錄詳細錯誤資訊
    console.error("Firebase Function 詳細錯誤:", error);

    // 處理 Firebase Functions 特定錯誤，提供更友好的錯誤訊息
    const firebaseError = error as FirebaseFunctionError;
    if (firebaseError?.code) {
      switch (firebaseError.code) {
        case "functions/internal":
          throw new Error(`伺服器內部錯誤，請稍後重試`);
        case "functions/unavailable":
          throw new Error(`服務暫時無法使用，請稍後重試`);
        case "functions/timeout":
          throw new Error(`請求超時，請檢查網路連線`);
        case "functions/unauthenticated":
          throw new Error(`認證失敗，請重新登入`);
        default:
          throw new Error(`服務錯誤 (${firebaseError.code}): ${firebaseError.message}`);
      }
    }
    // 如果不是 Firebase 錯誤，直接拋出原錯誤
    throw error;
  }
};

/**
 * 自訂 Hook：負責「顯示、快取、重試」新聞資料
 * 使用 SWR 優化 API 請求和快取機制，並維護歷史新聞
 *
 * @param {SwrNewsOptions} swrOptions - 覆寫 SWR 設定（可選），允許自訂 SWR 行為
 * @returns {UseFetchNewsReturn} SWR Hook 回傳物件
 *   - data: 獲取的新聞資料物件
 *   - error: 錯誤物件，如果有錯誤
 *   - isLoading: 是否正在載入資料
 *   - mutate: 手動觸發重新獲取資料的函數
 *   - isValidating: 是否正在驗證資料（重新獲取中）
 */
//如果呼叫 useFetchNews() 時沒有傳入任何參數，swrOptions 會自動是一個空物件 {}，這樣在函式內部就可以安全地使用 swrOptions 的屬性
export default function useFetchNews(swrOptions: SwrNewsOptions = {}): UseFetchNewsReturn {
  // 獲取歷史快取作為初始資料
  const getFallbackData = (): NewsResponse | undefined => {
    try {
      const cache = localStorage.getItem("newsHistoryCache");
      if (cache) {
        const parsed: NewsCache = JSON.parse(cache);
        // 確保快取資料格式正確且有文章
        if (Array.isArray(parsed.articles) && parsed.articles.length > 0) {
          console.log("使用歷史快取資料:", parsed.articles.length, "篇新聞");
          return parsed as NewsResponse;
        }
      }
    } catch (e) {
      console.warn("讀取歷史快取失敗:", e);
      // 如果讀取失敗，移除損壞的快取
      localStorage.removeItem("newsHistoryCache");
    }
    return undefined; // 沒有快取時返回 undefined
  };

  // 定義 SWR 的預設選項
  const defaultOptions = {
    revalidateOnFocus: false, // 視窗聚焦時不重新驗證
    revalidateOnReconnect: true, // 網路重新連線時重新驗證
    refreshInterval: 0, // 不自動刷新
    errorRetryCount: 3, // 錯誤重試次數
    errorRetryInterval: 2000, // 重試間隔（毫秒）
    dedupingInterval: 5 * 60 * 1000, // 去重間隔（5分鐘）
    fallbackData: getFallbackData(),
    // SWR 提供的配置選項
     onSuccess: (data: NewsResponse) => {
      // 成功獲取資料時，只有當有新聞文章時才儲存到 localStorage
      if (data && data.articles && data.articles.length > 0) {
        try {
          localStorage.setItem("newsHistoryCache", JSON.stringify(data));
          localStorage.setItem("newsCache", JSON.stringify(data));
          console.log(
            `成功更新新聞: 新增 ${data.newCount} 篇，總計 ${data.totalCount} 篇`
          );
        } catch (e) {
          console.warn("儲存歷史快取失敗:", e);
        }
      } else {
        // 如果沒有新文章，不更新快取，保留歷史資料
        console.log("沒有新文章，保留現有快取");
      }
    },
    // SWR 提供的配置選項
    onError: (error: any) => {
      // 發生錯誤時，記錄錯誤並嘗試使用歷史快取
      console.error("SWR 錯誤:", error.message);
      try {
        const cache = localStorage.getItem("newsHistoryCache");
        if (cache) {
          const parsed: NewsCache = JSON.parse(cache);
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

  // 使用 SWR Hook 獲取資料，使用固定 key "getNews"
  const { data, error, isLoading, mutate, isValidating } = useSWR<NewsResponse>(
    "getNews", // 固定的 key，因為不再依賴 URL，數據來源是 Firebase Cloud Function，而不是傳統的 REST API URL
    fetcher, // 資料獲取函數
    { ...defaultOptions, ...swrOptions } as any // 合併預設和自訂選項
  );

  // 返回 SWR 的狀態和資料
  return { data, error, isLoading, mutate, isValidating };
}

/**
 * 清除歷史新聞快取的工具函數
 * 移除 localStorage 中的新聞快取資料
 */
export function clearNewsHistory() {
  try {
    // 移除新的和舊的快取鍵
    localStorage.removeItem("newsHistoryCache");
    localStorage.removeItem("newsCache");
    console.log("歷史新聞快取已清除");
  } catch (e) {
    console.error("清除歷史快取失敗:", e);
  }
}
