"use client";

import { motion, useReducedMotion } from "framer-motion";
import AnimatedHeading from "./AnimatedHeading";
import { EASE } from "./Reveal";

/**
 * Standard section header: small tracked eyebrow + big serif heading that
 * reveals word-by-word. Wrap gradient words in the title with *asterisks*.
 */
export default function SectionHeader({
  eyebrow,
  title,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col ${alignCls} ${className}`}>
      <motion.p
        className="label-mark mb-4"
        initial={reduce ? false : { opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {eyebrow}
      </motion.p>
      <AnimatedHeading
        text={title}
        as="h2"
        className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl"
      />
    </div>
  );
}
