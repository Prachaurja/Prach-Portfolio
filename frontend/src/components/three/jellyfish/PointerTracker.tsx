"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, type RefObject } from "react";
import * as THREE from "three";
import type { PointerState } from "./types";

// Projects the 2D pointer onto a plane that always faces the camera and
// passes through the world origin, so "pointer world position" tracks
// whatever depth the user is currently looking at.
export default function PointerTracker({ pointerRef }: { pointerRef: RefObject<PointerState> }) {
  const plane = useMemo(() => new THREE.Plane(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, pointer, raycaster }) => {
    normal.copy(camera.position).normalize();
    plane.setFromNormalAndCoplanarPoint(normal, new THREE.Vector3(0, 0, 0));
    raycaster.setFromCamera(pointer, camera);
    const result = raycaster.ray.intersectPlane(plane, hit);
    if (result && pointerRef.current) {
      pointerRef.current.world.copy(hit);
    }
  });

  return null;
}
