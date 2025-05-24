import React, { useState, useEffect } from "react";
import { books, podcasts, youtubeVideos } from "../component/data";
import { Link, useNavigate } from "react-router-dom";
const Info = () => {
  const [data, setData] = useState({
    books: [],
    youtubeVideos: [],
    podcasts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    // 模擬動態抓取資料，實際上可替換為 API 呼叫
    setTimeout(() => {
      setData({ books, youtubeVideos, podcasts });
      setIsLoading(false);
    }, 1000); // 模擬 1 秒延遲
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <BookSection title="Books" items={data.books} isLoading={isLoading} />
      <YoutubeSection
        title="YouTube"
        items={data.youtubeVideos}
        isLoading={isLoading}
      />
      <PodcastSection
        title="Podcast"
        items={data.podcasts}
        isLoading={isLoading}
      />
    </div>
  );
};

const BookSection = ({ title, items, isLoading }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            className="card shadow-md" // 移除 w-80 和 mx-auto
            key={`book-skeleton-${index}`}
          >
            <div className="card-body items-center">
              <div className="skeleton h-48 w-32 mb-2"></div>
              <div className="skeleton h-6 w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.url}
            className="card w-80 shadow-md hover:shadow-lg mx-auto"
          >
            <div className="card-body items-center text-center">
              <img
                src={item.img}
                alt={item.alt}
                width="128"
                height="192"
                className="w-32 h-48 object-cover mb-2 rounded"
                loading="lazy"
              />
              <p className="text-lg font-medium leading-loose">{item.title}</p>

              <Link
                to={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-fit"
              >
                書店連結
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const YoutubeSection = ({ title, items, isLoading }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
    {isLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(4)].map((_, index) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                to={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-fit"
              >
                觀看影片
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const PodcastSection = ({ title, items, isLoading }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
    {isLoading ? (
      <ul className="space-y-4 max-w-2xl mx-auto">
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
      <ul className="space-y-4 max-w-2xl mx-auto">
        {items.map((item) => (
          <li key={item.url} className="card w-full shadow-md">
            <div className="card-body flex items-center">
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
                to={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary w-fit"
              >
                收聽廣播
              </Link>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Info;
