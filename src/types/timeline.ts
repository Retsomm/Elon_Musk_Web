// 時間軸相關類型定義

// 時間軸媒體類型
export interface TimelineMedia {
  type: "image" | string;
  url: string;
}

// 時間軸項目基礎介面
export interface TimelineItem {
  year: string | number;
  event: string;
  media?: TimelineMedia | null;
}

// 時間軸事件介面 (向後兼容)
export interface TimelineEvent extends TimelineItem {}

// Timeline 組件 Props 類型
export interface TimelineProps {
  timelineData: TimelineItem[];
  onItemClick: (item: TimelineItem) => void;
}

// 產品介面
export interface Product {
  name: string;
  description: string;
  timeline?: TimelineItem[];
}

// 公司資料介面
export interface Company {
  name: string;
  description: string;
  img: string;
  url: string;
  timeline: TimelineItem[];
  products?: Product[];
}

// URL 參數類型
export type CompanyParams = {
  name?: string;
};