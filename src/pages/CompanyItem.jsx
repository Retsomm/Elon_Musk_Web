import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import companies from "../component/companyData"; // 匯入處理後的資料
const getEmbedUrl = (url) => {
  // 檢查是否為 YouTube 網址
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";

    // 處理 youtube.com/watch?v= 格式
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    }
    // 處理 youtu.be/ 格式
    else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }
    // 處理 youtube.com/embed/ 格式 - 需要轉換為 youtube-nocookie
    else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("embed/")[1]?.split("?")[0];
    }
    // 處理 youtube.com/v/ 格式
    else if (url.includes("youtube.com/v/")) {
      videoId = url.split("v/")[1]?.split("?")[0];
    }

    if (videoId) {
      // 使用 youtube-nocookie.com 來避免 X-Frame-Options 問題
      return `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&fs=1&origin=${window.location.origin}`;
    }
  }

  // 處理 Vimeo 網址
  if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("/")[0]?.split("?")[0];
    if (videoId) {
      return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
    }
  }

  // 處理 Dailymotion 網址
  if (url.includes("dailymotion.com")) {
    const videoId = url.split("video/")[1]?.split("?")[0];
    if (videoId) {
      return `https://www.dailymotion.com/embed/video/${videoId}`;
    }
  }

  // 如果都不符合，回傳原網址
  return url;
};

// 更新檢查影片網址的函式
const isVideoUrl = (url) => {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com") ||
    url.includes("dailymotion.com") ||
    url.includes("embed") ||
    url.includes("player.vimeo.com") ||
    url.includes("youtube-nocookie.com")
  );
};
const debugEmbedUrl = (original, converted) => {
  console.log("原始網址:", original);
  console.log("轉換後網址:", converted);
  console.log("是否為影片網址:", isVideoUrl(original));
};
// 型別定義

function CompanyItem() {
  const { name } = useParams();
  const company = companies.find((c) => c.name === name);
  const [currentMedia, setCurrentMedia] = useState(null);

  // 初始化 currentMedia 為第一個事件的 media
  useEffect(() => {
    if (company && company.timeline && company.timeline.length > 0) {
      const firstEvent = company.timeline[0];
      if (firstEvent.media && !currentMedia) {
        const convertedUrl = getEmbedUrl(firstEvent.media.url);
        debugEmbedUrl(firstEvent.media.url, convertedUrl);

        setCurrentMedia({
          type: firstEvent.media.type,
          url: convertedUrl,
          event: firstEvent.event,
        });
      }
    }
  }, [company]);

  // 點擊時間線項目時更新 currentMedia
  const handleTimelineClick = (item) => {
    if (item.media) {
      const convertedUrl = getEmbedUrl(item.media.url);
      debugEmbedUrl(item.media.url, convertedUrl);

      setCurrentMedia({
        type: item.media.type,
        url: convertedUrl,
        event: item.event,
      });
      // 觸發 modal
      document.getElementById("my_modal_7").checked = true;
    }
  };

  if (!company) return <div className="p-6">找不到公司資料</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto text-center">
        {/* Modal 結構 */}
        <input type="checkbox" id="my_modal_7" className="modal-toggle" />
        <div className="modal" role="dialog">
          <div className="modal-box flex justify-center items-center rounded">
            {currentMedia ? (
              currentMedia.type === "image" ? (
                <img
                  src={getEmbedUrl(currentMedia.url)}
                  alt={currentMedia.event || "media"}
                  className="w-fit sm:h-fit "
                  loading="lazy"
                />
              ) : (
                <div className="sm:h-full">
                  <iframe
                    src={getEmbedUrl(currentMedia.url)}
                    title={currentMedia.event || "media"}
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    frameBorder="0"
                    className="sm:h-full w-full rounded"
                  ></iframe>
                </div>
              )
            ) : (
              <p>無媒體內容</p>
            )}
          </div>
          <label
            className="modal-backdrop"
            htmlFor="my_modal_7"
            onClick={() => setCurrentMedia(null)}
          >
            Close
          </label>
        </div>
        <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
        {/* 時間軸 */}
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {company.timeline?.map((item, idx) => (
            <li key={idx}>
              {idx !== 0 && <hr />}
              {idx % 2 === 1 ? (
                <>
                  <label
                    htmlFor={item.media ? "my_modal_7" : undefined}
                    className="m-1 timeline-start mb-10 md:text-end max-sm:text-left hover:cursor-pointer transform 
                transition 
                duration-300 
                hover:scale-95 
                hover:shadow-xl"
                    onClick={() => handleTimelineClick(item)}
                  >
                    <time className="font-mono italic">{item.year}</time>
                    <p className="text-lg font-black leading-loose">
                      {item.event}
                    </p>
                  </label>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </>
              ) : (
                <>
                  <div className="timeline-middle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div
                    className="timeline-end md:mb-10 text-left hover:cursor-pointer transform 
                transition 
                duration-300 
                hover:scale-95 
                hover:shadow-xl"
                    onClick={() => handleTimelineClick(item)}
                  >
                    <label htmlFor="my_modal_7">
                      <time className="font-mono italic">{item.year}</time>
                      <p className="text-lg font-black leading-loose">
                        {item.event}
                      </p>
                    </label>
                  </div>
                </>
              )}
              {idx !== (company.timeline?.length ?? 0) - 1 && <hr />}
            </li>
          ))}
        </ul>
        {/* 公司產品 */}
        <h2 className="text-xl font-semibold mt-6 mb-2">主要產品</h2>
        <ul className="list">
          {company.products?.map((product, idx) => (
            <li
              key={idx}
              className="list flex flex-col p-3 items-center justify-between"
            >
              <p className="font-extrabold opacity-90 text-left leading-loose">
                {product.name}
              </p>
              <p className="font-semibold opacity-60 text-left leading-loose">
                {product.description}
              </p>
              {product.timeline && (
                <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical mt-5">
                  {product.timeline?.map((pt, pi) => (
                    <li key={pi}>
                      {pi !== 0 && <hr />}
                      {pi % 2 === 0 ? (
                        <>
                          <div className="timeline-start mb-10 md:text-end max-sm:text-left">
                            <time className="font-mono italic">{pt.year}</time>
                            <p className="text-md font-black leading-loose">
                              {pt.event}
                            </p>
                          </div>
                          <div className="timeline-middle">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <hr />
                        </>
                      ) : (
                        <>
                          <div className="timeline-middle">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="timeline-end md:mb-10 text-left">
                            <time className="font-mono italic">{pt.year}</time>
                            <p className="text-md font-black leading-loose">
                              {pt.event}
                            </p>
                          </div>
                        </>
                      )}
                      {pi !== (product.timeline?.length ?? 0) - 1 && <hr />}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        <Link to="/company" className="btn btn-primary w-fit m-3">
          上一頁
        </Link>
        <div
          className="tooltip tooltip-right w-fit mx-auto m-3"
          data-tip="前往外部網站"
        >
          <Link
            to={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary m-3"
          >
            官方網站
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CompanyItem;
