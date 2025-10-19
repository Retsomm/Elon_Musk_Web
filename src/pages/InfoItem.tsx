import { useParams } from "react-router-dom";
import books from "../data/books.json";
import podcasts from "../data/podcasts.json";
import youtubeVideos from "../data/youtubes.json";
import FavoriteButton from "../component/FavoriteButton";
import { JSX } from "react";
/**
 * 媒體項目基本介面
 */
interface MediaItem {
  id: string;
  title: string;
  img?: string;
  url?: string;
  bookNote?: string[];
  highlight?: string[];
  timestamps?: string[];
}

/**
 * 媒體類型字面量
 */
type MediaType = "book" | "youtube" | "podcast";

/**
 * URL 參數介面
 */
type InfoItemParams = Record<string, string | undefined>;

/**
 * 資料映射配置介面
 */
interface DataMapConfig {
  source: MediaItem[];
  notesKey: keyof MediaItem;
  title: string;
}

/**
 * FavoriteButton 組件的 Props 介面
 */
interface FavoriteButtonProps {
  type: string;
  id: string;
  noteIdx: number;
  defaultContent: string;
  title: string;
}

/**
 * 資料映射類型
 */
type DataMap = Record<MediaType, DataMapConfig>;

/**
 * 詳細資訊頁面組件
 * 根據 URL 參數顯示特定媒體項目的詳細資訊
 * @returns JSX.Element
 */
const InfoItem = (): JSX.Element => {
  // React Router hook: 解構URL參數中的type和id
  const { type, id } = useParams<InfoItemParams>();

  // 參數驗證：確保 type 和 id 都存在
  if (!type || !id) {
    return <div className="text-center mt-10">參數錯誤：缺少類型或ID</div>;
  }

  // 驗證 type 是否為有效的媒體類型
  const isValidMediaType = (t: string): t is MediaType => {
    return ['book', 'youtube', 'podcast'].includes(t);
  };

  if (!isValidMediaType(type)) {
    return <div className="text-center mt-10">不支援的媒體類型：{type}</div>;
  }

  const dataMap: DataMap = {
    book: {
      source: books as MediaItem[],
      notesKey: "bookNote",
      title: "BookNotes",
    },
    youtube: {
      source: youtubeVideos as MediaItem[],
      notesKey: "highlight",
      title: "highlight",
    },
    podcast: {
      source: podcasts as MediaItem[],
      notesKey: "timestamps",
      title: "timestamps",
    },
  };

  // 物件解構: 從dataMap中取得對應類型的設定
  const { source, notesKey, title }: DataMapConfig = dataMap[type];

  // 陣列資料處理: 使用Array.find()方法根據id查找特定內容項目
  const item: MediaItem | undefined = source?.find(
    (i: MediaItem) => i.id === id
  );

  if (!item) {
    return <div className="text-center mt-10">找不到資料</div>;
  }

  /**
   * 條件渲染函數: 根據不同內容類型渲染專屬UI
   * @returns JSX.Element | null
   */
  const renderTypeSpecificContent = (): JSX.Element | null => {
    switch (type) {
      case "book":
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

      case "youtube": {
        const youtubeId: string =
          item.url?.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/)?.[1] || "";

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
      }

      case "podcast": {
        const match: RegExpMatchArray | null =
          item.url?.match(
            /https:\/\/podcasts\.apple\.com\/([a-zA-Z-]+)\/podcast\/[^/]+\/id(\d+)\?i=(\d+)/
          ) || null;
          
        const embedUrl: string = match
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

      default:
        return null;
    }
  };

  // 陣列資料處理: 渲染筆記/亮點/時間戳列表
  const renderNotesList = (): JSX.Element | null => {
    const notes: string[] | undefined = item[notesKey] as string[] | undefined;
    
    if (!notes || notes.length === 0) return null;

    return (
      <>
        {title && (
          <h3 className="text-2xl font-bold mb-2 text-center">{title}</h3>
        )}
        <ul className="list shadow-md">
          {notes.map((note: string, index: number) => (
            <div key={index}>
              <li className="list flex p-3 items-center justify-between">
                <div className="font-semibold opacity-60 text-left leading-loose">
                  {note}
                </div>
                {/* 使用明確的 Props 類型 */}
                <FavoriteButton
                  type={type}
                  id={id}
                  noteIdx={index}
                  defaultContent={note}
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

  const maxWidth: string = type === "book" ? "max-w-xl" : "max-w-2xl";

  return (
    <div className={`${maxWidth} mx-auto mt-16 card p-6`}>
      {renderTypeSpecificContent()}
      {renderNotesList()}
    </div>
  );
};

export default InfoItem;