// Lightweight deterministic pseudo-noise — no extra dependency.
// Layered sines give smooth, organic-looking motion that is good enough
// for tentacle curl / wander without pulling in a full simplex-noise lib.

export function hash(seed: number): number {
  const s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

// Smooth 1D noise in roughly [-1, 1], continuous in `t`.
export function curl1(seed: number, t: number): number {
  const a = Math.sin(t * 1.3 + seed * 12.9898);
  const b = Math.sin(t * 2.7 + seed * 78.233) * 0.5;
  const c = Math.sin(t * 5.1 + seed * 39.346) * 0.25;
  return (a + b + c) / 1.75;
}

// Smooth 3D-ish vector noise built from three offset curl1 lanes.
export function curl3(seed: number, t: number, out: [number, number, number]): void {
  out[0] = curl1(seed, t);
  out[1] = curl1(seed + 91.7, t);
  out[2] = curl1(seed + 173.3, t);
}
