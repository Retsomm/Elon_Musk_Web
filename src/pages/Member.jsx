import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
// 預設頭像路徑
const DEFAULT_PIC = "/avatar.webp";
const Member = () => {
  // 取得使用者資訊與登出方法
  const { user, logout, loginType, loading } = useAuth();
  const navigate = useNavigate();
  const [memberPic, setMemberPic] = useState("");
  const fileInputRef = useRef(null);
  // 取得會員 Email 與 Google 頭像
  const memberEmail = user?.email || "";
  const googlePhoto = user?.photoURL;
  const isGmail = memberEmail.endsWith("@gmail.com");

  // 自動帶入名稱
  let memberName = "";
  if (isGmail) {
    memberName = user?.displayName || user?.name || memberEmail.split("@")[0];
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
  // 未登入時導向登入頁
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="memberComtainer flex px-10 max-sm:flex-col sm:justify-evenly">
      <div className="memberSide flex sm:flex-col sm:flex-1/2 justify-center items-end border-b-black sm:pr-50 max-sm:mb-10">
        <button className="btn btn-success m-3">資料</button>
        <Link to="/MessageBoard" className="btn btn-primary m-3 text-center">
          留言板
        </Link>
        <button className="btn btn-info m-3">收藏</button>
        <button className="btn btn-warning m-3" onClick={logout}>
          登出
        </button>
      </div>

      <div className="memberSection flex sm:flex-col flex-1/2 justify-center items-start border-b-black sm:pl-50">
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
        <div className="sectionCollect"></div>
      </div>
    </div>
  );
};

export default Member;
