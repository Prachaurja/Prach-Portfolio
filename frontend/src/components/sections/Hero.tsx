"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Download, Code2 } from "lucide-react";
import { useContent } from "@/context/ContentProvider";
import Magnetic from "@/components/motion/Magnetic";
import SocialIcon from "@/components/system/SocialIcon";
import { EASE } from "@/components/motion/Reveal";

export default function Hero() {
  const { content } = useContent();
  const { hero, socials } = content;
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.94]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 pt-28"
    >
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 flex w-full max-w-5xl flex-col items-center text-center"
      >
        <motion.p
          className="label-mark mb-6"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        >
          {hero.eyebrow}
        </motion.p>

        {/* Render each headline line on its own row for control */}
        <h1 className="font-display text-[13vw] font-bold leading-[0.98] tracking-tight sm:text-7xl md:text-8xl">
          {hero.headlineLines.map((line, li) => (
            <span key={li} className="block overflow-hidden">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.95, ease: EASE, delay: 0.35 + li * 0.12 }}
              >
                {line.split(" ").map((w, wi) => {
                  const grad = w.startsWith("*") && w.endsWith("*");
                  const clean = grad ? w.slice(1, -1) : w;
                  return (
                    <span key={wi} className={grad ? "text-gradient" : ""}>
                      {clean}
                      {wi < line.split(" ").length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-[var(--text-dim)]"
          initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
        >
          <Magnetic>
            <a
              href={hero.primaryCta.href}
              className="sheen group flex items-center gap-2 rounded-2xl bg-[var(--teal)] px-7 py-3.5 font-medium text-black transition-transform hover:scale-[1.02]"
            >
              {hero.primaryCta.label}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={hero.secondaryCta.href}
              className="rounded-2xl border border-[var(--glass-border)] px-7 py-3.5 font-medium text-[var(--text)] transition-colors hover:border-[var(--teal)]"
            >
              {hero.secondaryCta.label}
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={hero.resumeCta.href}
              className="flex items-center gap-2 rounded-2xl border border-[var(--glass-border)] px-7 py-3.5 font-medium text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
            >
              <Download className="h-4 w-4" />
              {hero.resumeCta.label}
            </a>
          </Magnetic>
        </motion.div>

        {/* socials */}
        <motion.div
          className="mt-10 flex items-center justify-center gap-5 text-[var(--text-dim)]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 1 }}
        >
          {socials
            .filter((s) => s.icon !== "email" && s.icon !== "link")
            .map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="transition-colors hover:text-[var(--text)]"
              >
                <SocialIcon icon={s.icon} />
              </a>
            ))}
        </motion.div>
      </motion.div>

      {/* stats strip pinned near the bottom of the hero */}
      <motion.div
        className="relative z-10 mt-16 w-full max-w-5xl border-t border-[var(--glass-border)] pt-6"
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 1.1 }}
        style={{ opacity }}
      >
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {hero.stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                {s.value}
              </div>
              <div className="label-mark mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <a
        href="/dev"
        className="group fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-black/40 px-4 py-2 font-display text-xs tracking-wider text-[var(--text-dim)] backdrop-blur transition-colors hover:text-[var(--text)]"
        aria-label="Open Dev Tools"
      >
        <Code2 className="h-4 w-4" />
        <span>{"< Dev Tools />"}</span>
      </a>
    </section>
  );
}
