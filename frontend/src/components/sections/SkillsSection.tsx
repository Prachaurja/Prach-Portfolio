"use client";

import { useEffect, useRef, useState } from "react";
import { skillGroups, type Skill } from "@/data/profile";

function getReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function SkillBar({ skill, animate }: { skill: Skill; animate: boolean }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text)]">{skill.name}</span>
        <span className="text-xs text-[var(--text-dim)]">{skill.level}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{
            width: animate ? `${skill.level}%` : "0%",
            background: "linear-gradient(90deg, var(--teal), var(--violet))",
          }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const [animate, setAnimate] = useState(() => getReducedMotion());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (getReducedMotion()) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setAnimate(true),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="relative z-10 mx-auto max-w-5xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="font-display mb-3 text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
          Toolkit
        </p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          Skills &amp; <span className="text-gradient">Tools</span>
        </h2>
      </div>

      <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {skillGroups.map((group) => (
          <div key={group.category} className="glass glass-glow px-7 py-7">
            <h3 className="font-display mb-6 text-sm uppercase tracking-[0.2em] text-[var(--teal)]">
              {group.category}
            </h3>
            <div className="flex flex-col gap-5">
              {group.skills.map((s) => (
                <SkillBar key={s.name} skill={s} animate={animate} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}