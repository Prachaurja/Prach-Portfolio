"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef } from "react";
import * as THREE from "three";

const PARTICLE_POSITIONS = (() => {
  const p = new Float32Array(4000 * 3);
  for (let i = 0; i < p.length; i++) p[i] = (Math.random() - 0.5) * 10;
  return p;
})();

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const positions = PARTICLE_POSITIONS;

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.015;
    const { x, y } = state.pointer;
    ref.current.rotation.y += x * delta * 0.15;
    ref.current.rotation.x += y * delta * 0.15;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#dcdce4"
        size={0.016}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4] }}
      className="!fixed inset-0 -z-10"
      gl={{ antialias: true, alpha: true }}
    >
      <ParticleField />
      <EffectComposer>
        <Bloom
          intensity={1.0}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}