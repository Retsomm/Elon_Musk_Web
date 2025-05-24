import React, { useState } from "react";
import "./Quotes.css";

const muskQuotes = [
  "當某件事足夠重要時，即使勝算不大，你也要去做。",
  "我認為普通人也可以選擇成為不平凡的人。",
  "失敗是一種選項。如果沒有失敗，你就沒有創新。",
  "我想死在火星上，只是別在撞擊時。",
  "持續創新是唯一不被淘汰的方法。",
  "我從不放棄，除非我死了或完全無能為力。",
  "生活不能只關乎解決問題，還要有讓你興奮的東西。",
];

const Quotes = () => {
  // 使用狀態追蹤每張卡片的翻轉狀態
  const [flipped, setFlipped] = useState(muskQuotes.map(() => false));

  // 處理卡片點擊事件，翻轉指定卡片
  const handleFlip = (index) => {
    setFlipped((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  return (
    <div className="quotes-container">
      <div className="quotes-grid">
        {muskQuotes.map((quote, index) => (
          <div
            key={index}
            className={`quote-card ${flipped[index] ? "flipped" : ""}`}
            onClick={() => handleFlip(index)}
          >
            <div className="card-inner">
              <div className="card-front">
                <p className="leading-loose">
                  {quote}
                </p>
              </div>
              <div className="card-back">
                <p className="leading-loose">
                  OPEN IT
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quotes;
