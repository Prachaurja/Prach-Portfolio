"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { getGlowTexture } from "./glowTexture";
import type { FoodParticle } from "./types";

const MAX_FOOD = 40;
const LIFETIME = 14;

export function usePlanktonField() {
  const foodRef = useRef<FoodParticle[]>([]);
  const idRef = useRef(0);

  function spawn(position: THREE.Vector3) {
    const list = foodRef.current;
    if (list.length >= MAX_FOOD) list.shift();
    list.push({
      id: idRef.current++,
      position: position.clone(),
      velocity: new THREE.Vector3((Math.random() - 0.5) * 0.05, Math.random() * 0.04, (Math.random() - 0.5) * 0.05),
      life: LIFETIME,
      seed: Math.random() * 1000,
    });
  }

  return { foodRef, spawn };
}

export default function Plankton({ foodRef }: { foodRef: RefObject<FoodParticle[]> }) {
  const texture = useMemo(() => getGlowTexture(), []);
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([]);

  useFrame((_, dt) => {
    const list = foodRef.current;
    if (!list) return;

    for (let i = list.length - 1; i >= 0; i--) {
      const f = list[i];
      f.life -= dt;
      f.position.addScaledVector(f.velocity, dt);
      if (f.life <= 0) list.splice(i, 1);
    }

    for (let i = 0; i < MAX_FOOD; i++) {
      const sprite = spriteRefs.current[i];
      if (!sprite) continue;
      const f = list[i];
      const mat = sprite.material as THREE.SpriteMaterial;
      if (f) {
        sprite.visible = true;
        sprite.position.copy(f.position);
        const fadeIn = THREE.MathUtils.clamp((LIFETIME - f.life) / 1.0, 0, 1);
        const fadeOut = THREE.MathUtils.clamp(f.life / 1.5, 0, 1);
        const fade = Math.min(fadeIn, fadeOut);
        sprite.scale.setScalar(0.14 * fade + 0.03);
        mat.opacity = 0.85 * fade;
      } else {
        sprite.visible = false;
      }
    }
  });

  return (
    <>
      {Array.from({ length: MAX_FOOD }).map((_, i) => (
        <sprite
          key={i}
          ref={(el) => {
            spriteRefs.current[i] = el;
          }}
          visible={false}
        >
          <spriteMaterial
            map={texture}
            color="#d8fff0"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </sprite>
      ))}
    </>
  );
}
