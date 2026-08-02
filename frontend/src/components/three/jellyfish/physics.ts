import * as THREE from "three";
import { curl1 } from "./noise";

// ============================================================================
// A lightweight jellyfish locomotion + soft-body tentacle simulation.
//
// Swim model: real medusae swim by jet propulsion — the bell contracts fast
// (squeezing water out of the subumbrellar cavity, producing thrust) then
// relaxes slowly (refilling passively), giving the characteristic pulse-glide
// cycle. We model that asymmetric waveform, derive thrust from its rate of
// change, and integrate a drag/buoyancy limited body in world space.
//
// Tentacles: each tentacle/oral-arm is a verlet-integrated particle chain
// pinned at the bell rim, with distance constraints (rope), a gentle spring
// back to a resting drape, drag opposing the bell's motion (so they stream
// out behind it), and curl noise for organic undulation.
// ============================================================================

export interface JellyfishConfig {
  bellRadius: number;
  tentacleCount: number;
  tentacleSegments: number;
  tentacleLength: number;
  oralArmCount: number;
  oralArmSegments: number;
  oralArmLength: number;
  pulseSpeed: number; // pulses per second, base rate
  hue: number; // 0..1
  seed: number;
}

export interface TentacleChain {
  anchorLocal: THREE.Vector3;
  cur: Float32Array; // segments*3, world space
  prev: Float32Array;
  restLen: number;
  segments: number;
  seed: number;
}

export interface JellyfishState {
  config: JellyfishConfig;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  quaternion: THREE.Quaternion;
  pulsePhase: number;
  pulseShape: number; // 0 (relaxed) .. 1 (fully contracted)
  prevPulseShape: number;
  flash: number; // bioluminescent flash intensity, decays to 0
  wanderSeed: number;
  wanderTarget: THREE.Vector3;
  tentacles: TentacleChain[];
  oralArms: TentacleChain[];
  scratchAnchor: THREE.Vector3;
}

export interface SwimEnvironment {
  pointerActive: boolean;
  pointerRepel: boolean;
  pointerWorld: THREE.Vector3;
  current: THREE.Vector3; // ambient drift ("ocean current")
  boundsCenter: THREE.Vector3;
  boundsRadius: number;
  neighbors: JellyfishState[];
  food: THREE.Vector3[];
  elapsed: number;
}

const UP = new THREE.Vector3(0, 1, 0);

function makeChain(
  anchorLocal: THREE.Vector3,
  segments: number,
  length: number,
  originWorld: THREE.Vector3,
  seed: number,
): TentacleChain {
  const restLen = length / segments;
  const cur = new Float32Array(segments * 3);
  const prev = new Float32Array(segments * 3);
  for (let i = 0; i < segments; i++) {
    const x = originWorld.x + anchorLocal.x;
    const y = originWorld.y + anchorLocal.y - i * restLen;
    const z = originWorld.z + anchorLocal.z;
    cur[i * 3] = x;
    cur[i * 3 + 1] = y;
    cur[i * 3 + 2] = z;
    prev[i * 3] = x;
    prev[i * 3 + 1] = y;
    prev[i * 3 + 2] = z;
  }
  return { anchorLocal, cur, prev, restLen, segments, seed };
}

export function createJellyfishState(
  config: JellyfishConfig,
  position: THREE.Vector3,
): JellyfishState {
  const tentacles: TentacleChain[] = [];
  for (let i = 0; i < config.tentacleCount; i++) {
    const angle = (i / config.tentacleCount) * Math.PI * 2;
    const anchor = new THREE.Vector3(
      Math.cos(angle) * config.bellRadius * 0.92,
      -config.bellRadius * 0.12,
      Math.sin(angle) * config.bellRadius * 0.92,
    );
    tentacles.push(
      makeChain(anchor, config.tentacleSegments, config.tentacleLength, position, config.seed + i * 7.13),
    );
  }

  const oralArms: TentacleChain[] = [];
  for (let i = 0; i < config.oralArmCount; i++) {
    const angle = (i / config.oralArmCount) * Math.PI * 2 + 0.4;
    const anchor = new THREE.Vector3(
      Math.cos(angle) * config.bellRadius * 0.22,
      -config.bellRadius * 0.18,
      Math.sin(angle) * config.bellRadius * 0.22,
    );
    oralArms.push(
      makeChain(anchor, config.oralArmSegments, config.oralArmLength, position, config.seed + 91 + i * 5.31),
    );
  }

  return {
    config,
    position: position.clone(),
    velocity: new THREE.Vector3(),
    quaternion: new THREE.Quaternion(),
    pulsePhase: Math.random(),
    pulseShape: 0,
    prevPulseShape: 0,
    flash: 0,
    wanderSeed: config.seed,
    wanderTarget: new THREE.Vector3().randomDirection(),
    tentacles,
    oralArms,
    scratchAnchor: new THREE.Vector3(),
  };
}

