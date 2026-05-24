"use client";

import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

interface PlanetSceneProps {
  baseColor: string;
  atmosphereHint: string;
  hasRvOverlay?: boolean;
}

function Planet({ baseColor }: { baseColor: string }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.4, 64, 64]} />
      <meshStandardMaterial color={baseColor} roughness={0.85} metalness={0.05} />
    </mesh>
  );
}

function Atmosphere({ baseColor }: { baseColor: string }) {
  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[1.4, 32, 32]} />
      <meshBasicMaterial color={baseColor} transparent opacity={0.12} />
    </mesh>
  );
}

export function PlanetScene({ baseColor, hasRvOverlay = false }: PlanetSceneProps) {
  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-[var(--border)] bg-black">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
        <color attach="background" args={[hasRvOverlay ? "#08051a" : "#020408"]} />
        <ambientLight intensity={hasRvOverlay ? 0.35 : 0.25} />
        <directionalLight position={[5, 3, 5]} intensity={1.4} color={hasRvOverlay ? "#c4b5fd" : "#ffffff"} />
        <Stars radius={80} depth={40} count={3000} factor={3} fade speed={0.5} />
        <Planet baseColor={baseColor} />
        <Atmosphere baseColor={baseColor} />
        <OrbitControls enablePan={false} minDistance={3} maxDistance={8} />
      </Canvas>
    </div>
  );
}
