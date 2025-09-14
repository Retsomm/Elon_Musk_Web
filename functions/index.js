import { onCall, HttpsError } from "firebase-functions/v2/https";
import axios from "axios";

/**
 * 負責「抓取、整理、回傳」Elon Musk 相關新聞資料
 * 使用多個優質英文新聞來源，確保連結有效性和內容品質
 * 此函數通過 NewsAPI 獲取新聞，進行過濾、去重和排序，最後驗證連結有效性
 */

// 定義搜索關鍵字陣列，用於查詢相關新聞
// 包含核心關鍵字、公司相關和產品相關詞，以擴大搜索範圍
const searchQueries = [
  // 核心關鍵字
  'Elon Musk',
  'Tesla CEO',
  'SpaceX Elon',
  
  // 公司相關
  'Tesla Motors',
  'Tesla stock',
  'Tesla earnings',
  'SpaceX mission',
  'SpaceX launch',
  'Neuralink',
  'Starlink',
  'X platform Musk',
  'xAI artificial intelligence',
  
  // 新增的相關詞
  'Tesla autopilot',
  'Tesla cybertruck',
  'Tesla gigafactory',
  'SpaceX starship',
  'SpaceX falcon',
  'Musk twitter',
  'Musk acquisition',
  'Tesla supercharger'
];

// 定義優質新聞來源列表，用於評估新聞品質
// 包含頂級媒體、科技媒體、財經媒體等，以確保內容可靠性
const qualitySources = [
  // 原有的頂級來源
  'reuters.com',
  'bloomberg.com',
  'wsj.com',
  'ft.com',
  'cnbc.com',
  'bbc.com',
  'theguardian.com',
  
  // 科技媒體
  'techcrunch.com',
  'theverge.com',
  'arstechnica.com',
  'engadget.com',
  'wired.com',
  'venturebeat.com',
  'mashable.com',
  
  // 財經媒體
  'marketwatch.com',
  'yahoo.com',
  'cnn.com',
  'businessinsider.com',
  'forbes.com',
  'fortune.com',
  
  // 專業媒體
  'spacenews.com',
  'electrek.co',
  'teslarati.com',
  'insideevs.com',
  'cleantechnica.com',
  'space.com',
  
  // 主流媒體
  'nbcnews.com',
  'abcnews.go.com',
  'cbsnews.com',
  'npr.org',
  'usatoday.com',
  'apnews.com'
];

/**
 * 計算文章相關性評分
 * 基於標題和描述中的關鍵字匹配給予分數，並根據來源品質加分
 * @param {Object} item - 新聞文章物件
 * @returns {number} 相關性分數
 */
const calculateRelevance = (item) => {
  const content = (item.title + ' ' + (item.description || '')).toLowerCase();
  let score = 0;
  
  // 主要關鍵字評分 - 提高權重
  if (/elon\s+musk/i.test(content)) score += 20;
  if (/\bmusk\b/i.test(content)) score += 12;
  if (/tesla.*ceo/i.test(content)) score += 15;
  if (/spacex.*elon/i.test(content)) score += 15;
  
  // 公司關鍵字評分
  if (/\btesla\b/i.test(content)) score += 8;
  if (/spacex/i.test(content)) score += 8;
  if (/neuralink/i.test(content)) score += 7;
  if (/starlink/i.test(content)) score += 7;
  if (/xai/i.test(content)) score += 6;
  
  // 產品關鍵字評分
  if (/cybertruck|autopilot|gigafactory|starship|falcon/i.test(content)) score += 5;
  
  // 來源品質加分
  const qualityBonus = qualitySources.find(source => 
    item.url.toLowerCase().includes(source.toLowerCase())
  );
  if (qualityBonus) {
    if (['reuters.com', 'bloomberg.com', 'wsj.com', 'ft.com'].includes(qualityBonus)) {
      score += 8; // 頂級媒體
    } else if (['cnbc.com', 'techcrunch.com', 'theverge.com'].includes(qualityBonus)) {
      score += 6; // 一級媒體
    } else {
      score += 4; // 其他優質媒體
    }
  }
  
  return score;
};

