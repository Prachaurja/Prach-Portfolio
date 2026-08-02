"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flashlight, Info, RotateCw, Sparkles, Volume2, VolumeX, Waves, X, Zap } from "lucide-react";
import type { SceneSettings } from "./Scene";

interface ControlPanelProps {
  settings: SceneSettings;
  onChange: <K extends keyof SceneSettings>(key: K, value: SceneSettings[K]) => void;
  audioOn: boolean;
  onToggleAudio: () => void;
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition-colors ${
        active
          ? "border-[#6ff2e0]/50 bg-[#6ff2e0]/15 text-[#a6fff0]"
          : "border-white/10 text-white/55 hover:text-white/80"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-white/60">
      <span className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-white/40">{format ? format(value) : value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#6ff2e0]"
      />
    </label>
  );
}

export default function ControlPanel({ settings, onChange, audioOn, onToggleAudio }: ControlPanelProps) {
  const [open, setOpen] = useState(true);
  const [infoOpen, setInfoOpen] = useState(true);

  return (
    <>
      <AnimatePresence>
        {infoOpen && (
          <div className="pointer-events-none fixed left-1/2 top-36 z-40 w-[min(92vw,26rem)] -translate-x-1/2 sm:top-28">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass glass-glow pointer-events-auto px-4 py-3 text-center text-xs text-white/70"
            >
              <button
                onClick={() => setInfoOpen(false)}
                className="absolute right-2 top-2 text-white/40 hover:text-white/80"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <p className="flex items-center justify-center gap-1.5 pr-4 font-medium text-white/85">
                <Info className="h-3.5 w-3.5 shrink-0" /> Drift among moon jellies
              </p>
              <p className="mt-1 pr-4">
                Tap to drop plankton · hold to lure · right-click (or Startle mode) to startle · drag to
                look around · scroll to dive in
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed bottom-5 left-1/2 z-40 w-[min(94vw,30rem)] -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass glass-glow pointer-events-auto px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-white/80">
              <Sparkles className="h-3.5 w-3.5 text-[#6ff2e0]" /> Bloom Controls
            </span>
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-[11px] text-white/45 hover:text-white/75"
            >
              {open ? "Hide" : "Show"}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-3 pt-3 sm:grid-cols-3">
                  <SliderRow
                    label="Jellyfish"
                    value={settings.jellyfishCount}
                    min={2}
                    max={12}
                    step={1}
                    onChange={(v) => onChange("jellyfishCount", v)}
                  />
                  <SliderRow
                    label="Glow"
                    value={settings.glowIntensity}
                    min={0.4}
                    max={2}
                    step={0.05}
                    format={(v) => v.toFixed(2)}
                    onChange={(v) => onChange("glowIntensity", v)}
                  />
                  <SliderRow
                    label="Current"
                    value={settings.currentStrength}
                    min={0}
                    max={0.6}
                    step={0.02}
                    format={(v) => v.toFixed(2)}
                    onChange={(v) => onChange("currentStrength", v)}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <ToggleButton
                    active={settings.autoRotate}
                    onClick={() => onChange("autoRotate", !settings.autoRotate)}
                    icon={<RotateCw className="h-3.5 w-3.5" />}
                    label="Auto-rotate"
                  />
                  <ToggleButton
                    active={settings.flashlightOn}
                    onClick={() => onChange("flashlightOn", !settings.flashlightOn)}
                    icon={<Flashlight className="h-3.5 w-3.5" />}
                    label="Flashlight"
                  />
                  <ToggleButton
                    active={settings.repelMode}
                    onClick={() => onChange("repelMode", !settings.repelMode)}
                    icon={<Zap className="h-3.5 w-3.5" />}
                    label="Startle mode"
                  />
                  <ToggleButton
                    active={audioOn}
                    onClick={onToggleAudio}
                    icon={audioOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                    label="Ambience"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {!infoOpen && (
        <button
          onClick={() => setInfoOpen(true)}
          className="glass fixed left-1/2 top-36 z-40 -translate-x-1/2 rounded-full p-2 text-white/50 hover:text-white/80 sm:top-28"
          aria-label="Show instructions"
        >
          <Waves className="h-4 w-4" />
        </button>
      )}
    </>
  );
}
