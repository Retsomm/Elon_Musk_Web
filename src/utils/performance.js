export const trackPageLoad = (pageName) => {
  const loadTime = performance.now();
  console.log(`${pageName} 載入時間: ${loadTime}ms`);
  
  // 可以發送到分析服務
  if (window.gtag) {
    window.gtag('event', 'page_load_time', {
      event_category: 'Performance',
      value: Math.round(loadTime)
    });
  }
};