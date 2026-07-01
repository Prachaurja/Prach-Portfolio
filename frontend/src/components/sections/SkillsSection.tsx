"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "@/context/ContentProvider";
import { type Skill } from "@/lib/content";
import SectionHeader from "@/components/motion/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import { EASE } from "@/components/motion/Reveal";

function SkillBar({ skill }: { skill: Skill }) {
  const reduce = useReducedMotion();
  return (
    <div>
      <div className="mb-2 flex items-end justify-between">
        <span className="font-display text-[1.05rem] text-[var(--text)]">{skill.name}</span>
        <span className="text-xs text-[var(--text-dim)]">{skill.level}%</span>
      </div>
      <div className="h-[6px] w-full overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, var(--chrome-dark), var(--chrome-light))",
          }}
          initial={reduce ? false : { width: "0%" }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: EASE }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const { content } = useContent();

  return (
    <section id="skills" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Toolkit" title="Skills & *Tools*" />

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {content.skillGroups.map((group, i) => (
          <Reveal
            key={group.category}
            delay={i * 0.08}
            className="card sheen px-7 py-8"
          >
            <h3 className="label-mark mb-7">{group.category}</h3>
            <div className="flex flex-col gap-6">
              {group.skills.map((s) => (
                <SkillBar key={s.name} skill={s} />
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
