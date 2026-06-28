import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ModelViewer({ src, height = '500px', bgColor = '#0A0A0F' }) {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [state, setState] = useState('idle'); // idle | loading | ready | error
  const [errorMsg, setErrorMsg] = useState(null);

  // Manual load trigger
  const startLoad = () => {
    setState('loading');
    setProgress(0);
    setErrorMsg(null);
  };

  useEffect(() => {
    if (state !== 'loading') return;
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(5, 3, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controls.target.set(0, 0.8, 0);
    controls.update();

    // Lighting (minimal)
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(5, 8, 5);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0x9eb2eb, 0.3));

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    scene.add(ground);

    // Load FBX
    const loader = new FBXLoader();
    try {
      loader.load(
        src,
        (fbx) => {
          if (disposed) { scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); renderer.dispose(); return; }
          try {
            const box = new THREE.Box3().setFromObject(fbx);
            const size = box.getSize(new THREE.Vector3()).length();
            const s = 4 / size;
            fbx.scale.setScalar(s);
            const center = box.getCenter(new THREE.Vector3());
            fbx.position.set(-center.x * s, -center.y * s + 0.5, -center.z * s);
            fbx.traverse((child) => {
              if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; }
            });
            scene.add(fbx);
            setState('ready');
          } catch (e) {
            console.error('FBX processing error:', e);
            setErrorMsg('模型处理失败，文件可能过大');
            setState('error');
            scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
            renderer.dispose();
          }
        },
        (xhr) => {
          if (disposed) return;
          if (xhr.lengthComputable) {
            setProgress(Math.round((xhr.loaded / xhr.total) * 100));
          }
        },
        (err) => {
          if (disposed) return;
          console.error('FBX load error:', err);
          setErrorMsg('模型加载失败，尝试用优化后的 GLB 替换或降低精度');
          setState('error');
        }
      );
    } catch (e) {
      console.error('FBX init error:', e);
      setErrorMsg('加载器初始化失败');
      setState('error');
    }

    // Animation loop
    let animId;
    function animate() {
      if (disposed) return;
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    function onResize() {
      if (!container || disposed) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      if (container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [state, src, bgColor]);

  return (
    <div ref={containerRef} style={{ width: '100%', height, position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
      {/* Idle: click to load */}
      {state === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 cursor-pointer" style={{ backgroundColor: bgColor }} onClick={startLoad}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: 'rgba(140,156,202,0.15)' }}>
            <svg className="w-6 h-6" style={{ color: '#8C9CCA' }} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <p className="text-sm tracking-wide" style={{ color: '#aaa' }}>点击加载 3D 模型</p>
          <p className="mt-1 text-xs" style={{ color: '#555' }}>258 MB · 可能导致卡顿</p>
        </div>
      )}

      {/* Loading */}
      {state === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10" style={{ backgroundColor: bgColor }}>
          <div className="w-48 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: '#8C9CCA' }} />
          </div>
          <p className="mt-3 text-xs tracking-wide" style={{ color: '#888' }}>
            {progress > 0 ? `加载中 ${progress}%` : '正在加载 3D 模型...'}
          </p>
        </div>
      )}

      {/* Error */}
      {state === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-2" style={{ backgroundColor: bgColor }}>
          <p className="text-sm" style={{ color: '#e55' }}>{errorMsg}</p>
          <button onClick={startLoad} className="mt-3 px-4 py-1.5 text-xs rounded transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }}>
            重新加载
          </button>
        </div>
      )}
    </div>
  );
}
