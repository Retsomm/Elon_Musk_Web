import React from "react";

import { Rocket, Car, Zap, Globe, Brain, Twitter } from "lucide-react";

// 公司資料
const companies = [
  {
    name: "SpaceX",
    icon: <Rocket className="w-16 h-16 text-blue-600" />,
    description:
      "太空探索科技公司，致力於開發可重複使用的火箭和太空船，並計劃未來殖民火星。",
    website: "https://www.spacex.com",
  },
  {
    name: "Tesla",
    icon: <Car className="w-16 h-16 text-red-600" />,
    description:
      "電動汽車和清潔能源公司，生產電動車、太陽能板和儲能系統，引領綠色科技革命。",
    website: "https://www.tesla.com",
  },
  {
    name: "Neuralink",
    icon: <Brain className="w-16 h-16 text-purple-600" />,
    description:
      "神經科技公司，研發腦機介面技術，旨在幫助身障人士和推進人腦與人工智能的整合。",
    website: "https://neuralink.com",
  },
  {
    name: "The Boring Company",
    icon: <Zap className="w-16 h-16 text-gray-600" />,
    description:
      "基礎設施和隧道建設公司，致力於開發高效的地下交通和隧道運輸系統。",
    website: "https://www.boringcompany.com",
  },
  {
    name: "X (前推特)",
    icon: <Twitter className="w-16 h-16 text-black" />,
    description:
      "社交媒體和通訊平台，原名推特，馬斯克在2022年收購並重新命名為X。",
    website: "https://x.com",
  },
  {
    name: "Grok AI",
    icon: <Globe className="w-16 h-16 text-green-600" />,
    description:
      "由xAI開發的人工智能聊天機器人，以其幽默風趣和直言不諱的特色而聞名，是馬斯克對抗其他AI公司的新嘗試。",
    website: "https://x.ai",
  },
];

const Company = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <div
              key={index}
              className={`
                companyCard
                rounded-xl 
                shadow-lg 
                p-6 
                transform 
                transition 
                duration-300 
                hover:scale-105 
                hover:shadow-xl
                
              `}
            >
              <div className="flex items-center mb-4">
                {company.icon}
                <h2 className="text-2xl font-semibold ml-4">
                  {company.name}
                </h2>
              </div>
              <p className="mb-4 leading-loose">
                {company.description}
              </p>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-block 
                  bg-blue-500 
                  px-4 
                  py-2 
                  rounded-md 
                  hover:bg-blue-600 
                  transition 
                  duration-300
                "
              >
                官方網站
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Company;
