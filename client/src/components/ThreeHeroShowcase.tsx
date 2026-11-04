import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL support
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return; // gracefully fallback
    }

    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    // Group for mouse interaction
    const group = new THREE.Group();
    scene.add(group);

    // 1. Center Luxury Faceted Prism (Perfume / Gemstone Motif)
    const prismGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0x173F46,
      emissive: 0x0f2c31,
      roughness: 0.1,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    group.add(prism);

    // 2. Gold Filigree Orbit Ring (Indian Jewelry / Silk Loop Motif)
    const ringGeo = new THREE.TorusGeometry(2.3, 0.04, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xF2D9A6,
      metalness: 0.9,
      roughness: 0.2
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    group.add(ring);

    // 3. Second Coral Orbital Ring
    const ring2Geo = new THREE.TorusGeometry(2.6, 0.025, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xF26B4F,
      metalness: 0.8,
      roughness: 0.3
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // 4. Subtle Floating Stardust Particles
    const particleCount = 28;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 5.5;
      positions[i + 1] = (Math.random() - 0.5) * 5.5;
      positions[i + 2] = (Math.random() - 0.5) * 3;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xF2D9A6,
      size: 0.08,
      transparent: true,
      opacity: 0.8
    });
    const particles = new THREE.Points(particlesGeo, particleMat);
    group.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ef, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xF2D9A6, 2.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xF26B4F, 2.0);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damped mouse following
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      group.rotation.y = elapsedTime * 0.35 + mouseX;
      group.rotation.x = Math.sin(elapsedTime * 0.25) * 0.2 + mouseY;

      prism.rotation.y = elapsedTime * 0.5;
      ring.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      prismGeo.dispose();
      prismMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particlesGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[250px] sm:h-[320px] md:h-[380px] flex items-center justify-center">
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
      />
      <div className="absolute bottom-2 text-center pointer-events-none">
        <span className="text-[10px] sm:text-[11px] font-medium tracking-widest text-[#173F46]/70 uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white/70 backdrop-blur border border-[#F2D9A6]/50">
          ✦ Interactive 3D Heritage Emblem ✦
        </span>
      </div>
    </div>
  );
};
