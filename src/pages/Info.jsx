import { useState, useEffect } from "react"; // 引入 React hooks 用於狀態管理和副作用處理
import books from "../data/book"; // 引入書籍資料集
import podcasts from "../data/podcasts"; // 引入播客資料集
import youtubeVideos from "../data/youtube"; // 引入 YouTube 視頻資料集
import { Link } from "react-router-dom"; // 引入用於頁面導航的 Link 組件

function Info() {
  // 使用 useState 初始化資料狀態，設定三種資料類型的初始空陣列
  const [data, setData] = useState({
    books: [], // 存放書籍資料的陣列
    youtubeVideos: [], // 存放 YouTube 視頻資料的陣列
    podcasts: [], // 存放播客資料的陣列
  });
  // 追蹤資料載入狀態的 state
  const [isLoading, setIsLoading] = useState(true);
  // 追蹤當前篩選條件的 state
  const [filter, setFilter] = useState("");

  // useEffect 在組件掛載時執行一次，負責資料載入
  useEffect(() => {
    setData({
      books: books.books || books,
      youtubeVideos: youtubeVideos.youtubeVideos || youtubeVideos,
      podcasts: podcasts.podcasts || podcasts,
    });
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 篩選表單 - 使用 radio buttons 來切換不同資料類型的顯示 */}
      <form className="filter flex justify-center mt-10">
        {/* 重設按鈕 - 清除所有篩選條件 */}
        <input
          className="btn btn-square"
          type="reset"
          value="×"
          onClick={() => setFilter("")} // 點擊時將篩選條件設為空字串
        />
        {/* 書籍篩選按鈕 */}
        <input
          className="btn"
          type="radio"
          name="frameworks"
          aria-label="Books"
          checked={filter === "books"} // 根據當前篩選狀態決定是否選中
          onChange={() => setFilter("books")} // 點擊時更新篩選狀態
        />
        {/* YouTube 篩選按鈕 */}
        <input
          className="btn"
          type="radio"
          name="frameworks"
          aria-label="Youtube"
          checked={filter === "youtube"}
          onChange={() => setFilter("youtube")}
        />
        {/* 播客篩選按鈕 */}
        <input
          className="btn"
          type="radio"
          name="frameworks"
          aria-label="Podcasts"
          checked={filter === "podcasts"}
          onChange={() => setFilter("podcasts")}
        />
      </form>

      {/* 條件渲染：當篩選為空或選擇了 books 時顯示書籍區塊 */}
      {(filter === "" || filter === "books") && (
        <BookSection title="Books" items={data.books} isLoading={isLoading} />
      )}
      {/* 條件渲染：當篩選為空或選擇了 youtube 時顯示 YouTube 區塊 */}
      {(filter === "" || filter === "youtube") && (
        <YoutubeSection
          title="YouTube"
          items={data.youtubeVideos}
          isLoading={isLoading}
        />
      )}
      {/* 條件渲染：當篩選為空或選擇了 podcasts 時顯示播客區塊 */}
      {(filter === "" || filter === "podcasts") && (
        <PodcastSection
          title="Podcast"
          items={data.podcasts}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

function BookSection({ title, items, isLoading }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
      {isLoading ? (
        // 載入狀態下顯示骨架屏佔位元素
        <div className="flex flex-wrap justify-center gap-4">
          {/* 使用 Array 構造器和展開運算符創建長度為 2 的陣列，用於生成多個骨架元素 */}
          {[...Array(2)].map((_, index) => (
            <div className="card shadow-md" key={`book-skeleton-${index}`}>
              <div className="card-body items-center">
                <div className="skeleton h-48 w-32 mb-2"></div>
                <div className="skeleton h-6 w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 資料載入完成後顯示書籍列表
        <div className="flex flex-wrap justify-center gap-4">
          {/* 使用 map 方法遍歷 items 陣列，為每個書籍元素創建卡片 */}
          {items.map((item) => (
            <div
              key={item.url} // 使用 URL 作為唯一鍵值
              className="card w-70 shadow-md hover:shadow-lg mx-auto"
            >
              <div className="card-body items-center text-center">
                <img
                  src={item.img}
                  alt={item.alt}
                  width="128"
                  height="192"
                  className="w-32 h-48 object-cover mb-2 rounded"
                  loading="lazy" // 懶加載圖片以優化效能
                />
                <p className="text-lg font-medium leading-loose">
                  {item.title}
                </p>

                {/* 使用 Link 組件創建到詳情頁的導航連結，使用動態路由參數 */}
                <Link
                  to={`/info/book/${item.id}`}
                  className="btn btn-primary w-fit"
                >
                  查看更多
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YoutubeSection({ title, items, isLoading }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
      {isLoading ? (
        // 載入狀態下顯示骨架屏
        <div className="flex flex-wrap justify-center gap-4">
          {/* 創建 6 個 YouTube 影片的骨架元素 */}
          {[...Array(6)].map((_, index) => (
            <div
              className="card w-80 shadow-md mx-auto"
              key={`youtube-skeleton-${index}`}
            >
              <div className="card-body items-center">
                <div className="skeleton h-40 w-full mb-2"></div>
                <div className="skeleton h-6 w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 資料載入完成顯示 YouTube 視頻列表
        <div className="flex flex-wrap justify-center gap-4">
          {/* 映射 items 陣列到視頻卡片元素 */}
          {items.map((item) => (
            <div
              key={item.url}
              className="card w-80 shadow-md hover:shadow-lg mx-auto"
            >
              <div className="card-body items-center text-center">
                <img
                  src={item.img}
                  alt={item.title}
                  width="320"
                  height="160"
                  className="w-full h-40 object-cover rounded mb-2"
                  loading="lazy"
                />
                <p className="text-lg font-medium mb-2 leading-loose">
                  {item.title}
                </p>

                <Link
                  to={`/info/youtube/${item.id}`}
                  className="btn btn-primary w-fit"
                >
                  查看更多
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PodcastSection({ title, items, isLoading }) {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
      {isLoading ? (
        // 載入狀態下顯示骨架屏
        <ul className="flex flex-wrap justify-center gap-4">
          {/* 創建 3 個播客的骨架元素 */}
          {[...Array(3)].map((_, index) => (
            <li
              className="card w-full shadow-md"
              key={`podcast-skeleton-${index}`}
            >
              <div className="card-body flex items-center">
                <div className="skeleton w-16 h-16 rounded mr-4"></div>
                <div className="skeleton h-6 w-3/4"></div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        // 資料載入完成顯示播客列表
        <ul className="flex flex-wrap justify-center gap-4">
          {/* 映射 items 陣列到播客列表項 */}
          {items.map((item) => (
            <li key={item.url} className="card w-1/4 shadow-md">
              <div className="card-body flex items-center">
                {/* 條件渲染圖片，若 item.img 存在則顯示 */}
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.title}
                    width="64"
                    height="64"
                    className="w-16 h-16 object-cover rounded mr-4"
                    loading="lazy"
                  />
                )}

                <p className="text-lg font-medium mb-2 leading-loose">
                  {item.title}
                </p>

                <Link
                  to={`/info/podcast/${item.id}`}
                  className="btn btn-primary w-fit"
                >
                  查看更多
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Info;