// Asymmetric pulse waveform: fast contraction, slow passive relaxation.
function pulseShapeAt(phase: number): number {
  const p = phase % 1;
  if (p < 0.22) {
    const t = p / 0.22;
    return Math.sin(t * Math.PI * 0.5); // fast rise 0 -> 1
  }
  const t = (p - 0.22) / 0.78;
  return Math.cos(t * Math.PI * 0.5); // slow decay 1 -> 0
}

const _steer = new THREE.Vector3();
const _tmp = new THREE.Vector3();
const _tmp2 = new THREE.Vector3();
const _targetQuat = new THREE.Quaternion();

export function stepJellyfish(state: JellyfishState, dt: number, env: SwimEnvironment): void {
  const cfg = state.config;
  dt = Math.min(dt, 1 / 20);

  // ---- 1. Bell pulse ----
  state.prevPulseShape = state.pulseShape;
  state.pulsePhase += dt * cfg.pulseSpeed;
  state.pulseShape = pulseShapeAt(state.pulsePhase);
  const dPulse = (state.pulseShape - state.prevPulseShape) / Math.max(dt, 1e-4);

  // Bioluminescent flash spikes right at peak contraction, plus a startle
  // flash when something spooks the animal (handled by caller via env).
  if (state.prevPulseShape < 0.98 && state.pulseShape >= 0.98) {
    state.flash = Math.max(state.flash, 0.85);
  }
  state.flash = Math.max(0, state.flash - dt * 1.6);

  // Thrust only on the contraction stroke (dPulse > 0): jets water out,
  // pushes the bell in its forward (dome-leading) direction.
  const thrustMag = Math.max(0, dPulse) * cfg.bellRadius * 0.62;
  const forward = _tmp.set(0, 1, 0).applyQuaternion(state.quaternion);

  // ---- 2. Steering forces ----
  _steer.set(0, 0, 0);

  // Gentle wander: occasionally re-pick a random heading bias.
  state.wanderSeed += dt;
  const wanderJitter = curl1(state.wanderSeed, env.elapsed * 0.15);
  _tmp2.set(
    curl1(cfg.seed + 1, env.elapsed * 0.07),
    curl1(cfg.seed + 2, env.elapsed * 0.05) * 0.4,
    curl1(cfg.seed + 3, env.elapsed * 0.07),
  ).multiplyScalar(0.35 + Math.abs(wanderJitter) * 0.2);
  _steer.add(_tmp2);

  // Pointer attraction / repulsion (food-seeking or startle response).
  if (env.pointerActive) {
    _tmp2.subVectors(env.pointerWorld, state.position);
    const dist = _tmp2.length();
    if (dist > 0.001) {
      _tmp2.multiplyScalar(1 / dist);
      if (env.pointerRepel) {
        const strength = THREE.MathUtils.clamp(2.2 / (dist + 0.4), 0, 3.2);
        _steer.addScaledVector(_tmp2, -strength);
        if (dist < 1.6) state.flash = Math.max(state.flash, 0.7);
      } else {
        const strength = THREE.MathUtils.clamp(1.1 / (dist * 0.5 + 0.6), 0, 1.4);
        _steer.addScaledVector(_tmp2, strength);
      }
    }
  }

  // Food particles (plankton) draw a gentle feeding response.
  for (const f of env.food) {
    _tmp2.subVectors(f, state.position);
    const dist = _tmp2.length();
    if (dist > 0.001 && dist < 6) {
      _tmp2.multiplyScalar((1 / dist) * THREE.MathUtils.clamp(1.6 / (dist + 0.5), 0, 1.2));
      _steer.add(_tmp2);
    }
  }

  // Separation from neighbors to avoid overlap.
  for (const other of env.neighbors) {
    if (other === state) continue;
    _tmp2.subVectors(state.position, other.position);
    const dist = _tmp2.length();
    const minDist = cfg.bellRadius + other.config.bellRadius + 0.6;
    if (dist > 0.001 && dist < minDist) {
      _tmp2.multiplyScalar((1 - dist / minDist) * 1.8 / dist);
      _steer.add(_tmp2);
    }
  }

  // Soft boundary containment.
  _tmp2.subVectors(state.position, env.boundsCenter);
  const distFromCenter = _tmp2.length();
  if (distFromCenter > env.boundsRadius * 0.7) {
    const t = THREE.MathUtils.clamp(
      (distFromCenter - env.boundsRadius * 0.7) / (env.boundsRadius * 0.3),
      0,
      1,
    );
    _tmp2.multiplyScalar((-1 / Math.max(distFromCenter, 0.001)) * t * t * 2.4);
    _steer.add(_tmp2);
  }

  // Ambient current + buoyancy (slow sink when not thrusting, gentle net lift).
  _steer.add(env.current);
  _steer.y += -0.06 + thrustMag * 0.35;

  // ---- 3. Integrate ----
  state.velocity.addScaledVector(forward, thrustMag);
  state.velocity.addScaledVector(_steer, dt);
  // Exponential drag — stable at any framerate, mimics quadratic fluid drag
  // closely enough at this scale.
  const dragCoeff = 1.35;
  state.velocity.multiplyScalar(Math.exp(-dragCoeff * dt));
  const maxSpeed = cfg.bellRadius * 1.8;
  if (state.velocity.length() > maxSpeed) {
    state.velocity.setLength(maxSpeed);
  }
  state.position.addScaledVector(state.velocity, dt);

  // ---- 4. Orientation: bell "forward" (+Y local) eases toward velocity ----
  const speed = state.velocity.length();
  if (speed > 0.02) {
    _tmp2.copy(state.velocity).normalize();
    _targetQuat.setFromUnitVectors(UP, _tmp2);
    state.quaternion.slerp(_targetQuat, Math.min(1, dt * 1.6));
  }

  // ---- 5. Tentacles & oral arms ----
  const gravity = -0.9;
  for (const chain of state.tentacles) {
    updateChain(chain, state, dt, env.elapsed, gravity, 0.9);
  }
  for (const chain of state.oralArms) {
    updateChain(chain, state, dt, env.elapsed, gravity * 0.6, 0.55);
  }
}

