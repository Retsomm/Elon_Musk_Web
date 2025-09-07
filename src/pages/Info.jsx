import { useState, useEffect } from "react";
import books from "../data/books";
import podcasts from "../data/podcasts";
import youtubeVideos from "../data/youtubes";
import { Link } from "react-router-dom";

// Skeleton元件：統一骨架呈現
function InfoSkeleton({ type, count }) {
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

// 通用 item 渲染器
function renderInfoItem(item, type) {
  // type: "book" | "youtube" | "podcast"
  let imgClass =
    type === "book"
      ? "w-32 h-48 object-cover mb-2 rounded"
      : type === "youtube"
      ? "w-full h-40 object-cover rounded mb-2"
      : "w-16 h-16 object-cover rounded mr-4";
  let width = type === "book" ? 128 : type === "youtube" ? 320 : 64;
  let height = type === "book" ? 192 : type === "youtube" ? 160 : 64;
  let link = `/info/${type}/${item.id}`;

  if (type === "podcast") {
    return (
      <li key={item.url} className="card w-1/4 shadow-md">
        <div className="card-body flex items-center">
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
      </li>
    );
  } else {
    return (
      <div
        key={item.url}
        className={
          type === "youtube"
            ? "card w-80 shadow-md hover:shadow-lg mx-auto"
            : "card w-70 shadow-md hover:shadow-lg mx-auto"
        }
      >
        <div className="card-body items-center text-center">
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
      </div>
    );
  }
}

// 高階 Section 元件
function InfoSection({ title, isLoading, items, type }) {
  // type: "book" | "youtube" | "podcast"
  const skeletonCount = type === "book" ? 2 : type === "youtube" ? 6 : 3;
  const SectionTag = type === "podcast" ? "ul" : "div";

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 text-center">{title}</h2>
      <SectionTag className="flex flex-wrap justify-center gap-4">
        {isLoading ? (
          <InfoSkeleton type={type} count={skeletonCount} />
        ) : (
          items.map((item) => renderInfoItem(item, type))
        )}
      </SectionTag>
    </div>
  );
}

function Info() {
  const [data, setData] = useState({
    books: [],
    youtubeVideos: [],
    podcasts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");

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
      {/* 篩選表單 */}
      <form className="filter flex justify-center mt-10">
        <input
          className="btn btn-square"
          type="reset"
          value="×"
          onClick={() => setFilter("")}
        />
        <input
          className="btn"
          type="radio"
          name="frameworks"
          aria-label="Books"
          checked={filter === "books"}
          onChange={() => setFilter("books")}
        />
        <input
          className="btn"
          type="radio"
          name="frameworks"
          aria-label="Youtube"
          checked={filter === "youtube"}
          onChange={() => setFilter("youtube")}
        />
        <input
          className="btn"
          type="radio"
          name="frameworks"
          aria-label="Podcasts"
          checked={filter === "podcasts"}
          onChange={() => setFilter("podcasts")}
        />
      </form>

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
