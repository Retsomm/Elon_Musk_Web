import React from "react";

function MediaModal({ id, open, onClose, media }) {
  // 檢查 media 是否為有效物件且有 url 屬性
  const hasValidMedia = media && typeof media === "object" && media.url;

  return (
    <>
      <input
        type="checkbox"
        id={id}
        className="modal-toggle"
        checked={open}
        readOnly
      />
      <div className={`modal ${open ? "modal-open" : ""}`} role="dialog">
        <div className="modal-box flex justify-center items-center rounded max-h-[80vh] overflow-auto">
          {hasValidMedia ? (
            media.type === "image" ? (
              <img
                src={media.url}
                alt={media.event || "media"}
                className="w-fit sm:h-fit max-h-[80vh]"
                loading="lazy"
              />
            ) : (
              <div className="sm:h-full w-full">
                <iframe
                  src={media.url}
                  title={media.event || "media"}
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
        <label className="modal-backdrop" htmlFor={id} onClick={onClose}>
          Close
        </label>
      </div>
    </>
  );
}

export default MediaModal;
