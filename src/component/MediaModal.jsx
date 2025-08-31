/**
 * MediaModal - 媒體內容顯示模態窗口
 * 
 * @param {string} id - 模態窗口唯一識別符
 * @param {boolean} open - 控制模態窗口是否開啟的狀態
 * @param {function} onClose - 關閉模態窗口的回調函數
 * @param {object} media - 媒體對象，包含類型、URL 和事件描述
 * @param {string} media.type - 媒體類型，支援 "image" 或其他（如影片）
 * @param {string} media.url - 媒體資源的 URL 地址
 * @param {string} media.event - 媒體的描述或事件名稱（可選）
 */
function MediaModal({ id, open, onClose, media }) {
  // 物件資料處理：檢查 media 是否為有效物件且有 url 屬性
  // 此驗證確保在渲染前 media 物件結構符合預期，避免空值錯誤
  const hasValidMedia = media && typeof media === "object" && media.url;

  return (
    <>
      {/* 隱藏的 checkbox 用於控制模態窗口狀態，是 Tailwind DaisyUI 的模式 */}
      <input
        type="checkbox"
        id={id}
        className="modal-toggle"
        checked={open}
        readOnly
      />
      {/* 模態窗口容器，使用 modal-open 類動態控制顯示/隱藏 */}
      <div className={`modal ${open ? "modal-open" : ""}`} role="dialog">
        <div className="modal-box flex justify-center items-center rounded max-h-[80vh] overflow-auto">
          {/* 條件渲染：基於 media 物件的有效性和類型顯示不同內容 */}
          {hasValidMedia ? (
            // 媒體類型判斷：image 類型顯示圖片，其他類型（如影片）使用 iframe
            media.type === "image" ? (
              <img
                src={media.url}
                alt={media.event || "media"} // 使用事件名稱作為替代文字，若無則使用預設值
                className="w-fit sm:h-fit max-h-[80vh]"
                loading="lazy" // 啟用延遲載入優化
              />
            ) : (
              // 非圖片類型（如影片）使用 iframe 嵌入
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
            // 當 media 物件無效或未提供時顯示提示訊息
            <p>無媒體內容</p>
          )}
        </div>
        {/* 背景遮罩層，點擊時調用 onClose 回調關閉模態窗口 */}
        <label className="modal-backdrop" htmlFor={id} onClick={onClose}>
          Close
        </label>
      </div>
    </>
  );
}

export default MediaModal;