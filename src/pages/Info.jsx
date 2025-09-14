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
  const config = {
    book: {
      imgClass: "w-32 h-48 object-cover mb-2 rounded",
      width: 128,
      height: 192,
      cardClass: "card w-70 shadow-md hover:shadow-lg mx-auto",
      containerClass: "card-body items-center text-center"
    },
    youtube: {
      imgClass: "w-full h-40 object-cover rounded mb-2",
      width: 320,
      height: 160,
      cardClass: "card w-80 shadow-md hover:shadow-lg mx-auto",
      containerClass: "card-body items-center text-center"
    },
    podcast: {
      imgClass: "w-16 h-16 object-cover rounded mr-4",
      width: 64,
      height: 64,
      cardClass: "card sm:w-1/4 shadow-md",
      containerClass: "card-body flex items-center"
    }
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

// Section 元件
function InfoSection({ title, isLoading, items, type }) {
  // type: "book" | "youtube" | "podcast"
  const skeletonCount = type === "book" ? 2 : type === "youtube" ? 6 : 3;
  const SectionTag = type === "podcast" ? "ul" : "div";

  return (
    <div>
      <h2 className="text-3xl font-bold my-4 text-center">{title}</h2>
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
      books: books,
      youtubeVideos: youtubeVideos,
      podcasts: podcasts,
    });
    setIsLoading(false);
  }, []);

  return (
    <div className="mx-auto mt-16">
      {/* 篩選表單 */}
      <div className="sticky top-20 z-50 flex justify-center">
        <form className="filter flex justify-center m-4 gap-2">
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
