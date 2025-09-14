import { useState, useEffect, useRef } from "react";
import { database, auth } from "../firebase";
import { ref, push, onValue } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { toastStore } from "../store/toastStore";

function MessageBoard({ memberName }) {
  // 狀態管理
  const [messages, setMessages] = useState([]); // 儲存所有訊息，使用陣列結構存儲多筆留言數據
  const [content, setContent] = useState(""); // 輸入框內容，用於控制表單輸入值
  const [user, setUser] = useState(null); // 當前登入使用者，存儲 Firebase Auth 返回的用戶物件
  const [loading, setLoading] = useState(true); // 是否正在載入，布林值控制載入狀態顯示
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesContainerRef = useRef(null); // 使用 useRef 建立對 DOM 元素的引用，用於控制訊息區塊自動滾動
  const MAX_MESSAGE_LENGTH = 100; // 最大字數限制

  // 監聽登入狀態
  useEffect(() => {
    // 註冊 Firebase Auth 狀態監聽器，當身份驗證狀態改變時觸發回調
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // 設定當前使用者
      setLoading(false); // 載入完成，更新狀態
    });

    // useEffect 清除函數：卸載組件時移除監聽器，避免記憶體洩漏
    return () => unsubscribe();
  }, []); // 空依賴陣列表示只在組件掛載時執行一次

  // 從 Firebase 即時監聽留言
  useEffect(() => {
    // 創建資料庫引用，指向 messages 集合
    const messagesRef = ref(database, "messages");

    // 註冊資料變動監聽器，當數據變化時會觸發回調
    onValue(
      messagesRef,
      (snapshot) => {
        const data = snapshot.val(); // 取得所有訊息資料，返回一個鍵值對物件
        if (data) {
          // 資料處理：將 Firebase 物件轉為陣列結構
          // Object.entries 將物件轉換為 [key, value] 形式的二維陣列
          const messageList = Object.entries(data)
            .map(([id, message]) => ({
              id, // 將 Firebase 生成的唯一 key 作為 id
              ...message, // 使用展開運算符合併訊息內容
            }))
            // 過濾掉不完整的訊息，確保訊息結構完整
            .filter(
              (message) =>
                message.content && message.timestamp && message.userId
            );

          // 依照時間排序訊息：使用 Array.sort() 方法排序
          setMessages(
            messageList.sort((a, b) => {
              // 將字串時間戳轉為 Date 物件以進行比較
              const dateA = new Date(a.timestamp);
              const dateB = new Date(b.timestamp);
              // 錯誤處理：檢查日期是否有效
              if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
                console.error("無效的時間格式：", a.timestamp, b.timestamp);
                return 0;
              }
              // 按時間升序排列（從舊到新）
              return dateA.getTime() - dateB.getTime();
            })
          );
        } else {
          // 沒有訊息時設為空陣列
          setMessages([]);
        }
      },
      (error) => {
        // 監聽錯誤處理回調
        console.error("監聽錯誤：", error);
      }
    );
    // 無需返回清除函數，因為 onValue 會在組件卸載時自動清理
  }, []); // 空依賴陣列表示只在組件掛載時執行一次

  // 每當訊息更新時，使用 useEffect 讓留言板訊息區自動滾動到底部
  useEffect(() => {
    // 檢查 ref 是否已綁定 DOM 元素
    if (messagesContainerRef.current) {
      // 設定滾動位置為最大值，實現滾動到底部
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]); // 依賴於 messages 陣列，當訊息更新時觸發
  /*
  scrollTop 和 scrollHeight 視覺化說明：

  ┌─────────────────┐ ← 容器頂部 (scrollTop = 0)
  │ 可見內容區域1   │
  │ 可見內容區域2   │ ← clientHeight (可見區域高度)
  │ 可見內容區域3   │
  ├─────────────────┤ ← 容器底部 (當前可見範圍)
  │ 隱藏內容區域4   │
  │ 隱藏內容區域5   │ ← scrollHeight (總內容高度)
  │ 隱藏內容區域6   │
  └─────────────────┘ ← 內容底部 (scrollTop = scrollHeight)

  - scrollTop：元素向上滾動的像素距離 (可讀寫)
  - scrollHeight：元素內容的總高度，包含不可見區域 (唯讀)
  - 當 scrollTop = scrollHeight 時，滾動到最底部
  - 這確保新留言出現時，用戶能立即看到最新內容
  */
  const handleContentChange = (e) => {
    const inputValue = e.target.value;

    // 限制字數不超過最大限制
    if (inputValue.length <= MAX_MESSAGE_LENGTH) {
      setContent(inputValue);
    }
  };

  // 處理表單提交（送出訊息）
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // 防止重複提交
    // 集中驗證，只顯示一個 toast
    if (loading) {
      toastStore.info("載入中...");
      return;
    }
    if (!user) {
      toastStore.warning("請先登入！");
      return;
    }
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toastStore.warning("請輸入留言內容！");
      return;
    }
    if (trimmedContent.length > MAX_MESSAGE_LENGTH) {
      toastStore.error(`留言字數不能超過 ${MAX_MESSAGE_LENGTH} 字！`);
      return;
    }

    setIsSubmitting(true); // 設置提交狀態

    try {
      const messagesRef = ref(database, "messages");
      const newMessage = {
        content: trimmedContent,
        timestamp: new Date().toISOString(),
        userId: user.uid,
        email: user.email || "",
      };

      push(messagesRef, newMessage);
      setContent("");
      toastStore.success("留言發送成功！");
    } catch (error) {
      console.error("提交留言失敗：", error);
      toastStore.error("提交留言失敗：" + error.message);
    } finally {
      setIsSubmitting(false); // 重置提交狀態
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-5">
      {/* 顯示使用者資訊 */}
      {loading ? (
        <p className="">載入中...</p>
      ) : (
        <div className="w-full max-w-sm p-4 flex justify-center items-center">
          <p className="text-lg">歡迎 {memberName}</p>
        </div>
      )}

      {/* 留言板主體 */}
      <div className="border rounded-lg shadow-md flex flex-col h-[500px] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto px-4 sm:px-0">
        {/* 訊息顯示區域，使用 ref 獲取 DOM 元素引用，用於控制滾動 */}
        <div
          className="flex-1 p-4 overflow-y-auto overflow-x-hidden"
          ref={messagesContainerRef}
        >
          {loading ? (
            <p className="text-center">載入中...</p>
          ) : messages.length === 0 ? (
            <p className="text-center">還沒有訊息，快來聊天吧！</p>
          ) : (
            // 使用 map 方法將訊息陣列轉換為 JSX 元素陣列
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex mb-4 ${
                  // 條件渲染：判斷訊息是自己的還是他人的
                  message.userId === user.uid ? "justify-end" : "justify-start"
                }`}
              >
                {/* 其他使用者的訊息 */}
                {message.userId !== user.uid && (
                  <div className="flex items-start max-w-[75%]">
                    <div className="w-full">
                      {/* 顯示使用者名稱（取 email @ 前段） */}
                      <p className="text-sm mb-1">
                        {(message.email || "").split("@")[0] || "未知使用者"}
                        {/* 使用字串分割操作取得使用者名稱 */}
                      </p>
                      <div className="bg-base-400 p-2 rounded-lg border">
                        <p className="text-base-800 break-words whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p className="text-xs mt-1">
                          {new Date(message.timestamp).toLocaleString(
                            "zh-TW", // 使用台灣時區
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
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
                  <div className="flex items-end max-w-[75%]">
                    <div className="bg-base-500 p-2 rounded-lg border w-full">
                      <p className="break-words whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className="text-xs mt-1 text-right">
                        {new Date(message.timestamp).toLocaleString(
                          "zh-TW", // 使用台灣時區
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {!loading && (
          <form
            onSubmit={handleSubmit} // 表單提交處理函數
            className="border-t p-4 flex flex-col"
          >
            <div className="flex items-center">
              <input
                type="text"
                value={content} // 受控組件，值由 content 狀態控制
                onChange={handleContentChange} // 更新輸入內容到狀態，並限制字數
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="輸入訊息..."
              />
              <button
                type="submit"
                disabled={isSubmitting} // 添加 disabled 屬性
                className={`ml-2 p-2 rounded-lg transition ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "發送中..." : "傳送"}
              </button>
            </div>
            {/* 字數統計 */}
            <div className="text-xs text-gray-500 mt-1 text-right">
              {content.length}/{MAX_MESSAGE_LENGTH}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default MessageBoard;
