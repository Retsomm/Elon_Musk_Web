import { useState } from "react";
import MediaModal from "../component/MediaModal";
import Timeline from "../component/Timeline";
import events from "../data/LifeEvent.json";
import type { TimelineItem } from "../types/timeline";

// 定義原始事件資料的型別
interface LifeEvent {
  year: string | number;
  desc: string;
  img?: string;
}

// 定義媒體對象的型別（與 MediaModal 的 Media 型別相容）
interface MediaObject {
  type: "image" | "video" | string;
  url: string;
  event: string;
}

function Life() {
  // modalImg 狀態用於儲存當前被選中顯示的媒體對象(包含類型和URL)
  // 初始值為 null，表示沒有選中任何媒體
  const [modalImg, setModalImg] = useState<MediaObject | null>(null);
  // modalOpen 狀態用於控制模態框的顯示與隱藏
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  
  // 資料轉換處理：使用陣列的 map 方法將原始 JSON 資料轉換成 Timeline 元件可用的格式
  // 1. 遍歷 eventsData.events 陣列中的每個事件對象
  // 2. 為每個事件創建新的對象結構，保留需要的屬性並重命名/重組某些屬性
  const timelineItems: TimelineItem[] = events.map((event: LifeEvent) => ({
    year: event.year, // 直接映射年份屬性
    event: event.desc, // 將原始資料中的 desc 屬性映射到新對象的 event 屬性
    media: event.img
      ? { url: event.img, type: "image" as const } // 如果存在圖片，創建包含 url 和 type 的 TimelineMedia 對象
      : null, // 如果沒有圖片，則設為 null
  }));

  // 事件處理函數：處理時間軸項目點擊事件
  // 當用戶點擊時間軸上的項目時觸發
  const handleTimelineClick = (item: TimelineItem): void => {
    // 條件判斷：檢查點擊的項目是否有相關聯的媒體資源
    if (item.media?.url) {
      // 使用可選鏈運算符(?)，安全地訪問可能不存在的屬性
      // 更新狀態：設置要在模態框中顯示的媒體對象
      setModalImg({ 
        type: "image", 
        url: item.media.url,
        event: item.event // 添加事件描述
      });
      // 更新狀態：打開模態框
      setModalOpen(true);
    }
  };

  return (
    <div className="w-full flex justify-center mt-24 p-6">
      {/* 媒體顯示彈出視窗 */}
      <MediaModal
        id="life_modal"
        open={modalOpen}
        onClose={() => {
          // 內聯事件處理函數：當模態框關閉時
          setModalOpen(false); // 更新模態框狀態為關閉
          setModalImg(null); // 清空當前顯示的媒體
        }}
        media={modalImg}
      />

      {/* Timeline 元件接收轉換後的資料和點擊事件處理函數 */}
      <div className="w-full max-w-2xl">
        <Timeline
          timelineData={timelineItems} // 傳入轉換後的時間軸資料
          onItemClick={handleTimelineClick} // 傳入點擊事件處理函數
        />
      </div>
    </div>
  );
}

export default Life;