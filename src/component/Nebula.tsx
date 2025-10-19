import { useRef, useEffect, useCallback } from "react";

const Nebula: React.FC = () => {
  // 使用 useRef 創建持久引用，保存 canvas 元素
  // useRef 不會觸發重新渲染，適合儲存 DOM 元素
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 使用 useRef 追蹤 animation frame ID，用於在組件卸載時取消動畫
  const animationIdRef = useRef<number | null>(null);
  // useCallback 包裝 resizeCanvas 函數
  // 此 hook 會記憶化函數，避免重複創建，優化效能
  // 空依賴陣列 [] 表示該函數不依賴任何狀態變數，只會創建一次
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const container = canvas.parentElement;

    if (canvas && container) {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    }
  }, []);
  // useEffect 處理副作用，如 DOM 操作、事件監聽、動畫設置等
  // 依賴於 resizeCanvas，當 resizeCanvas 改變時會重新執行
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    resizeCanvas();

    // NebulaWave 類別：定義星雲波浪特性和行為的物件藍圖
    class NebulaWave {
      amplitude: number;
      frequency: number;
      speed: number;
      hue: number;
      yOffset: number;
      time: number;

      constructor(canvasHeight: number) {
        // 物件屬性初始化，使用隨機值增加多樣性
        this.amplitude = 100 + Math.random() * 200; // 振幅（波浪高度）
        this.frequency = 0.005 + Math.random() * 0.01; // 頻率（波浪密度）
        this.speed = 0.002 + Math.random() * 0.03; // 移動速度
        this.hue = Math.random() * 360; // HSL 色彩的色相值
        this.yOffset = Math.random() * canvasHeight; // Y軸偏移量
        this.time = 0; // 時間累積器
      }

      // 更新波浪狀態的方法
      update(): void {
        this.time += this.speed;
      }
      // 繪製波浪的方法
      draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.1;

        // 創建波浪漸變
        const gradient = ctx.createLinearGradient(
          0,
          0,
          canvas.width,
          canvas.height
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, 0)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 80%, 60%, 0.3)`);
        gradient.addColorStop(1, `hsla(${this.hue + 60}, 80%, 60%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        // 繪製波浪
        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            this.yOffset +
            Math.sin(x * this.frequency + this.time) * this.amplitude +
            Math.sin(x * this.frequency * 2 + this.time * 1.5) *
              (this.amplitude * 0.5) +
            Math.sin(x * this.frequency * 0.5 + this.time * 0.8) *
              (this.amplitude * 0.3);
          ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // 使用 Array.from 創建固定長度的陣列並初始化
    // { length: 8 } 創建一個有 8 個空位的類陣列物件
    // 第二參數是映射函數，為每個位置創建 NebulaWave 實例
    const nebulaWaves = Array.from({ length: 8 }, () => new NebulaWave(canvas.height));

    // 背景漸變
    const createBackground = (time: number): CanvasGradient => {
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        Math.max(canvas.width, canvas.height) * 0.8
      );

      const hue1 = (time * 10) % 360;
      const hue2 = (time * 15 + 120) % 360;
      const hue3 = (time * 8 + 240) % 360;

      gradient.addColorStop(0, `hsla(${hue1}, 60%, 10%, 1)`);
      gradient.addColorStop(0.4, `hsla(${hue2}, 50%, 5%, 1)`);
      gradient.addColorStop(1, `hsla(${hue3}, 40%, 3%, 1)`);

      return gradient;
    };

    // 主動畫循環 - 遞迴調用以創建平滑動畫
    const animate = (): void => {
      const time = Date.now() * 0.001; // 轉換毫秒為秒，用於動畫計時

      // 清空畫布，準備新一幀繪製
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 繪製背景
      ctx.fillStyle = createBackground(time);
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 在動畫循環中使用 forEach 遍歷陣列
      // 每一幀都更新和繪製所有波浪
      nebulaWaves.forEach((wave) => {
        wave.update(); // 調用每個波浪的更新方法
        wave.draw(ctx, canvas); // 調用每個波浪的繪製方法
      });
      // 請求下一幀動畫，並保存 ID 以便清除
      // requestAnimationFrame 會在下一次重繪前調用指定函數
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();
    // 監聽視窗大小變化
    const handleResize = (): void => {
      resizeCanvas(); // 調整 canvas 大小以適應新的視窗尺寸
    };

    // 添加事件監聽器
    window.addEventListener("resize", handleResize);

    // 在 useEffect 清理函數中移除事件監聽器，防止記憶體洩漏
    return () => {
      window.removeEventListener("resize", handleResize);
      // 取消動畫，釋放資源
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [resizeCanvas]);

  return (
    <div className="w-full h-48 bg-black relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-48"
        style={{ background: "linear-gradient(45deg, #0a0a0a, #1a0a2a)" }}
      />
    </div>
  );
};

export default Nebula;
