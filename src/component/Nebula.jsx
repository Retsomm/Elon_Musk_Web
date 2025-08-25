import React, { useRef, useEffect } from "react";
const VibrантUniverse = () => {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // 手機模式下高度為原來的1/4
      if (window.innerWidth < 768) {
        canvas.height = window.innerHeight / 2;
      } else {
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();

    // 星雲波浪效果
    class NebulaWave {
      constructor() {
        this.amplitude = 100 + Math.random() * 200;
        this.frequency = 0.005 + Math.random() * 0.01;
        this.speed = 0.002 + Math.random() * 0.03;
        this.hue = Math.random() * 360;
        this.yOffset = Math.random() * canvas.height;
        this.time = 0;
      }

      update() {
        this.time += this.speed;
      }

      draw() {
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

    // 初始化星雲波浪
    const nebulaWaves = Array.from({ length: 8 }, () => new NebulaWave());

    // 背景漸變
    const createBackground = (time) => {
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

    // 主動畫循環
    const animate = () => {
      const time = Date.now() * 0.001;

      // 清空畫布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 繪製背景
      ctx.fillStyle = createBackground(time);
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 繪製星雲波浪
      nebulaWaves.forEach((wave) => {
        wave.update();
        wave.draw();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-48   bg-black relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full h-48"
        style={{ background: "linear-gradient(45deg, #0a0a0a, #1a0a2a)" }}
      />

     
    </div>
  );
};

export default VibrантUniverse;
