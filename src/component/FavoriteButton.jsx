import { useFavoriteItem } from "../hooks/useFavorites";

/**
 * FavoriteButton 元件 - 負責顯示和處理收藏功能
 * @param {string} type - 收藏項目的類型 (例如: 'article', 'note', 'product')
 * @param {string|number} id - 收藏項目的唯一識別碼
 * @param {number} noteIdx - 筆記索引 (如果適用)
 * @param {string} defaultContent - 收藏項目的預設內容，預設為空字串
 * @returns {JSX.Element} 渲染收藏按鈕
 */
function FavoriteButton({ type, id, noteIdx, defaultContent = "", title }) {
  /**
   * 使用自定義 Hook 處理收藏功能
   * - toggleFavorite: 切換收藏狀態的函式，會在點擊按鈕時調用
   * - isFavorited: 布林值，表示當前項目是否已被收藏
   *
   * useFavoriteItem Hook 負責:
   * 1. 從資料庫或狀態管理中檢查項目是否已收藏
   * 2. 提供切換收藏狀態的方法，可能涉及資料庫操作
   * 3. 管理收藏項目的狀態，包括對象資料處理
   */
  const { toggleFavorite, isFavorited } = useFavoriteItem(
    type,
    id,
    noteIdx,
    defaultContent,
    title
  );

  return (
    <>
      <button
        className="btn btn-square btn-ghost bg-transparent hover:bg-transparent"
        onClick={toggleFavorite}
      >
        {/* 條件渲染: 根據 isFavorited 狀態顯示不同的心形圖示 */}
        {isFavorited ? (
          // 已收藏狀態 - 實心紅色愛心
          <svg
            className="size-[1.2em] text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="red"
              stroke="red"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </g>
          </svg>
        ) : (
          // 未收藏狀態 - 空心愛心
          <svg
            className="size-[1.2em]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </g>
          </svg>
        )}
      </button>
    </>
  );
}

export default FavoriteButton;
