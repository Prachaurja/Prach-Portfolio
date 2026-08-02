"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { getBeamTexture } from "./beamTexture";

const TOP_COLOR = new THREE.Color("#0c3b52");
const BOTTOM_COLOR = new THREE.Color("#010508");

function createBackgroundGeometry(radius: number) {
  const geometry = new THREE.SphereGeometry(radius, 32, 24);
  const pos = geometry.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp((pos.getY(i) / radius + 1) / 2, 0, 1);
    tmp.copy(BOTTOM_COLOR).lerp(TOP_COLOR, t);
    colors[i * 3] = tmp.r;
    colors[i * 3 + 1] = tmp.g;
    colors[i * 3 + 2] = tmp.b;
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

function OceanBackground({ radius }: { radius: number }) {
  const geometry = useMemo(() => createBackgroundGeometry(radius), [radius]);
  return (
    <mesh geometry={geometry} renderOrder={-10}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} depthWrite={false} fog={false} toneMapped={false} />
    </mesh>
  );
}

const SNOW_COUNT = 1400;

function buildSnowPositions(radius: number): Float32Array {
  const arr = new Float32Array(SNOW_COUNT * 3);
  for (let i = 0; i < arr.length; i += 3) {
    arr[i] = (Math.random() - 0.5) * radius * 2.1;
    arr[i + 1] = (Math.random() - 0.5) * radius * 2.1;
    arr[i + 2] = (Math.random() - 0.5) * radius * 2.1;
  }
  return arr;
}

function MarineSnow({ radius }: { radius: number }) {
  const positions = useMemo(() => buildSnowPositions(radius), [radius]);

  const groupRef = useRef<THREE.Points>(null);
  const geomRef = useRef<THREE.BufferGeometry>(null);

  useFrame((_, dt) => {
    const geom = geomRef.current;
    if (geom) {
      const attr = geom.attributes.position as THREE.BufferAttribute;
      const arr = attr.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
        arr[i] -= dt * 0.045;
        if (arr[i] < -radius) arr[i] += radius * 2.1;
      }
      attr.needsUpdate = true;
    }
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.008;
  });

  return (
    <points ref={groupRef}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
        color="#bfe8ff"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        fog={false}
      />
    </points>
  );
}

function LightRays() {
  const texture = useMemo(() => getBeamTexture(), []);
  const beams = useMemo(
    () => [
      { x: -6, z: -3, rot: 0.12, scale: 1.3, speed: 0.5, phase: 0 },
      { x: 3, z: -6, rot: -0.08, scale: 1.0, speed: 0.4, phase: 1.4 },
      { x: -2, z: 4, rot: 0.06, scale: 1.6, speed: 0.35, phase: 2.7 },
      { x: 7, z: 2, rot: -0.1, scale: 1.1, speed: 0.45, phase: 4.1 },
    ],
    [],
  );
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    beams.forEach((b, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      mesh.rotation.z = b.rot + Math.sin(t * b.speed + b.phase) * 0.05;
    });
  });

  return (
    <group position={[0, 14, 0]}>
      {beams.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[b.x, 0, b.z]}
          rotation={[0, 0, b.rot]}
          scale={[6 * b.scale, 26 * b.scale, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function OceanEnvironment({ boundsRadius }: { boundsRadius: number }) {
  return (
    <>
      <fogExp2 attach="fog" args={["#02141d", 0.032]} />
      <OceanBackground radius={boundsRadius * 2.4} />
      <MarineSnow radius={boundsRadius * 1.5} />
      <LightRays />
      <ambientLight intensity={0.35} color="#3f7f95" />
      <directionalLight position={[4, 12, 6]} intensity={0.25} color="#bfe8ff" />
    </>
  );
}
