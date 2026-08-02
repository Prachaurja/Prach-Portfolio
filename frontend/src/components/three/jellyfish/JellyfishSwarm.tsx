"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import Jellyfish, { type JellyfishHandles, type JellyfishPalette } from "./Jellyfish";
import { createJellyfishState, stepJellyfish, type JellyfishConfig, type JellyfishState, type SwimEnvironment } from "./physics";
import type { FoodParticle, PointerState } from "./types";

const HUES = [0.5, 0.56, 0.62, 0.72, 0.46, 0.8];

function randRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function makePalette(index: number): JellyfishPalette {
  const hue = (HUES[index % HUES.length] + randRange(-0.02, 0.02) + 1) % 1;
  return {
    base: new THREE.Color().setHSL(hue, 0.45, 0.14),
    glow: new THREE.Color().setHSL(hue, 0.9, 0.6),
  };
}

function randomSpawnPosition(boundsRadius: number): THREE.Vector3 {
  return new THREE.Vector3().randomDirection().multiplyScalar(boundsRadius * 0.55 * Math.random());
}

function makeConfig(index: number): JellyfishConfig {
  const radius = randRange(0.55, 1.15);
  return {
    bellRadius: radius,
    tentacleCount: 8,
    tentacleSegments: 7,
    tentacleLength: radius * randRange(3.2, 5.5),
    oralArmCount: 4,
    oralArmSegments: 6,
    oralArmLength: radius * randRange(1.6, 2.4),
    pulseSpeed: randRange(0.32, 0.5),
    hue: 0,
    seed: index * 13.37 + Math.random() * 100,
  };
}

interface JellyfishSwarmProps {
  count: number;
  boundsRadius: number;
  currentStrength: number;
  glowIntensity: number;
  pointerRef: React.RefObject<PointerState>;
  foodRef: React.RefObject<FoodParticle[]>;
}

export default function JellyfishSwarm({
  count,
  boundsRadius,
  currentStrength,
  glowIntensity,
  pointerRef,
  foodRef,
}: JellyfishSwarmProps) {
  const states = useMemo(() => {
    const arr: JellyfishState[] = [];
    for (let i = 0; i < count; i++) {
      const cfg = makeConfig(i);
      const pos = randomSpawnPosition(boundsRadius);
      arr.push(createJellyfishState(cfg, pos));
    }
    return arr;
  }, [count, boundsRadius]);

  const palettes = useMemo(() => states.map((_, i) => makePalette(i)), [states]);

  const handlesRef = useRef<Map<number, JellyfishHandles>>(new Map());
  const envRef = useRef<SwimEnvironment>({
    pointerActive: false,
    pointerRepel: false,
    pointerWorld: new THREE.Vector3(),
    current: new THREE.Vector3(),
    boundsCenter: new THREE.Vector3(),
    boundsRadius,
    neighbors: states,
    food: [],
    elapsed: 0,
  });

  useFrame((three, dt) => {
    const env = envRef.current;
    env.boundsRadius = boundsRadius;
    env.neighbors = states;
    env.elapsed = three.clock.elapsedTime;

    const pointer = pointerRef.current;
    env.pointerActive = pointer?.active ?? false;
    env.pointerRepel = pointer?.repel ?? false;
    if (pointer) env.pointerWorld.copy(pointer.world);

    const t = env.elapsed;
    env.current
      .set(Math.cos(t * 0.05), Math.sin(t * 0.035) * 0.25, Math.sin(t * 0.045))
      .multiplyScalar(currentStrength);

    const food = foodRef.current ?? [];
    env.food.length = 0;
    for (const f of food) env.food.push(f.position);

    for (let i = 0; i < states.length; i++) {
      const state = states[i];
      stepJellyfish(state, Math.min(dt, 1 / 20), env);

      const h = handlesRef.current.get(i);
      if (!h) continue;

      h.bellGroup.position.copy(state.position);
      h.bellGroup.quaternion.copy(state.quaternion);
      h.bellMat.uTime = t;
      h.bellMat.uPulse = state.pulseShape;
      h.bellMat.uFlash = state.flash;
      h.glowMat.opacity = THREE.MathUtils.clamp(
        (0.1 + state.flash * 0.55 + state.pulseShape * 0.14) * glowIntensity,
        0,
        1,
      );
      h.flashMat.opacity = THREE.MathUtils.clamp(state.flash * 0.85 * glowIntensity, 0, 1);
      h.flashSprite.position.copy(state.position);

      for (let j = 0; j < state.tentacles.length; j++) {
        h.tentacleLines[j]?.geometry.setPositions(state.tentacles[j].cur);
      }
      for (let j = 0; j < state.oralArms.length; j++) {
        h.oralLines[j]?.geometry.setPositions(state.oralArms[j].cur);
      }
    }
  });

  return (
    <>
      {states.map((state, i) => (
        <Jellyfish
          key={i}
          state={state}
          palette={palettes[i]}
          onMount={(h) => handlesRef.current.set(i, h)}
          onUnmount={() => handlesRef.current.delete(i)}
        />
      ))}
    </>
  );
}
