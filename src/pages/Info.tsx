import { useState, useEffect, JSX } from "react";
import books from "../data/books.json";
import podcasts from "../data/podcasts.json";
import youtubeVideos from "../data/youtubes.json";
import { Link } from "react-router-dom";
/**
 * 媒體項目基本介面
 */
interface BaseMediaItem {
  id: string;
  title: string;
  img?: string;
  url: string;
}
/**
 * 書籍項目介面
 */
interface BookItem extends BaseMediaItem {
  author?: string;
  publishedDate?: string;
}
/**
 * YouTube 影片項目介面
 */
interface YouTubeItem extends BaseMediaItem {
  channel?: string;
  duration?: string;
  publishedDate?: string;
}
/**
 * Podcast 項目介面
 */
interface PodcastItem extends BaseMediaItem {
  host?: string;
  duration?: string;
  publishedDate?: string;
}
/**
 * 媒體類型聯合類型
 */
type MediaItem = BookItem | YouTubeItem | PodcastItem;
/**
 * 媒體類型字面量
 */
type MediaType = "book" | "youtube" | "podcast";
/**
 * 應用程式資料狀態介面
 */
interface AppData {
  books: BookItem[];
  youtubeVideos: YouTubeItem[];
  podcasts: PodcastItem[];
}
/**
 * Skeleton 組件的 Props 介面
 */
interface InfoSkeletonProps {
  type: MediaType;
  count: number;
}
/**
 * InfoSection 組件的 Props 介面
 */
interface InfoSectionProps {
  title: string;
  isLoading: boolean;
  items: MediaItem[];
  type: MediaType;
}
/**
 * 媒體項目配置介面
 */
interface MediaConfig {
  imgClass: string;
  width: number;
  height: number;
  cardClass: string;
  containerClass: string;
}
/**
 * Skeleton元件：統一骨架呈現
 * @param props - 包含類型和數量的屬性
 * @returns JSX.Element
 */

// Skeleton元件：統一骨架呈現
function InfoSkeleton({ type, count }: InfoSkeletonProps): JSX.Element {
  // type: "book" | "youtube" | "podcast"
  return (
    <>
      {[...Array(count)].map((_, idx) =>
        type === "podcast" ? (
          <li className="card w-full shadow-md" key={idx}>
            <div className="card-body flex items-center">
              <div className="skeleton w-16 h-16 rounded mr-4"></div>
              <div className="skeleton h-6 w-3/4"></div>
            </div>
          </li>
        ) : (
          <div
            key={idx}
            className={
              type === "youtube"
                ? "card w-80 shadow-md mx-auto"
                : "card shadow-md"
            }
          >
            <div className="card-body items-center">
              <div
                className={
                  type === "book"
                    ? "skeleton h-48 w-32 mb-2"
                    : "skeleton h-40 w-full mb-2"
                }
              ></div>
              <div className="skeleton h-6 w-3/4"></div>
            </div>
          </div>
        )
      )}
    </>
  );
}
/**
 * 通用 item 渲染器
 * @param item - 媒體項目資料
 * @param type - 媒體類型
 * @returns JSX.Element
 */
