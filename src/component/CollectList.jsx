import bookData from "../data/book.json"; // 導入書籍資料
import podcastData from "../data/podcasts.json"; // 導入播客資料
import VideoData from "../data/youtube.json"; // 導入影片資料
import { useAllFavorites } from "../hooks/useFavorites"; // 自定義 Hook，用於管理收藏功能
import { useMemo } from "react"; // React Hook，用於效能優化
import { Link } from "react-router-dom"; // 路由連結元件

/**
 * 根據類型和ID獲取對應的資料項目及其筆記
 * @param {string} type - 資料類型 (book, youtube, podcast)
 * @param {string} id - 資料項目ID
 * @returns {Object} - 包含找到的項目和相關筆記的物件
 */
const getItemAndNotes = (type, id) => {
  // 定義資料來源與對應的筆記屬性名稱映射
  const dataSourceMap = {
    book: {
      collection: bookData.books,
      noteProperty: "bookNote",
    },
    youtube: {
      collection: VideoData.youtubeVideos,
      noteProperty: "highlight",
    },
    podcast: {
      collection: podcastData.podcasts,
      noteProperty: "timestamps",
    },
  };

  // 獲取對應類型的資料來源配置
  const sourceConfig = dataSourceMap[type];

  // 若配置不存在，返回空物件
  if (!sourceConfig) {
    return { item: null, notes: [] };
  }

  // 從對應集合中查找項目
  const item = sourceConfig.collection.find((item) => item.id === id);

  // 返回項目與其筆記（使用動態屬性名稱）
  return {
    item,
    notes: item ? item[sourceConfig.noteProperty] || [] : [],
  };
};

export default function CollectList() {
  // 使用自定義 Hook 獲取所有收藏數據和移除收藏的函數
  const { favoritesData, removeFavorite } = useAllFavorites();

  /**
   * 處理移除收藏項目的事件
   * @param {string} type - 資料類型
   * @param {string} id - 資料項目ID
   * @param {string} noteIdx - 筆記索引
   */
  const handleRemoveFavorite = async (type, id, noteIdx) => {
    await removeFavorite(type, id, noteIdx); // 呼叫 Hook 中的移除函數
  };

  // 使用 useMemo 緩存收藏項目的處理結果，只有當 favoritesData 變更時才重新計算
  const collectItems = useMemo(() => {
    // 檢查是否有收藏數據
    if (!favoritesData || Object.keys(favoritesData).length === 0) {
      return [];
    }

    // 從三種不同類型的資料中獲取所有收藏項目
    return ["book", "youtube", "podcast"].flatMap((type) => {
      const typeFav = favoritesData[type]; // 獲取指定類型的所有收藏
      if (!typeFav) return []; // 若該類型無收藏，返回空陣列

      // 將每個類型的收藏項目轉換為元件
      return Object.entries(typeFav).flatMap(([id, notesObj]) => {
        // 獲取資料項目和其相關筆記
        const { item, notes } = getItemAndNotes(type, id);
        if (!item) return []; // 若找不到項目，返回空陣列

        // 處理該項目中被收藏的每一條筆記
        return Object.entries(notesObj)
          .filter(([noteIdx, favData]) => favData && favData.status) // 只處理狀態為真的收藏
          .map(([noteIdx, favData]) => {
            // 確保筆記索引是數字
            const noteIndex = parseInt(noteIdx, 10);
            // 獲取筆記內容，優先使用原始資料中的筆記，若無則使用收藏中保存的內容
            const noteContent = notes[noteIndex] || favData.content || "";
            return (
              <div
                key={`${type}-${id}-${noteIdx}`}
                className="mb-3 p-4 border shadow-sm w-full max-w-xl flex flex-col sm:flex-row sm:items-center relative justify-center"
              >
                <div className="flex-1 m-3">
                  <div className="font-bold text-base sm:text-lg mb-1">
                    {item.title || item.name}
                  </div>
                  <div className="text-sm break-words">{noteContent}</div>
                </div>
                <div className="sm:mt-0 sm:ml-4 flex-shrink-0">
                  <div className="absolute right-0 top-0 badge badge-info rounded-none">
                    {type}
                  </div>
                  <button
                    className="max-sm:ml-3 btn btn-xs btn-error"
                    onClick={() => handleRemoveFavorite(type, id, noteIdx)}
                  >
                    移除收藏
                  </button>
                </div>
              </div>
            );
          });
      });
    });
  }, [favoritesData]);
  if (collectItems.length === 0) {
    return (
      <>
        <div>尚未收藏任何內容</div>
        <Link
          to={"/info"}
          className="
          mt-5
                  inline-block 
                  bg-blue-500 
                  text-black 
                  dark:text-white
                  px-4 
                  py-2 
                  rounded-md 
                  dark:bg-blue-600 
                  transition 
                  duration-300
                "
        >
          立即收藏
        </Link>
      </>
    );
  }
  return (
    <div className="flex flex-col items-center w-full px-2">{collectItems}</div>
  );
}
