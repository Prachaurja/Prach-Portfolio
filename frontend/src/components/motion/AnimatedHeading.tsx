"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { EASE } from "./Reveal";

/**
 * Display heading that reveals word-by-word with a mask sweep.
 * Words wrapped in *asterisks* render in the silver gradient.
 *   <AnimatedHeading text="Building *Ambitious* Systems" />
 */
export default function AnimatedHeading({
  text,
  className = "",
  delay = 0,
  as = "h2",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
}) {
  const reduce = useReducedMotion();
  const Tag = as;
  const words = text.split(" ");

  const renderWord = (raw: string, i: number) => {
    const gradient = raw.startsWith("*") && raw.endsWith("*");
    const clean = gradient ? raw.slice(1, -1) : raw;
    return (
      <span
        key={i}
        className={`inline-block whitespace-nowrap ${gradient ? "text-gradient" : ""}`}
      >
        {clean}
        {i < words.length - 1 ? " " : ""}
      </span>
    );
  };

  if (reduce) {
    return <Tag className={className}>{words.map(renderWord)}</Tag>;
  }

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.085, delayChildren: delay } },
  };
  const word: Variants = {
    hidden: { y: "110%" },
    show: { y: "0%", transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <Tag className={className}>
      <motion.span
        className="inline"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        {words.map((raw, i) => {
          const gradient = raw.startsWith("*") && raw.endsWith("*");
          const clean = gradient ? raw.slice(1, -1) : raw;
          return (
            <span
              key={i}
              className="inline-block overflow-hidden align-bottom"
              style={{ paddingBottom: "0.08em", marginBottom: "-0.08em" }}
            >
              <motion.span
                variants={word}
                className={`inline-block ${gradient ? "text-gradient" : ""}`}
              >
                {clean}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Tag>
  );
}
