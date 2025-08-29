import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import cors from "cors";

/**
 * 負責「抓取、整理、回傳」Elon Musk 相關新聞資料
 * 使用多個優質英文新聞來源，確保連結有效性和內容品質
 */
const corsHandler = cors({ origin: true });

// 優質英文新聞來源的搜索查詢
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

// 優質新聞來源白名單 (避免垃圾內容)
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

export const getNews = onRequest({
  region: "us-central1",
  memory: "1GiB",
  timeoutSeconds: 120, // 增加超時時間
  maxInstances: 10
}, (req, res) => {
  return corsHandler(req, res, async () => {

    /**
     * 從 NewsAPI 抓取英文新聞
     * @param {string} query - 搜索關鍵字
     * @returns {Array} 新聞文章陣列
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
          timeout: 20000
        });

        if (!response.data.articles) {
          console.warn(`搜索 "${query}" 沒有返回文章`);
          return [];
        }

        // 嚴格過濾優質來源和有效連結
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
            relevanceScore: calculateRelevance(item),
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
     * @param {Object} item - 新聞文章物件
     * @returns {number} 相關性分數
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
     * 驗證連結有效性 (抽樣檢查)
     * @param {string} url - 要檢查的連結
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
     * 驗證訊息內容
     * @param {string} content - 要驗證的訊息內容
     * @returns {string} 驗證後的訊息內容
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

      // 並行處理多個查詢以提高效率
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

      // 去重處理 (基於標題相似度)
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

      // 排序：先按相關性，再按時間
      const sorted = uniqueArticles.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      });

      // 對前10篇文章進行連結驗證
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
 * @param {string} str1 
 * @param {string} str2 
 * @returns {number} 相似度 (0-1)
 */
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * 計算編輯距離
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
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
}