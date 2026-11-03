import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Eye, Sun, Moon, RotateCcw, Sparkles } from "lucide-react";

const ThreeDRoomViewer = ({ title = "3D Virtual Room Experience" }) => {
  const mountRef = useRef(null);
  const [activeAmenity, setActiveAmenity] = useState(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // References to animate scene
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const lightsRef = useRef({});

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 600;
    const height = mount.clientHeight || 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightMode ? 0x0f111a : 0xf4f6fb);
    sceneRef.current = scene;

    // 2. Camera setup (Isometric / Perspective)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(10, 8, 10);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(isNightMode ? 0x334466 : 0xffffff, isNightMode ? 0.6 : 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(isNightMode ? 0x6C5CE7 : 0xfff3e0, isNightMode ? 1.0 : 1.8);
    sunLight.position.set(8, 12, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const deskLampLight = new THREE.PointLight(0x00CEC9, isNightMode ? 2.5 : 1.2, 8);
    deskLampLight.position.set(-2, 3.2, -2.5);
    scene.add(deskLampLight);

    lightsRef.current = { ambientLight, sunLight, deskLampLight };

    // 5. Room Geometry Materials
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x222634 : 0xe4dbcd,
      roughness: 0.6,
      metalness: 0.1,
    });

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x1a1e2d : 0xf8f9fa,
      roughness: 0.8,
    });

    const accentWallMaterial = new THREE.MeshStandardMaterial({
      color: 0x6C5CE7,
      roughness: 0.7,
    });

    const tealMaterial = new THREE.MeshStandardMaterial({
      color: 0x00CEC9,
      roughness: 0.3,
    });

    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b,
      roughness: 0.5,
    });

    const mattressMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
    });

    // Floor (7x7)
    const floor = new THREE.Mesh(new THREE.BoxGeometry(8, 0.3, 8), floorMaterial);
    floor.position.y = -0.15;
    floor.receiveShadow = true;
    scene.add(floor);

    // Back Wall (Z = -4)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 0.3), accentWallMaterial);
    backWall.position.set(0, 2.35, -4);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left Wall (X = -4)
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 8), wallMaterial);
    leftWall.position.set(-4, 2.35, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Wall Art Canvas on Back Wall
    const artFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 1.4, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    artFrame.position.set(0.5, 3.2, -3.8);
    scene.add(artFrame);

    const artCanvas = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 1.2, 0.06),
      tealMaterial
    );
    artCanvas.position.set(0.5, 3.2, -3.79);
    scene.add(artCanvas);

    // Window on Left Wall with frame
    const windowFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.2, 2.8),
      new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    windowFrame.position.set(-3.82, 3.0, 1.2);
    scene.add(windowFrame);

    const windowGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 2.0, 2.6),
      new THREE.MeshStandardMaterial({
        color: 0x81d4fa,
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
      })
    );
    windowGlass.position.set(-3.82, 3.0, 1.2);
    scene.add(windowGlass);

    // --- BED STRUCTURE ---
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.6, 4.4), woodMaterial);
    bedBase.position.set(1.8, 0.3, -1.6);
    bedBase.castShadow = true;
    bedBase.receiveShadow = true;
    scene.add(bedBase);

    const headboard = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.4), woodMaterial);
    headboard.position.set(1.8, 1.1, -3.6);
    headboard.castShadow = true;
    scene.add(headboard);

    const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.5, 4.0), mattressMaterial);
    mattress.position.set(1.8, 0.8, -1.5);
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    scene.add(mattress);

    // Duvet / Blanket
    const blanket = new THREE.Mesh(
      new THREE.BoxGeometry(3.32, 0.52, 2.6),
      new THREE.MeshStandardMaterial({ color: 0x6C5CE7, roughness: 0.6 })
    );
    blanket.position.set(1.8, 0.82, -0.7);
    blanket.castShadow = true;
    scene.add(blanket);

    // Pillows
    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.7), mattressMaterial);
    pillow1.position.set(0.9, 1.15, -3.0);
    pillow1.rotation.x = 0.2;
    scene.add(pillow1);

    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.7), mattressMaterial);
    pillow2.position.set(2.7, 1.15, -3.0);
    pillow2.rotation.x = 0.2;
    scene.add(pillow2);

    // --- STUDY DESK & ERGONOMIC CHAIR ---
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.15, 1.6), woodMaterial);
    deskTop.position.set(-2.2, 1.8, -2.6);
    deskTop.castShadow = true;
    scene.add(deskTop);

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, metalness: 0.8 });
    [
      [-3.5, 0.9, -3.2],
      [-0.9, 0.9, -3.2],
      [-3.5, 0.9, -2.0],
      [-0.9, 0.9, -2.0],
    ].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      leg.castShadow = true;
      scene.add(leg);
    });

    // Laptop on Desk
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.04, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x2d3436, metalness: 0.8, roughness: 0.3 })
    );
    laptopBase.position.set(-2.2, 1.9, -2.6);
    scene.add(laptopBase);

    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.45, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0x0984e3,
        emissive: 0x00CEC9,
        emissiveIntensity: 0.7,
      })
    );
    laptopScreen.position.set(-2.2, 2.12, -2.85);
    laptopScreen.rotation.x = -0.25;
    scene.add(laptopScreen);

    // Desk Lamp
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05), legMat);
    lampBase.position.set(-3.2, 1.9, -2.7);
    scene.add(lampBase);

    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x00CEC9, emissive: 0x00CEC9, emissiveIntensity: 0.5 })
    );
    lampShade.position.set(-3.0, 2.5, -2.7);
    lampShade.rotation.z = -0.4;
    scene.add(lampShade);

    // Wardrobe / Closet
    const wardrobe = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 4.4, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.4 })
    );
    wardrobe.position.set(-3.0, 2.2, 2.2);
    wardrobe.castShadow = true;
    wardrobe.receiveShadow = true;
    scene.add(wardrobe);

    // Air Conditioner unit on wall
    const acUnit = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.6, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
    );
    acUnit.position.set(0, 4.2, -3.75);
    scene.add(acUnit);

    // Fluffy Rug under bed
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.04, 3.8),
      new THREE.MeshStandardMaterial({ color: 0x74b9ff, roughness: 0.95 })
    );
    rug.position.set(0.6, 0.02, 0.8);
    scene.add(rug);

    // 6. Mouse drag rotation interaction
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };
    let cameraAngle = Math.PI / 4;
    let cameraElevation = 0.5;
    const cameraRadius = 14;

    const onMouseDown = (e) => {
      isDragging = true;
      setIsAutoRotating(false);
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      cameraAngle -= deltaX * 0.007;
      cameraElevation = Math.max(0.1, Math.min(Math.PI / 2.5, cameraElevation + deltaY * 0.007));

      camera.position.x = cameraRadius * Math.sin(cameraAngle) * Math.cos(cameraElevation);
      camera.position.z = cameraRadius * Math.cos(cameraAngle) * Math.cos(cameraElevation);
      camera.position.y = cameraRadius * Math.sin(cameraElevation);
      camera.lookAt(0, 1.5, 0);

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Touch support for mobile devices
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        setIsAutoRotating(false);
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;

      cameraAngle -= deltaX * 0.007;
      cameraElevation = Math.max(0.1, Math.min(Math.PI / 2.5, cameraElevation + deltaY * 0.007));

      camera.position.x = cameraRadius * Math.sin(cameraAngle) * Math.cos(cameraElevation);
      camera.position.z = cameraRadius * Math.cos(cameraAngle) * Math.cos(cameraElevation);
      camera.position.y = cameraRadius * Math.sin(cameraElevation);
      camera.lookAt(0, 1.5, 0);

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // 7. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isAutoRotating && !isDragging) {
        cameraAngle += 0.003;
        camera.position.x = cameraRadius * Math.sin(cameraAngle) * Math.cos(cameraElevation);
        camera.position.z = cameraRadius * Math.cos(cameraAngle) * Math.cos(cameraElevation);
        camera.position.y = cameraRadius * Math.sin(cameraElevation);
        camera.lookAt(0, 1.5, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      mount.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      mount.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);

      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isNightMode, isAutoRotating]);

  // Controls
  const toggleLighting = () => {
    setIsNightMode((prev) => !prev);
  };

  const resetCamera = () => {
    setIsAutoRotating(true);
    if (cameraRef.current) {
      cameraRef.current.position.set(10, 8, 10);
      cameraRef.current.lookAt(0, 1, 0);
    }
  };

  return (
    <div className="relative w-full h-[480px] md:h-[540px] rounded-3xl overflow-hidden shadow-2xl border-2 border-[#6C5CE7]/30 bg-gray-950">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge */}
      <div className="absolute top-5 left-5 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white text-sm font-semibold shadow-lg">
        <Sparkles className="w-4 h-4 text-[#00CEC9] animate-pulse" />
        <span>Interactive 3D Virtual Tour</span>
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-5 right-5 flex items-center gap-2">
        <button
          onClick={toggleLighting}
          className="p-3 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition hover:scale-110 active:scale-95 shadow-lg"
          title={isNightMode ? "Switch to Day Light" : "Switch to Ambient Night Mode"}
        >
          {isNightMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-[#00CEC9]" />}
        </button>

        <button
          onClick={resetCamera}
          className="p-3 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white transition hover:scale-110 active:scale-95 shadow-lg"
          title="Reset Camera & Auto-Rotate"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Amenity Inspector Pills */}
      <div className="absolute bottom-5 inset-x-5 flex flex-wrap items-center justify-center gap-2">
        {[
          { label: "🛏️ King Bed & Ortho Mattress", desc: "Ergonomic comfort" },
          { label: "💻 Dedicated Workstation", desc: "High-speed study table" },
          { label: "❄️ Split Air Conditioner", desc: "Climate controlled" },
          { label: "🚪 3-Door Wardrobe", desc: "Ample storage space" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="text-xs md:text-sm font-semibold px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20 hover:border-[#00CEC9] transition cursor-pointer hover:scale-105"
            onClick={() => setActiveAmenity(item.label)}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Drag Instruction Helper */}
      <div className="absolute bottom-16 left-5 text-xs text-white/70 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-lg pointer-events-none hidden sm:block">
        👆 Drag to rotate 360° | Scroll / pinch to zoom
      </div>
    </div>
  );
};

export default ThreeDRoomViewer;
