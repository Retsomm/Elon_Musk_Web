import { books, podcasts, youtubeVideos } from "./data";
import { useAllFavorites } from "../hooks/useFavorites";

const getItemAndNotes = (type, id) => {
  if (type === "book") {
    const item = books.find((b) => b.id === id);
    return { item, notes: item?.bookNote || [] };
  }
  if (type === "youtube") {
    const item = youtubeVideos.find((y) => y.id === id);
    return { item, notes: item?.hightlight || [] };
  }
  if (type === "podcast") {
    const item = podcasts.find((p) => p.id === id);
    return { item, notes: item?.timestamps || [] };
  }
  return { item: null, notes: [] };
};

export default function CollectList() {
  const { favoritesData, removeFavorite } = useAllFavorites();

  const handleRemoveFavorite = async (type, id, noteIdx) => {
    await removeFavorite(type, id, noteIdx);
  };

  if (!favoritesData || Object.keys(favoritesData).length === 0) {
    return <div>尚未收藏任何內容</div>;
  }

  const collectItems = ["book", "youtube", "podcast"].flatMap((type) => {
    const typeFav = favoritesData[type];
    if (!typeFav) return [];

    return Object.entries(typeFav).flatMap(([id, notesObj]) => {
      const { item, notes } = getItemAndNotes(type, id);
      if (!item) return [];

      return Object.entries(notesObj)
        .filter(([noteIdx, favData]) => favData && favData.status)
        .map(([noteIdx, favData]) => (
          <div
            key={`${type}-${id}-${noteIdx}`}
            className="mb-3 p-4 border shadow-sm w-full max-w-xl flex flex-col sm:flex-row sm:items-center relative justify-center"
          >
            <div className="flex-1 m-3">
              <div className="font-bold text-base sm:text-lg mb-1">
                {item.title || item.name}
              </div>
              <div className="text-sm break-words">
                {notes[noteIdx] || favData.content}
              </div>
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
        ));
    });
  });

  return (
    <div className="flex flex-col items-center w-full px-2">{collectItems}</div>
  );
}
