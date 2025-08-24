import React, { useState, useEffect, lazy } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  useAllFavorites,
} from "../hooks/useFavorites";
import { books, podcasts, youtubeVideos } from "../component/data";
const MessageBoard = lazy(() => import("../component/MessageBoard"));
// 預設頭像路徑
const DEFAULT_PIC = "/avatar.webp";

function Member() {
  // 取得使用者資訊與登出方法
  const { user, logout, loading } = useAuthStore();
  const navigate = useNavigate();
  const [memberPic, setMemberPic] = useState("");
  const { favoritesData, removeFavorite } = useAllFavorites();
  const [mainTab, setMainTab] = useState(
    "profile"
  );

  // 取得會員 Email 與 Google 頭像
  const memberEmail = user?.email || "";
  const googlePhoto = user?.photoURL;
  const isGmail = memberEmail.endsWith("@gmail.com");

  //移除收藏
  const handleRemoveFavorite = async (
    type,
    id,
    noteIdx
  ) => {
    await removeFavorite(type, id, noteIdx);
  };

  // 收藏內容渲染
  const renderCollectList = () => {
    if (!favoritesData || Object.keys(favoritesData).length === 0) {
      return <div>尚未收藏任何內容</div>;
    }
    const collectItems  = [];
    for (const type of ["book", "youtube", "podcast"]) {
      const typeFav = favoritesData[type];
      if (!typeFav) continue;
      for (const id in typeFav) {
        let item;
        let notes = [];
        if (type === "book") {
          item = books.find((b) => b.id === id);
          notes = item?.bookNote || [];
        }
        if (type === "youtube") {
          item = youtubeVideos.find((y) => y.id === id);
          notes = item?.hightlight || [];
        }
        if (type === "podcast") {
          item = podcasts.find((p) => p.id === id);
          notes = item?.timestamps || [];
        }
        if (!item) continue;

        let favIdxArr= [];
        if (Array.isArray(typeFav[id])) {
          favIdxArr = (typeFav[id])
            .map((v, idx) => (v && v.status ? idx : null))
            .filter((v) => v !== null);
        } else {
          favIdxArr = Object.keys(typeFav[id]);
        }

        favIdxArr.forEach((noteIdx) => {
          let favData = Array.isArray(typeFav[id])
            ? (typeFav[id] )[noteIdx]
            : (typeFav[id] )[noteIdx];
          if (!favData || !favData.status) return;
          collectItems.push(
            <div
              key={`${type}-${id}-${noteIdx}`}
              className="mb-3 p-4 border shadow-sm w-full max-w-xl flex flex-col sm:flex-row sm:items-center relative justify-center"
            >
              <div className="flex-1 m-3">
                <div className="font-bold text-base sm:text-lg mb-1">
                  {item.title || item.name}
                </div>
                <div className="text-sm break-words">
                  {notes[noteIdx ] || favData.content}
                </div>
              </div>
              <div className="sm:mt-0 sm:ml-4 flex-shrink-0">
                <div className="absolute right-0 top-0 badge badge-info rounded-none">
                  {type}
                </div>
                <button
                  className="max-sm:ml-3 btn btn-xs btn-error"
                  onClick={() => handleRemoveFavorite(type, id, noteIdx)}
                >
                  移除收藏
                </button>
              </div>
            </div>
          );
        });
      }
    }
    return (
      <div className="flex flex-col items-center w-full px-2">
        {collectItems}
      </div>
    );
  };

  // 自動帶入名稱
  let memberName = "";
  if (isGmail) {
    memberName = user?.name || memberEmail.split("@")[0];
  } else {
    memberName = memberEmail.split("@")[0];
  }
  // 設定頭像來源
  let picSrc = "/defaultMemberPic.webp";
  if (googlePhoto) {
    picSrc = googlePhoto;
  } else if (isGmail) {
    picSrc = `https://www.google.com/s2/photos/profile/${memberEmail}`;
  } else if (memberPic) {
    picSrc = memberPic;
  }

  if (loading) return null;
  // 右側主區塊內容
  let mainContent = null;
  if (mainTab === "profile") {
    mainContent = (
      <div className="sectionInfo flex flex-col justify-center items-center">
        <div className="memberPic mb-2">
          <img
            src={picSrc}
            alt="會員頭像"
            className="w-24 h-24 rounded-full object-cover"
            onError={(e) =>
              ((e.target ).src = DEFAULT_PIC)
            }
            loading="lazy"
          />
        </div>
        <div className="memberName">{memberName}</div>
        <div className="memberEmail mt-2">
          <span>{memberEmail}</span>
        </div>
      </div>
    );
  } else if (mainTab === "collect") {
    mainContent = (
      <div className="sectionCollect flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">收藏頁面</h2>
        {renderCollectList()}
      </div>
    );
  } else if (mainTab === "message") {
    mainContent = (
      <div className="sectionMessage flex flex-col items-center">
        <MessageBoard />
      </div>
    );
  }
  return (
    <div className="memberComtainer flex px-10 max-sm:flex-col sm:justify-evenly">
      <div className="memberSide flex sm:flex-col sm:flex-1/2 justify-center items-end border-b-black sm:pr-50 max-sm:mb-10">
        <button
          className={`btn btn-success m-3 ${
            mainTab === "profile" ? "btn-active" : ""
          }`}
          onClick={() => setMainTab("profile")}
        >
          資料
        </button>
        <button
          className={`btn btn-info m-3 ${
            mainTab === "collect" ? "btn-active" : ""
          }`}
          onClick={() => setMainTab("collect")}
        >
          收藏
        </button>
        <button
          className={`btn btn-primary m-3 ${
            mainTab === "message" ? "btn-active" : ""
          }`}
          onClick={() => setMainTab("message")}
        >
          留言板
        </button>
        <button className="btn btn-warning m-3" onClick={logout}>
          登出
        </button>
      </div>

      <div className="memberSection flex sm:flex-col flex-1/2 justify-center items-start border-b-black sm:pl-50">
        {mainContent}
      </div>
    </div>
  );
}

export default Member;
