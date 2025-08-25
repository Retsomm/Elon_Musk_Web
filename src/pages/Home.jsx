import { Link } from "react-router-dom";
import UnityParticleSystem from "../component/UnityParticleSystem";

const sections = [
  {
    name: "公司介紹",
    description:
      "深入了解馬斯克旗下的六大科技公司，探索每一間公司的創新理念與未來願景。",
    link: "/company",
  },
  {
    name: "生平故事",
    description: "馬斯克人生中的重要時刻與成就，從南非到矽谷的旅程。",
    link: "/life",
  },
  {
    name: "最新新聞",
    description: "與馬斯克有關的最新新聞，讓你隨時掌握最新動態。",
    link: "/news",
  },
  {
    name: "更多消息",
    description: "與馬斯克有關書籍、影片以及podcast。",
    link: "/info",
  },
];

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br overflow-x-hidden">
      <img src="/banner.webp" className="w-full object-cover" />
      <UnityParticleSystem />

      <div className="container mx-auto p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="
                rounded-xl 
                shadow-lg 
                p-6 
                text-center 
                transform 
                transition 
                duration-300 
                hover:scale-105 
                hover:shadow-xl
                flex
                flex-col
                justify-around
              "
            >
              <h2 className="text-2xl font-semibold mb-4 ">{section.name}</h2>
              <p className="mb-6 leading-loose">{section.description}</p>
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
