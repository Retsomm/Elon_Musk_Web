// 調試腳本：測試新聞 API 響應
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

async function testNewsAPI() {
  try {
    const app = initializeApp(firebaseConfig);
    const functions = getFunctions(app);
    const getNews = httpsCallable(functions, "getNews");

    console.log("正在調用 Firebase Function...");
    const result = await getNews({ limit: 5 });
    
    console.log("Firebase Function 響應:", JSON.stringify(result.data, null, 2));
    
    if (result.data?.articles) {
      console.log("\n文章詳細信息:");
      result.data.articles.forEach((article, index) => {
        console.log(`\n文章 ${index + 1}:`);
        console.log(`  標題: ${article.title}`);
        console.log(`  連結: ${article.link || article.url || '無'}`);
        console.log(`  來源: ${article.source}`);
      });
    }
    
  } catch (error) {
    console.error("調試失敗:", error);
  }
}

testNewsAPI();