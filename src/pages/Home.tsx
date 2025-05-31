import { Link } from "react-router-dom";


import Quotes from "../component/Quotes";
type Section = {
  name: string;
  description: string;
  link: string;
}
const sections:Section[] = [
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

const HomePage:React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="relative flex items-center justify-center text-center">
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="sm:text-6xl text-3xl font-bold mt-10 not-first:drop-shadow-lg">
            Elon Musk： <br /> 改變世界的實踐家
          </h1>
          <p className="text-xl mt-10 leading-loose">
            馬斯克不只是一位企業家，更是一位推動人類科技進步的夢想家。他用創新和勇氣，挑戰看似不可能的夢想，從電動車到太空探索，不斷顛覆我們對未來的想像。
          </p>
        </div>
      </div>
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

      <div className="container mx-auto px-6 text-center">
        <Quotes />
      </div>
    </div>
  );
};

export default HomePage;
