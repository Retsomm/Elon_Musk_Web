import { Link } from "react-router-dom";
import UnityParticleSystem from "../component/UnityParticleSystem";

const sections = [
  {
    name: "公司介紹",
    url:"/spaceX.jpg",
    description:
      "深入了解馬斯克旗下的六大科技公司，探索每一間公司的創新理念與未來願景。",
    link: "/company",
  },
  {
    name: "生平故事",
    url:"/1995.webp",
    description: "馬斯克人生中的重要時刻與成就，從南非到矽谷的旅程。",
    link: "/life",
  },
  {
    name: "最新新聞",
    url:"/tesla.webp",
    description: "與馬斯克有關的最新新聞，讓你隨時掌握最新動態。",
    link: "/news",
  },
  {
    name: "更多消息",
    url:"/OrigamiCybertruck.webp",
    description: "與馬斯克有關書籍、影片以及podcast。",
    link: "/info",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br overflow-x-hidden">
      <img src="/banner.webp" className="w-full object-cover" loading="lazy"/>
      <UnityParticleSystem />

      
      {sections.map((section, index) => (
      <div
        className="hero min-h-screen"
        key={index}
        style={{
          backgroundImage:
            `url(${section.url})`,
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">{section.name}</h1>
            <p className="mb-5">
              {section.description}
            </p>
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
      </div>))}
    </div>
  );
}

export default HomePage;
