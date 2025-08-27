import { useState, lazy } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { useNavigate } from "react-router-dom";
const MessageBoard = lazy(() => import("../component/MessageBoard"));
const CollectList = lazy(() => import("../component/CollectList"));
// 預設頭像路徑
const DEFAULT_PIC = "/avatar.webp";

function Member() {
  // 取得使用者資訊與登出方法
  const { user, logout, loading } = useAuthStore();
  const navigate = useNavigate();
  const [memberPic, setMemberPic] = useState("");

  const [mainTab, setMainTab] = useState("profile");

  // 取得會員 Email 與 Google 頭像
  const memberEmail = user?.email || "";
  const googlePhoto = user?.photoURL;
  const isGmail = memberEmail.endsWith("@gmail.com");

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
            onError={(e) => (e.target.src = DEFAULT_PIC)}
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
        <CollectList />
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
