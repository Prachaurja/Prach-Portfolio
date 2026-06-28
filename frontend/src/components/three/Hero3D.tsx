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
    // slow ambient rotation
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.015;
    // gentle drift toward mouse
    const { x, y } = state.pointer;
    ref.current.rotation.y += x * delta * 0.15;
    ref.current.rotation.x += y * delta * 0.15;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#7dd3fc"
        size={0.018}
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
      className="!absolute inset-0 -z-10"
      gl={{ antialias: true, alpha: true }}
    >
      <ParticleField />
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}