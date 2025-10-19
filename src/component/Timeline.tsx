import { JSX } from "react";
import type { TimelineItem, TimelineProps } from "../types/timeline";
/**
 * Timeline 元件 - 用於顯示時間軸內容
 * @param {Array} timelineData - 時間軸資料陣列，每個項目包含 year, event 和可能的 media 物件
 * @param {Function} onItemClick - 點擊事件處理函數，當項目被點擊時觸發
 * @returns {JSX.Element|null} 時間軸 UI 或 null (當無資料時)
 */
function Timeline({ timelineData, onItemClick }: TimelineProps): JSX.Element | null {
  // 資料處理: 防禦性檢查，若 timelineData 為空或不存在則不渲染任何內容
  if (!timelineData || timelineData.length === 0) {
    return null;
  }

  return (
    <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
      {/* 陣列處理: 使用 map 遍歷 timelineData 陣列並為每個項目生成 UI 元素 */}
      {timelineData.map((item: TimelineItem, idx: number) => (
        <li key={idx}>
          {/* 條件渲染: 除了第一個項目外，在每個項目前添加分隔線 */}
          {idx !== 0 && <hr />}

          {/* 條件渲染: 基於索引的奇偶性決定時間軸項目的位置 (左側或右側) */}
          {idx % 2 === 1 ? (
            <>
              <div
                className="m-1 timeline-start mb-10 md:text-end max-sm:text-left hover:cursor-pointer transform 
                transition 
                duration-300 
                hover:scale-95 
                hover:shadow-xl"
                // 事件處理: 僅在項目有 media.url 屬性時觸發 onItemClick 回調函數
                // 物件處理: 使用可選鏈運算符(?.)安全地存取 item.media.url
                onClick={() => item.media?.url && onItemClick(item)}
              >
                {/* 物件屬性存取: 顯示項目的年份 */}
                <time className="font-mono italic">{item.year}</time>
                {/* 物件屬性存取: 顯示項目的事件描述 */}
                <p className="text-lg font-black leading-loose">{item.event}</p>
              </div>
              <div className="timeline-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <circle cx="10" cy="10" r="7" />
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
                  <circle cx="10" cy="10" r="7" />
                </svg>
              </div>
              <div
                className="timeline-end md:mb-10 text-left hover:cursor-pointer transform 
                transition 
                duration-300 
                hover:scale-95 
                hover:shadow-xl"
                onClick={() => item.media?.url && onItemClick(item)}
              >
                <time className="font-mono italic">{item.year}</time>
                <p className="text-lg font-black leading-loose">{item.event}</p>
              </div>
            </>
          )}
          {/* 條件渲染: 除了最後一個項目外，在每個項目後添加分隔線 */}
          {idx !== timelineData.length - 1 && <hr />}
        </li>
      ))}
    </ul>
  );
}

export default Timeline;
