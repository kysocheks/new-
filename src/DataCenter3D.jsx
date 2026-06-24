import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* SCROLL CAMERA */
function ScrollCamera() {
  const { camera } = useThree();
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame(() => {
    const t = scrollRef.current;
    const baseZ = 18;
    const targetZ = baseZ + t * 12;
    const targetY = 6 - t * 4;
    camera.position.z += (targetZ - camera.position.z) * 0.03;
    camera.position.y += (targetY - camera.position.y) * 0.03;
    camera.lookAt(0, 1, 0);
  });

  return null;
}

/* SERVER RACK */
function ServerRack({ position, scale = 1 }) {
  const lightsRef = useRef([]);
  const groupRef = useRef();

  const lights = useMemo(() => {
    const arr = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        arr.push({
          pos: [-0.3 + col * 0.3, -0.6 + row * 0.4, 0.26],
          color: Math.random() > 0.3 ? '#00ff88' : '#0066ff',
          speed: Math.random() * 2 + 1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    lightsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const l = lights[i];
      const v = (Math.sin(t * l.speed + l.phase) + 1) / 2;
      mesh.material.emissiveIntensity = 0.3 + v * 1.5;
    });
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* rack body */}
      <mesh>
        <boxGeometry args={[1.2, 1.8, 0.5]} />
        <meshStandardMaterial color="#0a0e1a" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* front panel */}
      <mesh position={[0, 0, 0.26]}>
        <boxGeometry args={[1.1, 1.7, 0.02]} />
        <meshStandardMaterial color="#111827" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* LED lights */}
      {lights.map((l, i) => (
        <mesh
          key={i}
          ref={(el) => (lightsRef.current[i] = el)}
          position={l.pos}
        >
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial
            color={l.color}
            emissive={l.color}
            emissiveIntensity={1}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* glow halo */}
      <pointLight position={[0, 0, 0.8]} color="#00ff88" intensity={0.3} distance={3} />
    </group>
  );
}

/* TRAFFIC PARTICLES */
function TrafficParticles({ count = 60 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 8;
      arr.push({
        angle,
        radius,
        speed: (Math.random() * 0.3 + 0.1) * (Math.random() > 0.5 ? 1 : -1),
        yOffset: (Math.random() - 0.5) * 6,
        size: Math.random() * 0.06 + 0.02,
        isGreen: Math.random() > 0.4,
      });
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      const a = p.angle + t * p.speed;
      const x = Math.cos(a) * p.radius;
      const z = Math.sin(a) * p.radius;
      const y = p.yOffset + Math.sin(t * 0.5 + p.angle) * 0.5;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#00ff88"
        emissive="#00ff88"
        emissiveIntensity={2}
        toneMapped={false}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  );
}

/* HOLOGRAPHIC GLOBE */
function HoloGlobe() {
  const groupRef = useRef();
  const ringsRef = useRef([]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  const ringLines = useMemo(() => {
    const lines = [];
    // latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const r = 2.5 * Math.cos((lat * Math.PI) / 180);
      const y = 2.5 * Math.sin((lat * Math.PI) / 180);
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r));
      }
      lines.push(points);
    }
    // longitude lines
    for (let lon = 0; lon < 180; lon += 30) {
      const points = [];
      for (let i = 0; i <= 64; i++) {
        const lat = (i / 64) * Math.PI - Math.PI / 2;
        const a = (lon * Math.PI) / 180;
        points.push(
          new THREE.Vector3(
            Math.cos(lat) * Math.cos(a) * 2.5,
            Math.sin(lat) * 2.5,
            Math.cos(lat) * Math.sin(a) * 2.5
          )
        );
      }
      lines.push(points);
    }
    return lines;
  }, []);

  // continent dots
  const continentDots = useMemo(() => {
    const dots = [
      { lat: 40, lon: -100 }, { lat: 50, lon: 15 }, { lat: 35, lon: 105 },
      { lat: -15, lon: -60 }, { lat: 5, lon: 25 }, { lat: -25, lon: 135 },
    ];
    return dots.map((d) => {
      const phi = (90 - d.lat) * (Math.PI / 180);
      const theta = (d.lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(2.55 * Math.sin(phi) * Math.cos(theta)),
        2.55 * Math.cos(phi),
        2.55 * Math.sin(phi) * Math.sin(theta)
      );
    });
  }, []);

  return (
    <group ref={groupRef} position={[8, 2, -5]}>
      {ringLines.map((pts, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <line key={i} geometry={geo}>
            <lineBasicMaterial color="#00ff88" transparent opacity={0.12} />
          </line>
        );
      })}
      {continentDots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* glow sphere */}
      <mesh>
        <sphereGeometry args={[2.48, 16, 16]} />
        <meshStandardMaterial
          color="#00ff88"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

/* FLOOR GRID */
function FloorGrid() {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.opacity = 0.08 + Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
    }
  });

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
      <planeGeometry args={[60, 60, 30, 30]} />
      <meshStandardMaterial
        color="#00ff88"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

/* SCENE */
function Scene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const rackCount = isMobile ? 4 : 8;
  const particleCount = isMobile ? 30 : 60;

  const racks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < rackCount; i++) {
      const row = Math.floor(i / (rackCount / 2));
      const col = i % (rackCount / 2);
      arr.push({
        position: [
          -3 + col * 2.5,
          0,
          -3 + row * 4,
        ],
        scale: isMobile ? 0.6 : 0.8,
      });
    }
    return arr;
  }, [rackCount, isMobile]);

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 5]} color="#00ff88" intensity={0.4} distance={20} />
      <pointLight position={[-5, 3, -3]} color="#0066ff" intensity={0.3} distance={15} />
      <pointLight position={[5, 3, -3]} color="#0066ff" intensity={0.3} distance={15} />

      <ScrollCamera />
      <FloorGrid />

      {racks.map((r, i) => (
        <ServerRack key={i} position={r.position} scale={r.scale} />
      ))}

      <TrafficParticles count={particleCount} />
      <HoloGlobe />

      {/* fog */}
      <fog attach="fog" args={['#05080f', 10, 35]} />
    </>
  );
}

/* LOADER */
function Loader() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#05080f',
      zIndex: 2,
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid #1e1e2a',
        borderTopColor: '#00ff88',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  );
}

/* EXPORT */
export default function DataCenter3D() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (isMobile) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Suspense fallback={<Loader />}>
        <Canvas
          camera={{ position: [0, 6, 18], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
      {/* dark overlay gradient for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(5,8,15,0.7) 0%, rgba(5,8,15,0.4) 40%, rgba(5,8,15,0.6) 70%, rgba(5,8,15,0.85) 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
