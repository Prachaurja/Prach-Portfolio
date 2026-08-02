"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import * as THREE from "three";
import type { PointerState } from "./types";

export default function CursorLight({ pointerRef }: { pointerRef: RefObject<PointerState> }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((_, dt) => {
    const light = lightRef.current;
    const pointer = pointerRef.current;
    if (!light || !pointer) return;
    light.position.lerp(pointer.world, Math.min(1, dt * 8));
    const targetIntensity = pointer.active ? (pointer.repel ? 3.2 : 2.4) : 1.4;
    light.intensity = THREE.MathUtils.lerp(light.intensity, targetIntensity, Math.min(1, dt * 5));
  });

  return (
    <pointLight
      ref={lightRef}
      color={"#bfe8ff"}
      intensity={1.4}
      distance={7}
      decay={2}
    />
  );
}
