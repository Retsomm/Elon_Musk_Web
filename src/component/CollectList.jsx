import { books, podcasts, youtubeVideos } from "./data";
import { useAllFavorites } from "../hooks/useFavorites";
export default function CollectList() {
  const { favoritesData, removeFavorite } = useAllFavorites();
  //移除收藏
  const handleRemoveFavorite = async (type, id, noteIdx) => {
    await removeFavorite(type, id, noteIdx);
  };

  if (!favoritesData || Object.keys(favoritesData).length === 0) {
    return <div>尚未收藏任何內容</div>;
  }
  const collectItems = [];
  for (const type of ["book", "youtube", "podcast"]) {
    const typeFav = favoritesData[type];
    if (!typeFav) continue;
    for (const id in typeFav) {
      let item;
      let notes = [];
      if (type === "book") {
        item = books.find((b) => b.id === id);
        notes = item?.bookNote || [];
      }
      if (type === "youtube") {
        item = youtubeVideos.find((y) => y.id === id);
        notes = item?.hightlight || [];
      }
      if (type === "podcast") {
        item = podcasts.find((p) => p.id === id);
        notes = item?.timestamps || [];
      }
      if (!item) continue;

      let favIdxArr = [];
      if (Array.isArray(typeFav[id])) {
        favIdxArr = typeFav[id]
          .map((v, idx) => (v && v.status ? idx : null))
          .filter((v) => v !== null);
      } else {
        favIdxArr = Object.keys(typeFav[id]);
      }

      favIdxArr.forEach((noteIdx) => {
        let favData = Array.isArray(typeFav[id])
          ? typeFav[id][noteIdx]
          : typeFav[id][noteIdx];
        if (!favData || !favData.status) return;
        collectItems.push(
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
        );
      });
    }
  }

  return (
    <div className="flex flex-col items-center w-full px-2">{collectItems}</div>
  );
}
