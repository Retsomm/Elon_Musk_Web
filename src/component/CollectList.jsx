import books from "../data/books.json";
import podcasts from "../data/podcasts.json";
import youtubes from "../data/youtubes.json";
import { useAllFavorites } from "../hooks/useFavorites";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const dataSourceMap = {
  book: {
    collection: books,
    titleField: "title",
  },
  youtube: {
    collection: youtubes,
    titleField: "title",
  },
  podcast: {
    collection: podcasts,
    titleField: "title",
  },
};

export default function CollectList() {
  const { favoritesData, removeFavorite } = useAllFavorites();

  const collectItems = useMemo(() => {
    if (!favoritesData || Object.keys(favoritesData).length === 0) {
      return [];
    }

    return ["book", "youtube", "podcast"].flatMap((type) => {
      const typeFav = favoritesData[type];
      if (!typeFav) return [];

      const { collection, titleField } = dataSourceMap[type];

      return Object.entries(typeFav).flatMap(([id, notesObj]) => {
        // 找出 item
        const item = collection.find((item) => item.id === id);
        if (!item) return [];

        // 直接渲染收藏內容
        return Object.entries(notesObj)
          .filter(([noteIdx, favData]) => favData && favData.status)
          .map(([noteIdx, favData]) => (
            <div
              key={`${type}-${id}-${noteIdx}`}
              className="mb-3 p-4 border shadow-sm w-full max-w-xl flex flex-col sm:flex-row sm:items-center relative justify-center"
            >
              <div className="flex-1 m-3">
                <div className="font-bold text-base sm:text-lg mb-1">
                  {item[titleField]}
                </div>
                <div className="text-sm break-words">{favData.content}</div>
              </div>
              <div className="sm:mt-0 sm:ml-4 flex-shrink-0">
                <div className="absolute right-0 top-0 badge badge-info rounded-none">
                  {type}
                </div>
                <button
                  className="max-sm:ml-3 btn btn-xs btn-error"
                  onClick={() => removeFavorite(type, id, noteIdx)}
                >
                  移除收藏
                </button>
              </div>
            </div>
          ));
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
  return <div className="flex flex-col items-center w-full px-2">{collectItems}</div>;
}