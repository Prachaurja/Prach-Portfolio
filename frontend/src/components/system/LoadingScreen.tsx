"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useMotionValue,
  animate,
  useTransform,
} from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const BRAND = "PRACHAURJA";

/**
 * Full-screen animated loader shown on first paint. The monogram draws in,
 * the brand reveals letter-by-letter, a counter races to 100, then the
 * curtain lifts to reveal the site. Skipped for reduced-motion users.
 */
export default function LoadingScreen() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [done, setDone] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduce || pathname !== "/") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const unsub = rounded.on("change", (v) => setDisplay(v));
    const controls = animate(count, 100, {
      duration: 2.1,
      ease: [0.22, 1, 0.36, 1],
    });
    const t = setTimeout(() => setDone(true), 2450);
    return () => {
      controls.stop();
      unsub();
      clearTimeout(t);
    };
  }, [count, rounded, reduce, pathname]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (reduce || pathname !== "/") return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: "inset(0% 0% 100% 0%)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* ambient silver wash */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(50% 40% at 50% 42%, rgba(255,255,255,0.10), transparent 70%)",
            }}
          />

          {/* drawing monogram ring */}
          <motion.svg
            width="74"
            height="74"
            viewBox="0 0 100 100"
            className="mb-8"
            initial={{ rotate: -90 }}
            animate={{ rotate: 270 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              stroke="url(#lg)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              pathLength={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.0, ease: [0.22, 1, 0.36, 1] }}
            />
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f4f4f8" />
                <stop offset="100%" stopColor="#6e7280" />
              </linearGradient>
            </defs>
          </motion.svg>

          {/* brand letters */}
          <div className="flex overflow-hidden">
            {BRAND.split("").map((ch, i) => (
              <motion.span
                key={i}
                className="font-display text-2xl font-bold tracking-[0.35em] text-[var(--text)] sm:text-3xl"
                initial={{ y: "120%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  delay: 0.25 + i * 0.05,
                  duration: 0.7,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          {/* progress line + counter */}
          <div className="mt-9 flex w-[min(280px,70vw)] flex-col items-center gap-3">
            <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--chrome-dark), var(--chrome-light))",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <motion.span
              className="font-display text-xs tracking-[0.3em] text-[var(--text-dim)]"
              aria-hidden
            >
              {display.toString().padStart(3, "0")}
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
