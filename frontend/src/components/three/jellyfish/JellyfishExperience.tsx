"use client";

import { useState } from "react";
import ControlPanel from "./ControlPanel";
import Scene, { type SceneSettings } from "./Scene";
import { usePlanktonField } from "./Plankton";
import { useUnderwaterAmbience } from "./useUnderwaterAmbience";

const DEFAULT_SETTINGS: SceneSettings = {
  jellyfishCount: 6,
  glowIntensity: 1,
  currentStrength: 0.18,
  autoRotate: true,
  flashlightOn: false,
  repelMode: false,
};

export default function JellyfishExperience() {
  const [settings, setSettings] = useState<SceneSettings>(DEFAULT_SETTINGS);
  const [audioOn, setAudioOn] = useState(false);
  const { foodRef, spawn } = usePlanktonField();

  useUnderwaterAmbience(audioOn);

  function handleChange<K extends keyof SceneSettings>(key: K, value: SceneSettings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <Scene settings={settings} foodRef={foodRef} spawnFood={spawn} />
      <ControlPanel
        settings={settings}
        onChange={handleChange}
        audioOn={audioOn}
        onToggleAudio={() => setAudioOn((v) => !v)}
      />
    </div>
  );
}
