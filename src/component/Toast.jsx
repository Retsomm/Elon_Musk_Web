import { useToastStore } from "../store/toastStore";
import { useEffect } from "react";

export default function Toast() {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 3000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 z-9999 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}