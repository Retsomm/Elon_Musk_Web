import { useEffect, useState } from "react";
import { ArrowUpFromLine } from "lucide-react";

export default function ToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = (ev?: Event): void => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      setShow(docHeight > windowHeight && scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 bg-red-600 hover:bg-red-800 text-white rounded-full p-3 shadow-lg transition"
      aria-label="回到頂部"
    >
      <ArrowUpFromLine className="w-6 h-6" />
    </button>
  );
}