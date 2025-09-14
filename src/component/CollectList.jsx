import { useAllFavorites } from "../hooks/useFavorites";
import { useMemo } from "react";
import { Link } from "react-router-dom";

function CollectItem({ item, onRemove }) {
  return (
    <div
      key={item.id}
      className="mb-3 p-4 border shadow-sm w-full max-w-xl flex flex-col relative justify-center"
    >
      <div className="flex-1 m-3">
        <div className="font-bold text-base sm:text-lg mb-1">
          {item.title || `${item.type} - ${item.itemId}`}
        </div>
        <div className="text-sm break-words">{item.content}</div>
        {item.createdAt && (
          <div className="text-xs text-gray-500 mt-2">
            {new Date(item.createdAt).toLocaleDateString()}
          </div>
        )}
      </div>
      <div className="sm:mt-0 sm:ml-4 flex-shrink-0">
        <div className="absolute right-0 top-0 badge badge-info rounded-none">
          {item.type}
        </div>
        <button
          className="max-sm:ml-3 btn btn-xs btn-error"
          onClick={() => onRemove(item.id)} // 直接傳遞 ID
        >
          移除收藏
        </button>
      </div>
    </div>
  );
}

export default function CollectList() {
  const { favoritesData, removeFavorite } = useAllFavorites();

  const collectItems = useMemo(() => {
    if (!Array.isArray(favoritesData) || favoritesData.length === 0) {
      return [];
    }

    return favoritesData
      .filter(item => item.status)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(item => (
        <CollectItem
          key={item.id}
          item={item}
          onRemove={removeFavorite} 
        />
      ));
  }, [favoritesData, removeFavorite]);

  if (collectItems.length === 0) {
    return (
      <>
        <div>尚未收藏任何內容</div>
        <Link
          to={"/info"}
          className="mt-5 inline-block bg-blue-500 text-black dark:text-white px-4 py-2 rounded-md dark:bg-blue-600 transition duration-300"
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