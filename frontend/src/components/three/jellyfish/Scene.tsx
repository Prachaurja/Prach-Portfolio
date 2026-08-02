"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import CursorLight from "./CursorLight";
import JellyfishSwarm from "./JellyfishSwarm";
import OceanEnvironment from "./OceanEnvironment";
import Plankton from "./Plankton";
import PointerTracker from "./PointerTracker";
import type { FoodParticle, PointerState } from "./types";

export interface SceneSettings {
  jellyfishCount: number;
  glowIntensity: number;
  currentStrength: number;
  autoRotate: boolean;
  flashlightOn: boolean;
  repelMode: boolean;
}

interface SceneProps {
  settings: SceneSettings;
  foodRef: RefObject<FoodParticle[]>;
  spawnFood: (pos: THREE.Vector3) => void;
}

const BOUNDS_RADIUS = 8.5;
const TAP_MAX_DIST = 6;
const TAP_MAX_MS = 260;

export default function Scene({ settings, foodRef, spawnFood }: SceneProps) {
  const pointerRef = useRef<PointerState>({ active: false, repel: false, world: new THREE.Vector3() });
  const downInfo = useRef<{ x: number; y: number; t: number } | null>(null);

  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 1.4, 13], fov: 48 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
      onContextMenu={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        pointerRef.current.active = true;
        pointerRef.current.repel = e.button === 2 || e.shiftKey || settings.repelMode;
        downInfo.current = { x: e.clientX, y: e.clientY, t: performance.now() };
      }}
      onPointerUp={(e) => {
        const info = downInfo.current;
        const wasRepel = pointerRef.current.repel;
        pointerRef.current.active = false;
        if (info) {
          const dist = Math.hypot(e.clientX - info.x, e.clientY - info.y);
          const elapsed = performance.now() - info.t;
          if (dist < TAP_MAX_DIST && elapsed < TAP_MAX_MS && !wasRepel) {
            spawnFood(pointerRef.current.world.clone());
          }
        }
        downInfo.current = null;
      }}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
    >
      <PointerTracker pointerRef={pointerRef} />
      <OceanEnvironment boundsRadius={BOUNDS_RADIUS} />
      <JellyfishSwarm
        count={settings.jellyfishCount}
        boundsRadius={BOUNDS_RADIUS}
        currentStrength={settings.currentStrength}
        glowIntensity={settings.glowIntensity}
        pointerRef={pointerRef}
        foodRef={foodRef}
      />
      <Plankton foodRef={foodRef} />
      {settings.flashlightOn && <CursorLight pointerRef={pointerRef} />}
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        autoRotate={settings.autoRotate}
        autoRotateSpeed={0.35}
        minDistance={5}
        maxDistance={22}
        target={[0, 0, 0]}
      />
      <EffectComposer>
        <Bloom
          intensity={0.9 * settings.glowIntensity}
          luminanceThreshold={0.12}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.6} />
      </EffectComposer>
    </Canvas>
  );
}
