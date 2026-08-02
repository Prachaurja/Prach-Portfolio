import * as THREE from "three";

// Builds a jellyfish bell as a partial-sphere dome and tags every vertex
// with how close it is to the rim (0 = apex, 1 = margin). The bell shader
// uses that to concentrate the pulse-squeeze and the scalloped frill at
// the edge, the way a real medusa's margin does the work while the apex
// stays comparatively still.
export function createBellGeometry(radius: number, radialSegments = 40, heightSegments = 18): THREE.BufferGeometry {
  const domeAngle = Math.PI * 0.56; // how far past the pole the dome opens
  const geometry = new THREE.SphereGeometry(
    radius,
    radialSegments,
    heightSegments,
    0,
    Math.PI * 2,
    0,
    domeAngle,
  );

  const pos = geometry.attributes.position;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  const rim = new Float32Array(pos.count);
  const angle = new Float32Array(pos.count);
  const range = Math.max(maxY - minY, 1e-5);
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = 1 - (y - minY) / range; // 0 at apex, 1 at rim
    rim[i] = Math.pow(t, 1.6);
    angle[i] = Math.atan2(pos.getZ(i), pos.getX(i));
  }

  geometry.setAttribute("aRim", new THREE.BufferAttribute(rim, 1));
  geometry.setAttribute("aAngle", new THREE.BufferAttribute(angle, 1));
  return geometry;
}
