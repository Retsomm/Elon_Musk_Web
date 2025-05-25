import { useState, useEffect, useRef } from "react";
import { database, auth } from "../firebase";
import { ref, push, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  // 狀態管理
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("/avatar.webp"); // 預設頭像
  const [loading, setLoading] = useState(true); // 增加 loading 狀態
  const messagesEndRef = useRef(null); // 用於自動滑動到最底部

  // 監聽登入狀態並取得頭像
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userAvatar = currentUser.photoURL || "/avatar.webp"; // 優先使用 Gmail 頭像，無效時用預設

        setAvatar(userAvatar);
      } else {
        setAvatar("/avatar.webp");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 從 Firebase 即時監聽留言
  useEffect(() => {
    const messagesRef = ref(database, "messages");
    onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const messageList = Object.entries(data)
            .map(([id, message]) => ({
              id,
              ...message,
            }))
            .filter(
              (message) =>
                message.content && message.timestamp && message.userId
            );
          setMessages(
            messageList.sort((a, b) => {
              const dateA = new Date(a.timestamp);
              const dateB = new Date(b.timestamp);
              if (isNaN(dateA) || isNaN(dateB)) {
                console.error("無效的時間格式：", a.timestamp, b.timestamp);
                return 0;
              }
              return dateA - dateB;
            })
          );
        } else {
          setMessages([]);
        }
      },
      (error) => {
        console.error("監聽錯誤：", error);
      }
    );
  }, []);

  // 自動滑動到最底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 處理表單提交
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      alert("正在檢查登入狀態，請稍後再試！");
      return;
    }
    if (!user) {
      alert("請先登入！");
      console.log("未登入，使用者為：", user);
      return;
    }
    if (!content.trim()) {
      alert("請輸入留言內容！");
      return;
    }

    try {
      const messagesRef = ref(database, "messages");
      const newMessage = {
        content: content.trim(),
        timestamp: new Date().toISOString(),
        userId: user.uid,
        email: user.email || "",
        avatar: avatar || "/avatar.webp", // 確保 avatar 總是有值
      };
      console.log("即將寫入的訊息：", newMessage);
      await push(messagesRef, newMessage);
      setContent("");
    } catch (error) {
      alert("提交留言失敗：" + error.message);
      console.error("寫入錯誤：", error);
    }
  };

  // 處理頭像載入失敗的情況
  const handleAvatarError = (e) => {
    console.log("頭像載入失敗，切換到預設頭像：", e.target.src);
    e.target.src = "/avatar.webp"; // 載入失敗時使用預設頭像
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8">
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
          <p className="">歡迎，{user.email}！</p>
        </div>
      ) : null}

      {/* 留言板 */}
      <div className="w-full max-w-md border rounded-lg shadow-md flex flex-col h-[500px]">
        {/* 訊息區域 */}
        <div className="flex-1 p-4 overflow-y-auto">
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
                        <p className="text-sm">
                          {(message.email || "").split("@")[0] || "未知使用者"}
                        </p>
                        <div className="bg-base-400 p-2 rounded-lg max-w-xs border">
                          <p className="text-base-800">{message.content}</p>
                          <p className="text-xs mt-1">
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
          <div ref={messagesEndRef} />
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

export default App;
