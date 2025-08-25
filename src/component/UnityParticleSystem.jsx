import * as THREE from "three";
import React, { useRef, useEffect } from "react";
function UnityParticleSystem() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    // 初始化 Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 創建粒子系統
    const particleCount = 10000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // 隨機分佈粒子在 3D 空間
      positions[i * 3] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000;

      // 設置粒子顏色（模擬星雲的藍紫色調）
      colors[i * 3] = Math.random() * 0.5 + 0.5; // R
      colors[i * 3 + 1] = Math.random() * 0.3; // G
      colors[i * 3 + 2] = Math.random() * 0.7 + 0.3; // B
    }

    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 創建材質
    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending, // 模擬發光效果
    });

    // 創建粒子系統並加入場景
    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    // 設置相機位置
    camera.position.z = 500;

    // 動畫循環
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);
      particleSystem.rotation.y += 0.001; // 旋轉粒子系統
      renderer.render(scene, camera);
    }
    animate();

    // 響應式處理
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // 清除資源
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-screen h-screen flex flex-col items-center">
      <div className="relative flex items-center justify-center text-center">
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="sm:text-6xl text-3xl font-bold mt-10 not-first:drop-shadow-lg">
            Elon Musk： <br /> 改變世界的實踐家
          </h1>
          <p className="text-xl mt-10 leading-loose">
            馬斯克不只是一位企業家，更是一位推動人類科技進步的夢想家。他用創新和勇氣，挑戰看似不可能的夢想，從電動車到太空探索，不斷顛覆我們對未來的想像。
          </p>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full h-full max-h-2vh absolute top-0 left-0" />
    </div>
  );
}

export default UnityParticleSystem;
