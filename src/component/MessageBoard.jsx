import { useState, useEffect, useRef } from "react";
import { database, auth } from "../firebase";
import { ref, push, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { useToastStore } from "../store/toastStore";
import Toast from "./Toast";
function MessageBoard() {
  // 狀態管理
  const [messages, setMessages] = useState([]); // 儲存所有訊息
  const [content, setContent] = useState(""); // 輸入框內容
  const [user, setUser] = useState(null); // 當前登入使用者
  const [avatar, setAvatar] = useState("/"); // 使用者頭像，預設為本地圖片
  const [loading, setLoading] = useState(true); // 是否正在載入
  const messagesContainerRef = useRef(null); // 新增：訊息區塊的ref
  const addToast = useToastStore((state) => state.addToast);
  // 監聽登入狀態並取得頭像
  useEffect(() => {
    // 註冊 Firebase Auth 狀態監聽
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 設定當前使用者
      if (currentUser) {
        // 如果有登入，優先使用 Google 頭像，否則用預設
        const userAvatar = currentUser.photoURL || "/avatar.webp";
        setAvatar(userAvatar);
      } else {
        // 未登入時使用預設頭像
        setAvatar("/avatar.webp");
      }
      setLoading(false); // 載入完成
    });
    // 卸載時移除監聽
    return () => unsubscribe();
  }, []);

  // 從 Firebase 即時監聽留言
  useEffect(() => {
    const messagesRef = ref(database, "messages"); // 指向資料庫的 messages 路徑
    // 註冊資料變動監聽
    onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val(); // 取得所有訊息資料
        if (data) {
          // 將物件轉為陣列，並加上 id
          const messageList = Object.entries(data)
            .map(([id, message]) => ({
              // message 是從 Firebase 取得的單筆訊息資料，型別不明（通常是物件）。
              // Omit<Message, "id"> 表示「Message 型別，但不包含 id 屬性」。
              // as Omit<Message, "id"> 是型別斷言，告訴 TypeScript：這個 message 物件的型別就是 Message，但沒有 id 這個屬性。
              // 這麼做是因為 Firebase 的資料本身沒有 id 欄位，id 是用 Firebase 的 key 來補上的，所以要先展開原本的資料，再額外加上 id。
              ...message,
              id,
            }))
            // 過濾掉不完整的訊息
            .filter(
              (message) =>
                message.content && message.timestamp && message.userId
            );
          // 依照時間排序訊息
          setMessages(
            messageList.sort((a, b) => {
              const dateA = new Date(a.timestamp);
              const dateB = new Date(b.timestamp);
              if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                console.error("無效的時間格式：", a.timestamp, b.timestamp);
                return 0;
              }
              return dateA.getTime() - dateB.getTime();
            })
          );
        } else {
          // 沒有訊息時設為空陣列
          setMessages([]);
        }
      },
      (error) => {
        // 監聽錯誤時輸出錯誤訊息
        console.error("監聽錯誤：", error);
      }
    );
  }, []);

  // 每當訊息更新時，只讓留言板訊息區自動滾動到底部
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 處理表單提交（送出訊息）
  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止表單預設行為
    if (loading) {
      addToast({ message: "請先登入！" });
      return;
    }
    if (!user) {
      addToast({ message: "請先登入！" });
      return;
    }
    if (!content.trim()) {
      addToast({ message: "請輸入留言內容！" });
      return;
    }

    try {
      const messagesRef = ref(database, "messages");
      // 建立新訊息物件
      const newMessage = {
        content: content.trim(),
        timestamp: new Date().toISOString(),
        userId: user.uid,
        email: user.email || "",
        avatar: avatar || "/avatar.webp", // 確保頭像有值
      };
      console.log("即將寫入的訊息：", newMessage);
      await push(messagesRef, newMessage); // 寫入資料庫
      setContent(""); // 清空輸入框
    } catch (error) {
      addToast({ message: "提交留言失敗：" + error.message });
    }
  };

  // 處理頭像載入失敗，改用預設頭像
  const handleAvatarError = () => {
    console.log("頭像載入失敗，切換到預設頭像：", e.currentTarget.src);
    e.currentTarget.src = "/avatar.webp";
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
      <Toast />
      <h1 className="text-3xl font-bold mb-6">留言板</h1>

      {/* 顯示使用者資訊（包含頭像） */}
      {loading ? (
        <p className="">載入中...</p>
      ) : user ? (
        <div className="w-full max-w-md p-4 flex justify-center items-center">
          <img
            src={avatar}
            alt="頭像"
            className="w-10 h-10 rounded-full mr-2"
            onError={handleAvatarError}
            loading="lazy"
          />
          <p className="">歡迎，{user.email}</p>
        </div>
      ) : null}

      {/* 留言板主體 */}
      <div className="w-full max-w-md border rounded-lg shadow-md flex flex-col h-[500px]">
        {/* 訊息顯示區域 */}
        <div className="flex-1 p-4 overflow-y-auto" ref={messagesContainerRef}>
          {loading ? (
            <p className="text-center">載入中...</p>
          ) : user ? (
            messages.length === 0 ? (
              <p className="text-center">還沒有訊息，快來聊天吧！</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex mb-4 ${
                    message.userId === user.uid
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {/* 其他使用者的訊息 */}
                  {message.userId !== user.uid && (
                    <div className="flex items-start">
                      <img
                        src={message.avatar || "/avatar.webp"}
                        alt="頭像"
                        className="w-10 h-10 rounded-full mr-2"
                        onError={handleAvatarError}
                        loading="lazy"
                      />
                      <div>
                        {/* 顯示使用者名稱（取 email @ 前段） */}
                        <p className="text-sm">
                          {(message.email || "").split("@")[0] || "未知使用者"}
                        </p>
                        <div className="bg-base-400 p-2 rounded-lg max-w-xs border">
                          <p className="text-base-800">{message.content}</p>
                          <p className="text-xs mt-1">
                            {/* 顯示時間（只顯示時:分） */}
                            {new Date(message.timestamp).toLocaleString(
                              "zh-TW",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 自己的訊息 */}
                  {message.userId === user.uid && (
                    <div className="flex items-end">
                      <div className="bg-base-500 p-2 rounded-lg max-w-xs border">
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 text-right">
                          {new Date(message.timestamp).toLocaleString("zh-TW", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )
          ) : (
            <p className="text-center ">請先登入以使用留言板！</p>
          )}
        </div>

        {/* 輸入框（僅登入時顯示） */}
        {loading ? null : user ? (
          <form
            onSubmit={handleSubmit}
            className="border-t p-4 flex items-center"
          >
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="輸入訊息..."
            />
            <button
              type="submit"
              className="ml-2 bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition"
            >
              傳送
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default MessageBoard;
