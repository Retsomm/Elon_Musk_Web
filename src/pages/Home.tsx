import { Link } from "react-router-dom";
import UnityParticleSystem from "../component/UnityParticleSystem";
import { JSX } from "react";
/**
 * 頁面區塊介面
 */
interface Section {
  name: string;
  url: string;
  description: string;
  link: string;
}
const sections: Section[] = [
  {
    name: "公司介紹",
    url: "/spaceX.jpg",
    description:
      "馬斯克旗下的六大科技公司，探索每一間公司的創新理念與未來願景。",
    link: "/company",
  },
  {
    name: "生平事蹟",
    url: "/1995.webp",
    description: "馬斯克的生平事蹟。",
    link: "/life",
  },
  {
    name: "最新新聞",
    url: "/tesla.webp",
    description: "與馬斯克有關的最新新聞。",
    link: "/news",
  },
  {
    name: "更多消息",
    url: "/OrigamiCybertruck.webp",
    description: "與馬斯克有關書籍、影片以及podcast。",
    link: "/info",
  },
];
/**
 * 首頁組件
 * 顯示馬斯克相關主題的多個區塊，每個區塊包含背景圖片和連結
 * @returns JSX.Element
 */
const HomePage = (): JSX.Element => {
  /**
   * 渲染單個區塊
   * @param section - 區塊資料
   * @param index - 區塊索引
   * @returns JSX.Element
   */
  const renderSection = (section: Section, index: number): JSX.Element => (
    <div
      className="hero min-h-screen"
      key={index}
      style={{
        backgroundImage: `url(${section.url})`,
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">{section.name}</h1>
          <p className="mb-5">{section.description}</p>
          <Link
            to={section.link}
            className="
              inline-block 
              bg-blue-500 
              text-black 
              dark:text-white
              px-4 
              py-2 
              rounded-md 
              dark:bg-blue-600 
              transition 
              duration-300
            "
          >
            探索更多
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br overflow-x-hidden">
      <img
        src="/banner.webp"
        className="w-full object-cover mt-16"
        loading="lazy"
        alt="Banner"
      />
      <UnityParticleSystem />
      {sections.map((section: Section, index: number) =>
        renderSection(section, index)
      )}
    </div>
  );
};

export default HomePage;
