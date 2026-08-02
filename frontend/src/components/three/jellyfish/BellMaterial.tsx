"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend, type ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

const vertex = /* glsl */ `
  attribute float aRim;
  attribute float aAngle;

  uniform float uTime;
  uniform float uPulse;
  uniform float uScallop;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vRim;
  varying float vAngle;

  void main() {
    vRim = aRim;
    vAngle = aAngle;

    vec3 pos = position;

    // Margin contracts inward and the dome deepens — apex stays put.
    float squeeze = 1.0 - uPulse * 0.34 * aRim;
    pos.x *= squeeze;
    pos.z *= squeeze;
    pos.y *= 1.0 + uPulse * 0.10 * aRim;

    // Scalloped margin — a standing ripple around the rim, like a fringed bell edge.
    float frill = sin(aAngle * 14.0) * 0.5 + sin(aAngle * 22.0 + 1.7) * 0.5;
    float rim3 = aRim * aRim * aRim;
    pos += normalize(position + 0.0001) * frill * uScallop * rim3;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vec4 mvPosition = viewMatrix * worldPos;
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform float uFlash;
  uniform float uOpacity;
  uniform float uFresnelPower;
  uniform vec3 uColor;
  uniform vec3 uGlowColor;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vRim;
  varying float vAngle;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);
    float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), uFresnelPower);

    // Faint radial canal lines, as if seen through translucent tissue.
    float canals = smoothstep(0.94, 1.0, abs(sin(vAngle * 8.0)));

    float glowPulse = uFlash * 0.9 + uPulse * 0.25;
    vec3 base = uColor * (0.35 + 0.5 * vRim);
    vec3 rimGlow = uGlowColor * (fresnel * (0.6 + glowPulse) + canals * 0.35);

    vec3 color = base + rimGlow;
    float alpha = uOpacity * (0.28 + fresnel * 0.55 + vRim * 0.15) + uFlash * 0.25;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

export const BellMaterialImpl = shaderMaterial(
  {
    uTime: 0,
    uPulse: 0,
    uFlash: 0,
    uScallop: 0.05,
    uOpacity: 0.85,
    uFresnelPower: 2.2,
    uColor: new THREE.Color("#1b3a52"),
    uGlowColor: new THREE.Color("#6ff2e0"),
  },
  vertex,
  fragment,
);

BellMaterialImpl.key = THREE.MathUtils.generateUUID();

export type BellMaterialInstance = InstanceType<typeof BellMaterialImpl>;

extend({ BellMaterialImpl });

declare module "@react-three/fiber" {
  interface ThreeElements {
    bellMaterialImpl: ThreeElement<typeof BellMaterialImpl>;
  }
}
