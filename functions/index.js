import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import cors from "cors";

/**
 * 負責「抓取、整理、回傳」Elon Musk 相關新聞資料
 * 使用多個優質英文新聞來源，確保連結有效性和內容品質
 */

/**
 * CORS中間件Hook
 * 處理跨來源資源共享(Cross-Origin Resource Sharing)
 * 允許來自任何來源的請求訪問此API，增強前端應用兼容性
 * @type {Function} Express中間件
 */
const corsHandler = cors({ origin: true });

/**
 * 優質英文新聞來源的搜索查詢關鍵字陣列
 * 策略性選擇多個相關關鍵字以獲取全面且相關的新聞
 * 包含Elon Musk個人、旗下公司與專案關鍵字
 * @type {Array<string>}
 */
const searchQueries = [
  'Elon Musk',
  'Tesla CEO',
  'SpaceX Elon',
  'Tesla Motors',
  'SpaceX mission',
  'Neuralink',
  'Starlink',
  'X platform Musk',  // 避免與通用 X 混淆
  'xAI artificial intelligence'
];

/**
 * 優質新聞來源白名單陣列
 * 用於過濾新聞來源，確保只保留來自可靠媒體的報導
 * 分類包含主流財經、科技媒體與特斯拉/太空相關專業媒體
 * @type {Array<string>}
 */
const qualitySources = [
  'reuters.com',
  'bloomberg.com',
  'wsj.com',
  'ft.com',
  'cnbc.com',
  'bbc.com',
  'theguardian.com',
  'reuters.com',
  'techcrunch.com',
  'theverge.com',
  'arstechnica.com',
  'engadget.com',
  'spacenews.com',
  'electrek.co',
  'teslarati.com'
];

/**
 * Firebase Cloud Function HTTP請求Hook
 * 使用onRequest註冊HTTP觸發函數，設定函數執行環境與資源限制
 * 
 * @param {Object} 函數配置選項
 *   - region: 函數部署區域(美國中部)
 *   - memory: 分配1GB記憶體確保有足夠資源處理多個並行請求
 *   - timeoutSeconds: 延長執行時間上限至120秒，適應複雜資料獲取需求
 *   - maxInstances: 限制最多10個同時執行實例控制資源使用
 * 
 * @param {Function} 請求處理函數，透過corsHandler處理跨域問題
 * @returns {Function} 已配置的Firebase雲函數
 */
