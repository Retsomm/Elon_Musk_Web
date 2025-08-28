import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import companies from "../component/companyData";
import MediaModal from "../component/MediaModal";

const getEmbedUrl = (url) => {
  if (!url || typeof url !== "string") return "";

  const videoPatterns = {
    youtube: {
      domains: ["youtube.com", "youtu.be", "youtube-nocookie.com"],
      getId: (url) => {
        const patterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
          /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
        ];
        for (const pattern of patterns) {
          const match = url.match(pattern);
          if (match) return match[1];
        }
        return null;
      },
      getEmbed: (id) =>
        `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&rel=0&modestbranding=1&fs=1&origin=${window.location.origin}`,
    },
    vimeo: {
      domains: ["vimeo.com"],
      getId: (url) => {
        const match = url.match(/vimeo\.com\/(\d+)/);
        return match ? match[1] : null;
      },
      getEmbed: (id) =>
        `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`,
    },
    dailymotion: {
      domains: ["dailymotion.com"],
      getId: (url) => {
        const match = url.match(/dailymotion\.com\/video\/([^?]+)/);
        return match ? match[1] : null;
      },
      getEmbed: (id) => `https://www.dailymotion.com/embed/video/${id}`,
    },
  };

  for (const [platform, config] of Object.entries(videoPatterns)) {
    if (config.domains.some((domain) => url.includes(domain))) {
      const videoId = config.getId(url);
      if (videoId) {
        return config.getEmbed(videoId);
      }
    }
  }

  return url;
};



function CompanyItem() {
  const { name } = useParams();
  const company = companies.find((c) => c.name === name);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (company && company.timeline && company.timeline.length > 0) {
      const firstEvent = company.timeline[0];
      if (firstEvent.media && firstEvent.media.url && !currentMedia) {
        try {
          const convertedUrl = getEmbedUrl(firstEvent.media.url);
          setCurrentMedia({
            type: firstEvent.media.type || "image",
            url: convertedUrl,
            event: firstEvent.event || "",
          });
        } catch (error) {
          console.error("URL 處理錯誤:", error);
        }
      }
    }
  }, [company, currentMedia]);

  const handleTimelineClick = (item) => {
    if (item && item.media && item.media.url) {
      try {
        const convertedUrl = getEmbedUrl(item.media.url);
        setCurrentMedia({
          type: item.media.type || "image",
          url: convertedUrl,
          event: item.event || "",
        });
        setModalOpen(true);
      } catch (error) {
        console.error("點擊事件處理錯誤:", error);
      }
    }
  };

  if (!company) return <div className="p-6">找不到公司資料</div>;

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto text-center">
        <MediaModal
          id="company_modal"
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setCurrentMedia(null);
          }}
          media={currentMedia}
        />
        <h1 className="text-3xl font-bold mb-4">{company.name}</h1>
        {/* 時間軸 */}
        <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
          {company.timeline?.map((item, idx) => (
            <li key={idx}>
              {idx !== 0 && <hr />}
              {idx % 2 === 1 ? (
                <>
                  <div
                    className="m-1 timeline-start mb-10 md:text-end max-sm:text-left hover:cursor-pointer transform 
                transition 
                duration-300 
                hover:scale-95 
                hover:shadow-xl"
                    onClick={() => item.media?.url && handleTimelineClick(item)}
                  >
                    <time className="font-mono italic">{item.year}</time>
                    <p className="text-lg font-black leading-loose">
                      {item.event}
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
                    onClick={() => item.media?.url && handleTimelineClick(item)}
                  >
                    <time className="font-mono italic">{item.year}</time>
                    <p className="text-lg font-black leading-loose">
                      {item.event}
                    </p>
                  </div>
                </>
              )}
              {idx !== (company.timeline?.length ?? 0) - 1 && <hr />}
            </li>
          ))}
        </ul>

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
