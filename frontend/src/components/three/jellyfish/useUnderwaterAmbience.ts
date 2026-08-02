"use client";

import { useEffect, useRef } from "react";

interface AmbienceHandles {
  ctx: AudioContext;
  noiseSource: AudioBufferSourceNode;
  lfo: OscillatorNode;
  masterGain: GainNode;
  bubbleInterval: ReturnType<typeof setInterval>;
}

function createBrownNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
  const rate = ctx.sampleRate;
  const buffer = ctx.createBuffer(1, rate * seconds, rate);
  const data = buffer.getChannelData(0);
  let lastOut = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    lastOut = (lastOut + 0.02 * white) / 1.02;
    data[i] = lastOut * 3.5;
  }
  return buffer;
}

function playBubble(ctx: AudioContext, destination: AudioNode) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const startFreq = 220 + Math.random() * 260;
  osc.type = "sine";
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, ctx.currentTime + 0.18);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
  osc.connect(gain).connect(destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

// A self-contained procedural underwater drone (filtered brown noise, slow
// LFO-swept lowpass, occasional bubble blips) — no audio assets needed.
// Gated behind a user-initiated toggle to respect autoplay policy.
export function useUnderwaterAmbience(enabled: boolean) {
  const handlesRef = useRef<AmbienceHandles | null>(null);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    const ctx = new AudioCtor();

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = createBrownNoiseBuffer(ctx);
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 380;
    filter.Q.value = 0.6;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.0001;
    masterGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.5);

    noiseSource.connect(filter).connect(masterGain).connect(ctx.destination);
    noiseSource.start();

    const bubbleInterval = setInterval(
      () => playBubble(ctx, masterGain),
      3200 + Math.random() * 4200,
    );

    handlesRef.current = { ctx, noiseSource, lfo, masterGain, bubbleInterval };

    return () => {
      const h = handlesRef.current;
      handlesRef.current = null;
      if (!h) return;
      clearInterval(h.bubbleInterval);
      const now = h.ctx.currentTime;
      h.masterGain.gain.cancelScheduledValues(now);
      h.masterGain.gain.setValueAtTime(h.masterGain.gain.value, now);
      h.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.35);
      setTimeout(() => {
        try {
          h.noiseSource.stop();
          h.lfo.stop();
        } finally {
          h.ctx.close();
        }
      }, 400);
    };
  }, [enabled]);
}
