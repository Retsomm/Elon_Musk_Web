import { useEffect, useRef, useState } from "react";

const events = [
  { year: "1971/06/28", desc: "出生於南非普利托里亞" },
  {
    year: "1989年",
    desc: "移民至加拿大，進入安大略省女王大學學習，開始對科技與創業產生興趣",
  },
  {
    year: "1990年",
    desc: "進入女王大學學習，並於兩年後轉學至賓夕法尼亞大學。1995年畢業，並獲得了經濟學文學士和物理學理學士學位",
  },
  {
    year: "1995年",
    desc: "進入史丹佛大學攻讀應用物理學博士學位，但僅兩天後輟學，開始創業生涯",
  },
  {
    year: "1995年",
    desc: "與弟弟金博爾·馬斯克共同創辦Zip2，一家提供線上城市指南的軟體公司",
  },
  {
    year: "1999年",
    desc: "以3.07億美元將Zip2賣給康柏電腦公司，個人獲利約2200萬美元，開啟創業家之路",
  },
  {
    year: "2000年",
    desc: "創辦X.com，一家線上支付公司，後與Confinity合併成為PayPal",
  },
  {
    year: "2002年",
    desc: "以15億美元將PayPal賣給eBay，個人獲利約1.8億美元，為後續創業提供資金",
  },
  {
    year: "2002年",
    desc: "創辦SpaceX，並擔任董事長、執行長、技術長，該公司主要負責太空運輸、航太製造，目標是實現人類移居火星",
  },
  {
    year: "2004年",
    desc: "加入電動車製造商特斯拉，並擔任董事長與產品設計師，推動電動車產業革命",
  },
  {
    year: "2006年",
    desc: "投資並聯合創辦SolarCity，專注於太陽能發電系統，後於2016年被特斯拉收購",
  },
  {
    year: "2008年",
    desc: "帶領特斯拉推出首款電動車Roadster，開啟大眾對電動車的關注",
  },
  {
    year: "2015年",
    desc: "聯合創辦了非營利公司OpenAI，用於研究和推動友善人工智慧，目標是確保AI對人類有益",
  },
  {
    year: "2016年",
    desc: "聯合創辦了神經科技公司Neuralink，該公司專注於開發人機介面，探索人腦與AI的融合",
  },
  {
    year: "2016年",
    desc: "成立了無聊隧道施工公司（The Boring Company），用於研發超迴路列車及地下交通系統",
  },
  {
    year: "2018年",
    desc: "公開展示SpaceX的星艦（Starship）原型，該火箭設計用於火星移民與星際旅行",
  },
  {
    year: "2020年",
    desc: "SpaceX成功執行首次載人任務Crew Dragon，將NASA太空人送往國際太空站，實現民營太空載人飛行里程碑",
  },
  {
    year: "2022年10月27日",
    desc: "以440億美元收購社交平台Twitter，並將其改名為X，推動言論自由與資訊透明的願景",
  },
  {
    year: "2023年",
    desc: "創辦xAI，專注於開發人工智慧以加速人類科學發現，推出Grok作為AI助手",
  },
  {
    year: "2024年11月",
    desc: "美國總統當選人唐納·川普宣布委任馬斯克為總統高級顧問，領導新創立的政府效率部",
  },
];

// 定義與 DaisyUI 主題匹配的顏色
const themes = {
  light: {
    background: "#F1F1F1", // 淺色背景
    line: "#000000", // 黑色線條
    dot: "#ef4444", // 紅色圓點 (DaisyUI 的紅色 primary)
    text: "#000000", // 黑色年份文字
    descText: "#4b5563", // 灰色描述文字 (DaisyUI 的 text-gray-600)
    textBg: "rgba(255, 255, 255, 0.85)", // 淺色文字背景
  },
  dark: {
    background: "#202020", // 深色背景 (DaisyUI 的 dark 主題背景色)
    line: "#ffffff", // 白色線條
    dot: "#f87171", // 稍亮的紅色圓點 (DaisyUI 的紅色 primary 變體)
    text: "#ffffff", // 白色年份文字
    descText: "#d1d5db", // 淺灰色描述文字 (DaisyUI 的 text-gray-300)
    textBg: "rgba(55, 65, 81, 0.85)", // 深色文字背景 (DaisyUI 的 gray-700)
  },
};

