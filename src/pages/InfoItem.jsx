import React from "react";
import { useParams, Link } from "react-router-dom";
import { books, podcasts, youtubeVideos } from "../component/data";

const InfoItem = () => {
  const { type, id } = useParams();

  let item;
  if (type === "book") {
    item = books.find((b) => b.id === id);
  } else if (type === "youtube") {
    item = youtubeVideos.find((y) => y.id === id);
  } else if (type === "podcast") {
    item = podcasts.find((p) => p.id === id);
  }

  if (!item) {
    return <div className="text-center mt-10">找不到資料</div>;
  }

  // 書籍詳細頁
  if (type === "book") {
    return (
      <div className="max-w-xl mx-auto mt-10 card shadow-lg p-6">
        <img
          src={item.img}
          alt={item.title}
          className="w-40 h-60 object-cover mx-auto mb-4 rounded"
        />
        <h2 className="text-2xl font-bold mb-2 text-center">{item.title}</h2>
        <p className="mb-4">{item.summary}</p>
        <Link
          to={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary w-fit mx-auto m-3"
        >
          書店連結
        </Link>
        {item.moreLink && (
          <Link
            to={item.moreLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-fit mx-auto "
          >
            更多連結
          </Link>
        )}
      </div>
    );
  }

  // YouTube 詳細頁
  if (type === "youtube") {
    // 從 url 取出影片 ID
    let youtubeId = "";
    if (item.url) {
      const match = item.url.match(
        /(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{11})/
      );
      youtubeId = match ? match[1] : "";
    }
    return (
      <div className="max-w-2xl mx-auto mt-10 card shadow-lg p-6">
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={item.title}
            allowFullScreen
            className="w-full h-64 rounded"
          ></iframe>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-center">{item.title}</h2>
        <div className="mb-4">
          <ul className="list-disc pl-5">
            {item.hightlight?.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (type === "podcast") {
    // 動態產生 Apple Podcast embed 連結
    let embedUrl = "";
    if (item.url) {
      // 例：https://podcasts.apple.com/tw/podcast/2281-elon-musk/id360084272?i=1000696846801
      const match = item.url.match(
        /https:\/\/podcasts\.apple\.com\/([a-zA-Z-]+)\/podcast\/[^/]+\/id(\d+)\?i=(\d+)/
      );
      if (match) {
        const country = match[1];
        const podcastId = match[2];
        const episodeId = match[3];
        embedUrl = `https://embed.podcasts.apple.com/${country}/podcast/id${podcastId}?i=${episodeId}`;
      }
    }
    return (
      <div className="max-w-2xl mx-auto mt-10 card shadow-lg p-6">
        <div className="w-full mb-4">
          <iframe
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            frameBorder="0"
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
        <h2 className="text-2xl font-bold mb-2 text-center">{item.title}</h2>
        <div className="mb-4">
          <ul className="list-disc pl-5">
            {item.timestamps?.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

export default InfoItem;
