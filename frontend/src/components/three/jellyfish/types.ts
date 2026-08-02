import * as THREE from "three";

export interface PointerState {
  active: boolean;
  repel: boolean;
  world: THREE.Vector3;
}

export interface FoodParticle {
  id: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number; // seconds remaining
  seed: number;
}