const Timeline = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: Math.min(window.innerWidth * 0.9, 700),
    height: events.length * 180,
  });

  // 獲取當前主題的函數
  const getCurrentTheme = () => {
    const theme = document.documentElement.getAttribute("data-theme");
    return theme === "business" ? "dark" : "light"; // autumn 為 light, business 為 dark
  };

  // 監聽視窗大小變化
  useEffect(() => {
    const updateSize = () => {
      setDimensions({
        width: Math.min(window.innerWidth * 0.9, 700),
        height: events.length * 180,
      });
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 監聽主題變化
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // 當 data-theme 變化時，觸發重新繪製
      drawTimeline();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // 初次繪製
    drawTimeline();

    return () => observer.disconnect();
  }, [dimensions]);

  // 繪製時間軸的函數
  const drawTimeline = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    canvas.style.width = `${dimensions.width}px`;
    canvas.style.height = `${dimensions.height}px`;
    ctx.scale(dpr, dpr);

    // 根據當前主題選擇顏色
    const currentTheme = getCurrentTheme();
    ctx.fillStyle = themes[currentTheme].background;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    ctx.strokeStyle = themes[currentTheme].line;
    ctx.lineWidth = 2;

    const { width, height } = dimensions;
    const baseX = width / 2;
    const t = Math.min(Math.max((width - 400) / (700 - 400), 0), 1);

    events.forEach((event, i) => {
      const offsetX = width < 500 ? 0 : (i % 2 === 0 ? -300 : 300) * t;
      const x = baseX + offsetX;
      const y = 100 + i * 150;

      // 畫圓點
      ctx.fillStyle = themes[currentTheme].dot;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();

      // 畫線連接到下一個點
      if (i < events.length - 1) {
        const nextOffsetX =
          width < 500 ? 0 : ((i + 1) % 2 === 0 ? -300 : 300) * t;
        const nextX = baseX + nextOffsetX;
        const nextY = 100 + (i + 1) * 150;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();
      }

      // 畫年份
      ctx.font = "bold 15px Arial";
      const textWidth = ctx.measureText(event.year).width;
      const textHeight = 18;
      const textX = i % 2 === 0 ? x + 18 : x - textWidth - 18;
      const textBgX = textX - 4;
      const textBgY = y - 24;
      ctx.fillStyle = themes[currentTheme].textBg;
      ctx.fillRect(textBgX, textBgY, textWidth + 8, textHeight);
      ctx.fillStyle = themes[currentTheme].text;
      ctx.fillText(event.year, textX, y - 10);

      // 畫描述
      ctx.font = "13px Arial";
      ctx.fillStyle = themes[currentTheme].descText;
      const descWidth = width * 0.35;
      const descX = i % 2 === 0 ? x + 18 : x - descWidth - 18;
      const descY = y + 15;
      const descLines = wrapText(
        ctx,
        event.desc,
        descX,
        descY,
        descWidth,
        18,
        true
      );
      ctx.fillStyle = themes[currentTheme].textBg;
      ctx.fillRect(descX - 4, descY - 13, descWidth + 8, descLines * 18 + 8);
      ctx.fillStyle = themes[currentTheme].descText;
      wrapText(ctx, event.desc, descX, descY, descWidth, 18);
    });
  };

  // 文字自動換行
  function wrapText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight,
    measureOnly = false
  ) {
    const words = text.split("");
    let line = "";
    let lines = 0;
    for (let n = 0; n < words.length; n++) {
      line += words[n];
      if (ctx.measureText(line).width > maxWidth || n === words.length - 1) {
        if (!measureOnly) ctx.fillText(line, x, y);
        y += lineHeight;
        line = "";
        lines++;
      }
    }
    return lines;
  }

  return (
    <div className="w-full flex justify-center mt-8">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default Timeline;
