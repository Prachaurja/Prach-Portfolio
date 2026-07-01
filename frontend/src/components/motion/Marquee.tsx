"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Infinite horizontal marquee. Duplicates its children once and translates
 * by -50% (or +50%) on loop so the seam is invisible. Pauses on hover.
 */
export default function Marquee({
  children,
  direction = "left",
  speed = 38,
  className = "",
}: {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: number; // seconds for one full loop
  className?: string;
}) {
  const reduce = useReducedMotion();
  const from = direction === "left" ? "0%" : "-50%";
  const to = direction === "left" ? "-50%" : "0%";

  if (reduce) {
    return (
      <div className={`flex gap-4 overflow-hidden ${className}`}>{children}</div>
    );
  }

  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <motion.div
        className="flex shrink-0 gap-4 pr-4"
        initial={{ x: from }}
        animate={{ x: to }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