/**
 * 驗證URL連結有效性
 * 使用 axios 發送 HEAD 請求檢查連結是否可訪問
 * @param {string} url - 要驗證的URL
 * @returns {boolean} 連結是否有效
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
 * 計算兩個字串的相似度
 * 使用 Levenshtein 距離計算相似度，用於去重新聞
 * @param {string} str1 - 第一個字串
 * @param {string} str2 - 第二個字串
 * @returns {number} 相似度 (0 到 1)
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
 * 避免重複新聞：不同媒體可能報導相同事件，標題略有差異
 * 提高新聞品質：確保使用者看到的是不同內容，而非重複資訊
 * @param {string} str1 - 第一個字串
 * @param {string} str2 - 第二個字串
 * @returns {number} 編輯距離
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

// 導出 Firebase Cloud Function
// 配置區域、記憶體、超時和最大實例數
export const getNews = onCall({
  region: "us-central1",
  memory: "1GiB",
  timeoutSeconds: 120,
  maxInstances: 10
}, async (request) => {
  
  // 驗證請求參數（可選）
  const { limit = 40, sources = null } = request.data || {};
  
  // 驗證 API Key
  if (!process.env.NEWS_API_KEY) {
    throw new HttpsError('failed-precondition', 'News API key not configured');
  }

  /**
   * 從NewsAPI抓取英文新聞
   * @param {string} query - 搜索關鍵字
   * @returns {Array} 過濾後的文章陣列
   */
  const fetchNewsFromNewsAPI = async (query) => {
    try {
      // 發送 GET 請求到 NewsAPI
      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: query,
          language: "en", 
          sortBy: "publishedAt",
          pageSize: 50,
          from: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          apiKey: process.env.NEWS_API_KEY
        },
        timeout: 25000
      });

      if (!response.data.articles) {
        console.warn(`搜索 "${query}" 沒有返回文章`);
        return [];
      }

      // 過濾文章：檢查基本完整性、來源品質和內容相關性
      const articles = response.data.articles
        .filter(item => {
          // 基本內容完整性檢查
          if (!item.title || !item.url || !item.source?.name) {
            return false;
          }

          // 放寬來源檢查
          const isQualitySource = qualitySources.some(source => 
            item.url.toLowerCase().includes(source.toLowerCase())
          );
          
          const hasReliableIndicators = !isQualitySource && (
            item.source.name.toLowerCase().includes('news') ||
            item.source.name.toLowerCase().includes('times') ||
            item.source.name.toLowerCase().includes('post') ||
            item.url.includes('https://')
          );

          // 放寬內容相關性檢查
          const content = (item.title + ' ' + (item.description || '')).toLowerCase();
          const isHighlyRelevant = /elon.*musk|musk.*elon/i.test(content);
          const isModerationRelevant = /\bmusk\b|tesla.*ceo|spacex.*elon|neuralink|starlink|xai/i.test(content);
          const isLooselyRelevant = /tesla|spacex|twitter.*elon|x.*platform.*elon/i.test(content);

          // 過濾垃圾內容
          const isSpam = /removed|deleted|\[removed\]|\[deleted\]/i.test(item.title);

          // 分層級接受文章
          return !isSpam && (
            (isQualitySource && (isHighlyRelevant || isModerationRelevant || isLooselyRelevant)) ||
            (hasReliableIndicators && (isHighlyRelevant || isModerationRelevant))
          );
        })
        .map((item) => ({
          title: item.title.trim(),
          source: item.source.name,
          link: item.url,
          description: item.description || "",
          pubDate: item.publishedAt,
          query,
          relevanceScore: calculateRelevance(item),
          imageUrl: item.urlToImage || null,
          sourceType: qualitySources.some(s => item.url.toLowerCase().includes(s.toLowerCase())) ? 'premium' : 'standard'
        }));

      return articles;

    } catch (error) {
      console.error(`搜尋 "${query}" 失敗:`, error.message);
      return [];
    }
  };

  try {
    const allResults = [];

    // 並行處理多個查詢
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

    // 文章去重處理：基於標題相似度過濾重複文章
    const seenTitles = new Set();
    const uniqueArticles = allResults.filter(article => {
      const normalizedTitle = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .trim();
      
      // 檢查是否有相似標題
      for (const seen of seenTitles) {
        const similarity = calculateSimilarity(normalizedTitle, seen);
        if (similarity > 0.8) {
          return false;
        }
      }
      
      seenTitles.add(normalizedTitle);
      return true;
    });

    // 文章排序處理：先按相關性分數，再按發佈時間
    const sorted = uniqueArticles.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });

    // 連結有效性驗證：對前10篇文章進行驗證
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
      ...topArticles.slice(10)
    ].slice(0, limit);

    // 回傳結果：包含文章列表和元資料
    return {
      articles: finalArticles,
      timestamp: new Date().toISOString(),
      totalFound: uniqueArticles.length,
      sources: [...new Set(finalArticles.map(a => a.source))].length,
      metadata: {
        searchQueries: searchQueries.length,
        qualitySources: qualitySources.length,
        language: 'en'
      }
    };

  } catch (err) {
    console.error("獲取新聞失敗:", err);
    throw new HttpsError('internal', '伺服器錯誤，請稍後再試', {
      timestamp: new Date().toISOString(),
      details: err.message
    });
  }
});   