const _anchorWorld = new THREE.Vector3();
const _restPoint = new THREE.Vector3();
const _accel = new THREE.Vector3();
const _velTerm = new THREE.Vector3();
const _diff = new THREE.Vector3();

function updateChain(
  chain: TentacleChain,
  state: JellyfishState,
  dt: number,
  elapsed: number,
  gravity: number,
  streamFactor: number,
): void {
  const { cur, prev, segments, restLen, seed } = chain;

  _anchorWorld.copy(chain.anchorLocal).applyQuaternion(state.quaternion).add(state.position);
  cur[0] = _anchorWorld.x;
  cur[1] = _anchorWorld.y;
  cur[2] = _anchorWorld.z;

  const damping = 0.965;
  const dt2 = dt * dt;

  for (let i = 1; i < segments; i++) {
    const ix = i * 3;
    const px = cur[ix],
      py = cur[ix + 1],
      pz = cur[ix + 2];
    const vx = (px - prev[ix]) * damping;
    const vy = (py - prev[ix + 1]) * damping;
    const vz = (pz - prev[ix + 2]) * damping;

    // Rest drape: straight down from anchor, in the bell's local frame.
    _restPoint.set(0, -i * restLen, 0).applyQuaternion(state.quaternion).add(_anchorWorld);
    _diff.set(_restPoint.x - px, _restPoint.y - py, _restPoint.z - pz);

    // Streaming drag opposing the bell's velocity — tentacles trail behind.
    _velTerm.copy(state.velocity).multiplyScalar(-streamFactor * (i / segments));

    const curlT = elapsed * 1.4 + i * 0.6;
    _accel.set(
      _diff.x * 0.8 + _velTerm.x + curl1(seed + i, curlT) * 0.6,
      _diff.y * 0.8 + _velTerm.y + gravity * 0.15,
      _diff.z * 0.8 + _velTerm.z + curl1(seed + i + 50, curlT) * 0.6,
    );

    prev[ix] = px;
    prev[ix + 1] = py;
    prev[ix + 2] = pz;
    cur[ix] = px + vx + _accel.x * dt2;
    cur[ix + 1] = py + vy + _accel.y * dt2;
    cur[ix + 2] = pz + vz + _accel.z * dt2;
  }

  // Distance constraints (rope), a couple of relaxation passes.
  for (let iter = 0; iter < 2; iter++) {
    for (let i = 1; i < segments; i++) {
      const a = (i - 1) * 3;
      const b = i * 3;
      let dx = cur[b] - cur[a];
      let dy = cur[b + 1] - cur[a + 1];
      let dz = cur[b + 2] - cur[a + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
      const diff = (dist - restLen) / dist;
      dx *= diff;
      dy *= diff;
      dz *= diff;
      if (i === 1) {
        // segment 0 is pinned to the anchor — push all correction onto b
        cur[b] -= dx;
        cur[b + 1] -= dy;
        cur[b + 2] -= dz;
      } else {
        cur[a] += dx * 0.5;
        cur[a + 1] += dy * 0.5;
        cur[a + 2] += dz * 0.5;
        cur[b] -= dx * 0.5;
        cur[b + 1] -= dy * 0.5;
        cur[b + 2] -= dz * 0.5;
      }
    }
  }
}