// 通用 item 渲染器
function renderInfoItem(item: MediaItem, type: MediaType): JSX.Element {
  // type: "book" | "youtube" | "podcast"
  const config: Record<MediaType, MediaConfig> = {
    book: {
      imgClass: "w-32 h-48 object-cover mb-2 rounded",
      width: 128,
      height: 192,
      cardClass: "card w-70 shadow-md hover:shadow-lg mx-auto",
      containerClass: "card-body items-center text-center",
    },
    youtube: {
      imgClass: "w-full h-40 object-cover rounded mb-2",
      width: 320,
      height: 160,
      cardClass: "card w-80 shadow-md hover:shadow-lg mx-auto",
      containerClass: "card-body items-center text-center",
    },
    podcast: {
      imgClass: "w-16 h-16 object-cover rounded mr-4",
      width: 64,
      height: 64,
      cardClass: "card sm:w-1/4 shadow-md",
      containerClass: "card-body flex items-center",
    },
  };

  const { imgClass, width, height, cardClass, containerClass } = config[type];
  const link = `/info/${type}/${item.id}`;
  const ContainerTag = type === "podcast" ? "li" : "div";

  return (
    <ContainerTag key={item.url} className={cardClass}>
      <div className={containerClass}>
        {item.img && (
          <img
            src={item.img}
            alt={item.title}
            width={width}
            height={height}
            className={imgClass}
            loading="lazy"
          />
        )}
        <p className="text-lg font-medium mb-2 leading-loose">{item.title}</p>
        <Link to={link} className="btn btn-primary w-fit">
          查看更多
        </Link>
      </div>
    </ContainerTag>
  );
}
/**
 * Section 元件
 * @param props - 包含標題、載入狀態、項目和類型的屬性
 * @returns JSX.Element
 */
// Section 元件
function InfoSection({
  title,
  isLoading,
  items,
  type,
}: InfoSectionProps): JSX.Element {
  const skeletonCount: number =
    type === "book" ? 2 : type === "youtube" ? 6 : 3;
  const SectionTag = type === "podcast" ? "ul" : "div";

  return (
    <div>
      <h2 className="text-3xl font-bold my-4 text-center">{title}</h2>
      <SectionTag className="flex flex-wrap justify-center gap-4">
        {isLoading ? (
          <InfoSkeleton type={type} count={skeletonCount} />
        ) : (
          items.map((item: MediaItem) => renderInfoItem(item, type))
        )}
      </SectionTag>
    </div>
  );
}
/**
 * 資訊頁面主組件
 * 顯示書籍、YouTube 影片和 Podcast 的資訊
 * @returns JSX.Element
 */
function Info(): JSX.Element {
  const [data, setData] = useState<AppData>({
    books: [],
    youtubeVideos: [],
    podcasts: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<String>("");
  useEffect((): void => {
    setData({
      books: books as BookItem[],
      youtubeVideos: youtubeVideos as YouTubeItem[],
      podcasts: podcasts as PodcastItem[],
    });
    setIsLoading(false);
  }, []);
  /**
   * 處理篩選器重置
   */
  const handleResetFilter = (): void => {
    setFilter("");
  };
  /**
   * 處理篩選器變更
   * @param filterType - 要設定的篩選類型
   */
  const handleFilterChange = (filterType: string): void => {
    setFilter(filterType);
  };
  return (
    <div className="mx-auto mt-16">
      {/* 篩選表單 */}
      <div className="sticky top-20 z-50 flex justify-center">
        <form className="filter flex justify-center m-4 gap-2">
          <input
            className="btn btn-square"
            type="reset"
            value="×"
            onClick={handleResetFilter}
          />
          <input
            className="btn"
            type="radio"
            name="frameworks"
            aria-label="Books"
            checked={filter === "books"}
            onChange={() => handleFilterChange("books")}
          />
          <input
            className="btn"
            type="radio"
            name="frameworks"
            aria-label="Youtube"
            checked={filter === "youtube"}
            onChange={() => handleFilterChange("youtube")}
          />
          <input
            className="btn"
            type="radio"
            name="frameworks"
            aria-label="Podcasts"
            checked={filter === "podcasts"}
            onChange={() => handleFilterChange("podcasts")}
          />
        </form>
      </div>
      {(filter === "" || filter === "books") && (
        <InfoSection
          title="Books"
          items={data.books}
          isLoading={isLoading}
          type="book"
        />
      )}
      {(filter === "" || filter === "youtube") && (
        <InfoSection
          title="YouTube"
          items={data.youtubeVideos}
          isLoading={isLoading}
          type="youtube"
        />
      )}
      {(filter === "" || filter === "podcasts") && (
        <InfoSection
          title="Podcast"
          items={data.podcasts}
          isLoading={isLoading}
          type="podcast"
        />
      )}
    </div>
  );
}

export default Info;
