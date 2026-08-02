"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import type { BellMaterialInstance } from "./BellMaterial";
import "./BellMaterial";
import { createBellGeometry } from "./bellGeometry";
import { getGlowTexture } from "./glowTexture";
import type { JellyfishState } from "./physics";

interface LineHandle {
  geometry: { setPositions: (arr: Float32Array | number[]) => void };
}

export interface JellyfishHandles {
  bellGroup: THREE.Group;
  bellMat: BellMaterialInstance;
  glowMat: THREE.MeshBasicMaterial;
  flashMat: THREE.SpriteMaterial;
  flashSprite: THREE.Sprite;
  tentacleLines: LineHandle[];
  oralLines: LineHandle[];
}

export interface JellyfishPalette {
  base: THREE.Color;
  glow: THREE.Color;
}

interface JellyfishProps {
  state: JellyfishState;
  palette: JellyfishPalette;
  onMount: (handles: JellyfishHandles) => void;
  onUnmount: () => void;
}

function toPointArray(cur: Float32Array): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i < cur.length; i += 3) {
    pts.push([cur[i], cur[i + 1], cur[i + 2]]);
  }
  return pts;
}

export default function Jellyfish({ state, palette, onMount, onUnmount }: JellyfishProps) {
  const bellGeometry = useMemo(() => createBellGeometry(state.config.bellRadius), [state.config.bellRadius]);
  const glowTexture = useMemo(() => getGlowTexture(), []);

  const bellGroupRef = useRef<THREE.Group>(null);
  const bellMatRef = useRef<BellMaterialInstance>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const flashMatRef = useRef<THREE.SpriteMaterial>(null);
  const flashSpriteRef = useRef<THREE.Sprite>(null);
  const tentacleRefs = useRef<(LineHandle | null)[]>([]);
  const oralRefs = useRef<(LineHandle | null)[]>([]);

  useEffect(() => {
    if (
      !bellGroupRef.current ||
      !bellMatRef.current ||
      !glowMatRef.current ||
      !flashMatRef.current ||
      !flashSpriteRef.current
    ) {
      return;
    }
    onMount({
      bellGroup: bellGroupRef.current,
      bellMat: bellMatRef.current,
      glowMat: glowMatRef.current,
      flashMat: flashMatRef.current,
      flashSprite: flashSpriteRef.current,
      tentacleLines: tentacleRefs.current.filter((l): l is LineHandle => !!l),
      oralLines: oralRefs.current.filter((l): l is LineHandle => !!l),
    });
    return () => onUnmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bellColor = palette.base;
  const glowColor = palette.glow;

  return (
    <group>
      <group ref={bellGroupRef}>
        <mesh geometry={bellGeometry}>
          <bellMaterialImpl
            ref={bellMatRef}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            uColor={bellColor}
            uGlowColor={glowColor}
          />
        </mesh>
        <mesh geometry={bellGeometry} scale={1.2}>
          <meshBasicMaterial
            ref={glowMatRef}
            color={glowColor}
            transparent
            opacity={0}
            side={THREE.BackSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <sprite ref={flashSpriteRef} scale={[state.config.bellRadius * 2.6, state.config.bellRadius * 2.6, 1]}>
          <spriteMaterial
            ref={flashMatRef}
            map={glowTexture}
            color={glowColor}
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      </group>

      {state.tentacles.map((chain, i) => (
        <Line
          key={`t${i}`}
          ref={(el) => {
            tentacleRefs.current[i] = el as unknown as LineHandle | null;
          }}
          points={toPointArray(chain.cur)}
          color={glowColor}
          transparent
          opacity={0.55}
          lineWidth={1.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      ))}

      {state.oralArms.map((chain, i) => (
        <Line
          key={`o${i}`}
          ref={(el) => {
            oralRefs.current[i] = el as unknown as LineHandle | null;
          }}
          points={toPointArray(chain.cur)}
          color={glowColor}
          transparent
          opacity={0.75}
          lineWidth={2.4}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      ))}
    </group>
  );
}
