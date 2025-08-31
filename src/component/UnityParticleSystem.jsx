import * as THREE from "three";
import { useRef, useEffect } from "react";

function UnityParticleSystem() {
  // React Hooks: useRef
  // 創建一個可變引用對象來存儲canvas DOM元素的引用
  // 這個引用不會觸發重新渲染，且在整個生命週期保持不變
  const canvasRef = useRef(null);

  // React Hooks: useEffect
  // 處理副作用，只在組件掛載時執行一次(空依賴陣列[])
  // 負責初始化Three.js場景、動畫循環和清理資源
  useEffect(() => {
    // 初始化 Three.js 核心對象
    const scene = new THREE.Scene(); // 創建3D場景容器
    const camera = new THREE.PerspectiveCamera(
      75, // 視野角度(FOV)
      window.innerWidth / window.innerHeight, // 長寬比
      0.1, // 近裁剪面
      1000 // 遠裁剪面
    );
    // 初始化渲染器，將canvasRef.current作為渲染目標
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight); // 設置渲染尺寸

    // 粒子系統配置
    const particleCount = 10000; // 總粒子數
    const particles = new THREE.BufferGeometry(); // 創建緩衝幾何體對象

    // 陣列數據處理: 創建TypedArray來存儲粒子數據
    // Float32Array是JavaScript的類型化陣列，用於高效存儲二進制浮點數據
    const positions = new Float32Array(particleCount * 3); // 每個粒子需要xyz三個值
    const colors = new Float32Array(particleCount * 3); // 每個粒子的RGB三個值

    // 陣列操作: 填充粒子位置和顏色數據
    for (let i = 0; i < particleCount; i++) {
      // 計算陣列索引基址
      const i3 = i * 3;

      // 隨機分佈粒子在 3D 空間
      // 通過(Math.random() - 0.5)生成-0.5到0.5之間的值，再乘以1000調整範圍
      positions[i3] = (Math.random() - 0.5) * 1000; // X坐標
      positions[i3 + 1] = (Math.random() - 0.5) * 1000; // Y坐標
      positions[i3 + 2] = (Math.random() - 0.5) * 1000; // Z坐標

      // 設置粒子顏色 - 藍紫色調範圍
      colors[i3] = Math.random() * 0.5 + 0.5; // R: 0.5-1.0之間
      colors[i3 + 1] = Math.random() * 0.3; // G: 0-0.3之間
      colors[i3 + 2] = Math.random() * 0.7 + 0.3; // B: 0.3-1.0之間
    }

    // 將位置和顏色數據設置為緩衝幾何體的屬性
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // 創建粒子材質對象
    const material = new THREE.PointsMaterial({
      size: 2, // 粒子大小
      vertexColors: true, // 使用頂點顏色
      transparent: true, // 啟用透明度
      opacity: 0.6, // 設置透明度
      blending: THREE.AdditiveBlending, // 加法混合模式，使重疊粒子顏色更亮
    });

    // 創建粒子系統對象並加入場景
    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    // 設置相機位置
    camera.position.z = 500;

    // 動畫循環函數
    let animationId; // 存儲動畫幀ID，用於後續清理
    function animate() {
      // 請求下一幀動畫，並保存ID用於清理
      animationId = requestAnimationFrame(animate);
      // 每幀旋轉粒子系統
      particleSystem.rotation.y += 0.001;
      // 渲染當前幀
      renderer.render(scene, camera);
    }
    animate(); // 啟動動畫循環

    // 響應式處理 - 視窗大小改變事件處理器
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix(); // 更新相機投影矩陣
    };
    // 添加視窗大小變化事件監聽
    window.addEventListener("resize", handleResize);

    // 清除資源 - 返回清理函數
    // useEffect的返回函數會在組件卸載時被調用
    return () => {
      window.removeEventListener("resize", handleResize); // 移除事件監聽
      cancelAnimationFrame(animationId); // 取消動畫循環
      renderer.dispose(); // 釋放渲染器資源
    };
  }, []); // 空依賴數組表示此效果只在組件掛載時執行一次

  // 組件渲染JSX
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
      {/* Canvas元素與ref關聯，作為Three.js渲染目標 */}
      <canvas
        ref={canvasRef}
        className="w-full h-full max-h-2vh absolute top-0 left-0"
      />
    </div>
  );
}

export default UnityParticleSystem;
