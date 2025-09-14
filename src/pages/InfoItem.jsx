import { useParams } from "react-router-dom";
import books from "../data/books";
import podcasts from "../data/podcasts";
import youtubeVideos from "../data/youtubes";
import FavoriteButton from "../component/FavoriteButton";

const InfoItem = () => {
  // React Router hook: 解構URL參數中的type和id
  // type可能是'book', 'youtube', 或'podcast'
  // id是該內容的唯一識別符
  const { type, id } = useParams();
  // 物件資料處理: 使用物件映射表統一三種不同內容類型的資料提取邏輯
  // 每種類型包含:
  // - source: 資料來源陣列
  // - notesKey: 在物件中存儲筆記/亮點的屬性名稱
  // - title: 筆記區塊的標題
  const dataMap = {
    book: {
      // 處理不同資料結構: 優先使用books.books，若不存在則使用books整體
      source: books,
      notesKey: "bookNote",
      title: "BookNotes",
    },
    youtube: {
      source: youtubeVideos,
      notesKey: "highlight",
      title: "highlight",
    },
    podcast: {
      source: podcasts,
      notesKey: "timestamps",
      title: "timestamps",
    },
  };

  // 物件解構: 從dataMap中取得對應類型的設定
  // 使用||運算符提供預設值，防止type不存在於dataMap中
  const { source, notesKey, title } = dataMap[type] || {};

  // 陣列資料處理: 使用Array.find()方法根據id查找特定內容項目
  // 這是O(n)時間複雜度的搜尋操作
  const item = source?.find((i) => i.id === id);

  if (!item) {
    return <div className="text-center mt-10">找不到資料</div>;
  }
  // 條件渲染函數: 根據不同內容類型渲染專屬UI
  const renderTypeSpecificContent = () => {
    if (type === "book") {
      return (
        <>
          <img
            src={item.img}
            alt={item.title}
            className="w-40 h-60 object-cover mx-auto mb-4 rounded"
          />
          <h2 className="text-2xl font-bold mb-2 text-center leading-loose">
            {item.title}
          </h2>
          <div
            className="tooltip tooltip-right w-fit mx-auto m-3"
            data-tip="前往外部網站"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              書店連結
            </a>
          </div>
        </>
      );
    } else if (type === "youtube") {
      // 如果 item.url 是 null 或 undefined，youtubeId 保持為空字符串
      const youtubeId =
        item.url?.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/)?.[1] ||
        "";

      return (
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={item.title}
            allowFullScreen
            className="w-full h-64 rounded"
          ></iframe>
        </div>
      );
    } else if (type === "podcast") {
      // 字串處理: 使用正則表達式從Apple Podcast URL提取國家代碼和ID
      // 用於構建嵌入式播放器URL
      const match = item.url?.match(
        /https:\/\/podcasts\.apple\.com\/([a-zA-Z-]+)\/podcast\/[^/]+\/id(\d+)\?i=(\d+)/
      );
      const embedUrl = match
        ? `https://embed.podcasts.apple.com/${match[1]}/podcast/id${match[2]}?i=${match[3]}`
        : "";

      return (
        <>
          <div className="w-full mb-4">
            <iframe
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              
              height="175"
              style={{
                width: "100%",
                maxWidth: "660px",
                overflow: "hidden",
                borderRadius: "10px",
              }}
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={embedUrl}
            ></iframe>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center leading-loose">
            {item.title}
          </h2>
        </>
      );
    }
  };
  // 陣列資料處理: 渲染筆記/亮點/時間戳列表
  const renderNotesList = () => {
    // 使用前面解構的notesKey從item中動態獲取筆記資料
    const notes = item[notesKey];
    // 陣列判空邏輯: 檢查notes是否存在且非空陣列
    if (!notes || notes.length === 0) return null;
    return (
      <>
        {/* 條件渲染: 僅當title存在時才顯示標題 */}
        {title && (
          <h3 className="text-2xl font-bold mb-2 text-center">{title}</h3>
        )}
        <ul className="list shadow-md">
          {/* 陣列迭代: 使用map()方法遍歷並渲染每條筆記 */}
          {notes.map((t, i) => (
            <div key={i}>
              <li className="list flex p-3 items-center justify-between">
                <div className="font-semibold opacity-60 text-left leading-loose">
                  {t}
                </div>
                {/* 傳遞屬性給子組件: 包括類型、ID、筆記索引和內容 */}
                <FavoriteButton
                  type={type}
                  id={String(id)}
                  noteIdx={i}
                  defaultContent={t}
                  title={item.title || `${type} - ${id}`}
                />
              </li>
              <div className="divider m-0"></div>
            </div>
          ))}
        </ul>
      </>
    );
  };
  // 三元運算符: 根據內容類型決定不同的最大寬度
  const maxWidth = type === "book" ? "max-w-xl" : "max-w-2xl";
  return (
    <div className={`${maxWidth} mx-auto mt-16 card p-6`}>
      {renderTypeSpecificContent()}
      {renderNotesList()}
    </div>
  );
};

export default InfoItem;