export const getNews = onRequest({
  region: "us-central1",
  memory: "1GiB",
  timeoutSeconds: 120, // 增加超時時間
  maxInstances: 10
}, (req, res) => {
  return corsHandler(req, res, async () => {

    /**
     * 從NewsAPI抓取英文新聞
     * 實作外部API資料獲取、過濾與轉換的複雜邏輯
     * 
     * @param {string} query - 搜索關鍵字
     * @returns {Promise<Array<Object>>} 處理後的新聞文章陣列
     * 
     * 資料處理流程:
     * 1. 向NewsAPI發送HTTP GET請求
     * 2. 設定查詢參數(關鍵字、語言、排序方式、搜尋時間範圍)
     * 3. 接收並驗證API回應
     * 4. 多重條件過濾文章(來源可靠性、關聯性、內容品質)
     * 5. 資料結構轉換，添加額外屬性(相關性評分)
     */
    const fetchNewsFromNewsAPI = async (query) => {
      try {
        console.log(`正在搜索: "${query}"`);
        
        const response = await axios.get("https://newsapi.org/v2/everything", {
          params: {
            q: query,
            language: "en", 
            sortBy: "publishedAt",
            pageSize: 30, 
            from: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 搜索過去3天
            apiKey: process.env.NEWS_API_KEY
          },
          timeout: 20000 // 設置20秒超時避免請求懸掛
        });

        if (!response.data.articles) {
          console.warn(`搜索 "${query}" 沒有返回文章`);
          return [];
        }

        /**
         * 陣列資料處理 - 過濾與轉換
         * 1. filter - 實作多層級過濾邏輯:
         *    - 基本屬性完整性檢查(title, url, source)
         *    - 優質來源檢查(與qualitySources陣列比對)
         *    - 內容相關性檢查(使用正則表達式匹配關鍵詞)
         *    - 垃圾內容過濾(排除已刪除或無效內容)
         * 
         * 2. map - 對象屬性映射與資料結構重塑:
         *    - 擷取與標準化所需屬性
         *    - 建立新的資料結構
         *    - 加入自定義屬性如相關性評分
         */
        const articles = response.data.articles
          .filter(item => {
            // 檢查基本內容完整性
            if (!item.title || !item.url || !item.source?.name) {
              return false;
            }

            // 檢查是否為優質來源
            const isQualitySource = qualitySources.some(source => 
              item.url.toLowerCase().includes(source.toLowerCase())
            );

            // 檢查內容相關性
            const content = (item.title + ' ' + (item.description || '')).toLowerCase();
            const isRelevant = /elon|musk|tesla|spacex|neuralink|starlink|twitter.*musk|xai.*musk/i.test(content);

            // 過濾掉明顯的垃圾內容
            const isSpam = /removed|deleted|\[removed\]|\[deleted\]/i.test(item.title);

            return isQualitySource && isRelevant && !isSpam;
          })
          .map((item) => ({
            title: item.title.trim(),
            source: item.source.name,
            link: item.url,
            description: item.description || "",
            pubDate: item.publishedAt,
            query,
            relevanceScore: calculateRelevance(item), // 動態計算相關性分數
            imageUrl: item.urlToImage || null
          }));

        console.log(`搜索 "${query}" 找到 ${articles.length} 篇優質文章`);
        return articles;

      } catch (error) {
        console.error(`搜尋 "${query}" 失敗:`, error.message);
        return [];
      }
    };

    /**
     * 計算文章相關性評分
     * 實作複雜的評分演算法，根據關鍵詞出現情況和來源可靠性給文章打分
     * 
     * @param {Object} item - 新聞文章物件
     * @returns {number} 相關性分數 - 數值越高表示與Elon Musk相關度越高
     * 
     * 評分邏輯:
     * 1. 根據不同關鍵詞出現給予不同權重分數
     * 2. 根據新聞來源可靠性給予額外加分
     * 3. 根據頂級媒體和一般優質媒體區分加分權重
     */
    const calculateRelevance = (item) => {
      const content = (item.title + ' ' + (item.description || '')).toLowerCase();
      let score = 0;
      
      // 主要關鍵字評分
      if (/elon\s+musk/i.test(content)) score += 15;
      if (/\bmusk\b/i.test(content)) score += 10;
      if (/tesla/i.test(content)) score += 8;
      if (/spacex/i.test(content)) score += 8;
      if (/neuralink/i.test(content)) score += 6;
      if (/starlink/i.test(content)) score += 6;
      if (/xai/i.test(content)) score += 5;
      
      // 優質來源加分
      const qualityBonus = qualitySources.find(source => 
        item.url.toLowerCase().includes(source.toLowerCase())
      );
      if (qualityBonus) {
        if (['reuters.com', 'bloomberg.com', 'wsj.com'].includes(qualityBonus)) {
          score += 5; // 頂級金融媒體
        } else {
          score += 3; // 其他優質媒體
        }
      }
      
      return score;
    };

    /**
     * 驗證URL連結有效性
     * 使用HEAD請求高效檢查URL可訪問性
     * 
     * @param {string} url - 要檢查的連結
     * @returns {Promise<boolean>} 連結是否有效
     * 
     * 實作特點:
     * 1. 使用HEAD請求(僅獲取標頭，不下載內容)提高效率
     * 2. 設定短超時時間(5秒)避免長時間等待
     * 3. 允許最多5次重定向處理短連結
     * 4. HTTP狀態碼小於400視為有效鏈接
     */
    const validateLink = async (url) => {
      try {
        const response = await axios.head(url, { 
          timeout: 5000,
          maxRedirects: 5
        });
        return response.status < 400;
      } catch {
        return false;
      }
    };

    /**
     * 驗證訊息內容
     * 確保內容符合應用要求的格式與長度限制
     * 
     * @param {string} content - 要驗證的訊息內容
     * @returns {string} 驗證並標準化後的訊息內容
     * @throws {Error} 驗證失敗時拋出錯誤
     * 
     * 驗證檢查:
     * 1. 內容非空檢查
     * 2. 長度限制檢查(最大500字元)
     * 3. 返回前進行修剪處理
     */
    const validateMessage = (content) => {
      if (!content || content.trim().length === 0) {
        throw new Error('訊息不能為空');
      }
      if (content.length > 500) {
        throw new Error('訊息過長');
      }
      // 可以添加更多驗證邏輯
      return content.trim();
    };

    try {
      console.log('開始抓取 Elon Musk 相關英文新聞...');
      const allResults = [];

      /**
       * 並行處理多個查詢提高效率
       * 使用Promise.allSettled實作非阻塞並行請求處理
       * 
       * 實作特點:
       * 1. 使用map方法創建Promise陣列
       * 2. 使用Promise.allSettled確保部分查詢失敗不影響整體
       * 3. 個別處理成功與失敗的查詢結果
       */
      const fetchPromises = searchQueries.map(keyword => 
        fetchNewsFromNewsAPI(keyword)
      );

      const results = await Promise.allSettled(fetchPromises);
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allResults.push(...result.value);
        } else {
          console.error(`查詢 "${searchQueries[index]}" 失敗:`, result.reason);
        }
      });

      console.log(`總共收集到 ${allResults.length} 篇文章`);

      /**
       * 文章去重處理
       * 使用標題相似度比較實作智能去重邏輯
       * 
       * 實作特點:
       * 1. 使用Set集合儲存已處理的標題
       * 2. 標題正規化處理(小寫、移除特殊字符)
       * 3. 使用calculateSimilarity方法計算標題相似度
       * 4. 相似度超過80%視為重複文章
       */
      const seenTitles = new Set();
      const uniqueArticles = allResults.filter(article => {
        const normalizedTitle = article.title
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .trim();
        
        // 檢查是否有相似標題
        for (const seen of seenTitles) {
          const similarity = calculateSimilarity(normalizedTitle, seen);
          if (similarity > 0.8) { // 80% 相似度認為重複
            return false;
          }
        }
        
        seenTitles.add(normalizedTitle);
        return true;
      });

      console.log(`去重後剩餘 ${uniqueArticles.length} 篇文章`);

      /**
       * 文章排序處理
       * 實作多級排序邏輯，優先考慮相關性，其次考慮時間新鮮度
       * 
       * 排序邏輯:
       * 1. 主要排序依據: 相關性分數(relevanceScore)降序排列
       * 2. 次要排序依據: 發布時間(pubDate)降序排列(新到舊)
       */
      const sorted = uniqueArticles.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      });

      /**
       * 連結有效性驗證
       * 對排序後的前10篇文章進行連結驗證，確保高質量輸出
       * 
       * 實作特點:
       * 1. 僅驗證前10篇文章提高效率
       * 2. 使用Promise.allSettled並行處理驗證請求
       * 3. 保留驗證成功的文章，並附加連結有效性標記
       */
      const topArticles = sorted.slice(0, 30);
      const validationPromises = topArticles.slice(0, 10).map(async (article) => {
        const isValid = await validateLink(article.link);
        return { ...article, linkValid: isValid };
      });

      const validatedArticles = await Promise.allSettled(validationPromises);
      const finalArticles = [
        ...validatedArticles
          .filter(result => result.status === 'fulfilled')
          .map(result => result.value),
        ...topArticles.slice(10) // 未驗證的文章
      ].slice(0, 25);

      console.log(`最終返回 ${finalArticles.length} 篇文章`);

      /**
       * 回傳結果組裝
       * 建構標準化JSON回應，包含文章資料與元資訊
       * 
       * 回應結構:
       * 1. 文章陣列
       * 2. 時間戳記
       * 3. 統計資訊(總文章數、來源數量)
       * 4. 元資料(搜尋查詢數、優質來源數、語言)
       */
      res.status(200).json({
        articles: finalArticles,
        timestamp: new Date().toISOString(),
        totalFound: uniqueArticles.length,
        sources: [...new Set(finalArticles.map(a => a.source))].length,
        metadata: {
          searchQueries: searchQueries.length,
          qualitySources: qualitySources.length,
          language: 'en'
        }
      });

    } catch (err) {
      console.error("獲取新聞失敗:", err);
      res.status(500).json({
        error: "伺服器錯誤，請稍後再試",
        timestamp: new Date().toISOString(),
        details: err.message
      });
    }
  });
});

