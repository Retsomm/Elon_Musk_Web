// 可以添加到 News.tsx 的臨時解決方案
const handleMissingUrl = (article) => {
  // 嘗試從其他字段構建 URL
  if (!article.url && article.source) {
    // 根據來源嘗試搜索
    const searchQuery = encodeURIComponent(article.title);
    return `https://www.google.com/search?q=${searchQuery}`;
  }
  return null;
};