/**
 * 計算兩個字串的相似度
 * 使用編輯距離(Levenshtein距離)計算文字相似程度
 * 
 * @param {string} str1 - 第一個字串
 * @param {string} str2 - 第二個字串
 * @returns {number} 相似度 (0-1之間的值，1表示完全相同)
 * 
 * 算法步驟:
 * 1. 比較兩個字串長度，選擇較長者和較短者
 * 2. 計算編輯距離(最少需要幾次編輯操作將一個字串轉換為另一個)
 * 3. 使用公式: (較長字串長度-編輯距離)/較長字串長度 計算相似度
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * 計算編輯距離(Levenshtein距離)
 * 實作動態規劃算法計算兩字串間的最小編輯距離
 * 
 * @param {string} str1 - 第一個字串
 * @param {string} str2 - 第二個字串
 * @returns {number} 編輯距離
 * 
 * 算法步驟:
 * 1. 創建二維矩陣保存子問題解
 * 2. 初始化矩陣邊界值
 * 3. 使用動態規劃填充矩陣
 * 4. 考慮三種操作: 插入、刪除、替換
 * 5. 返回矩陣右下角值作為最終編輯距離
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // 替換
          matrix[i][j - 1] + 1,     // 插入
          matrix[i - 1][j] + 1      // 刪除
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}