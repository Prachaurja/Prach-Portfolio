"use client";

import { useContent } from "@/context/ContentProvider";
import Marquee from "@/components/motion/Marquee";

function Pill({ label }: { label: string }) {
  return (
    <span className="chip font-display text-base text-[var(--text)] sm:text-lg">
      {label}
    </span>
  );
}

export default function TechMarquee() {
  const { content } = useContent();
  const { topRow, bottomRow } = content.technologies;

  return (
    <section className="relative z-10 overflow-hidden py-16">
      <p className="label-mark mb-8 text-center">Technologies I Work With</p>
      <div className="flex flex-col gap-4">
        <Marquee direction="left" speed={34}>
          {topRow.map((t, i) => (
            <Pill key={`${t}-${i}`} label={t} />
          ))}
        </Marquee>
        <Marquee direction="right" speed={40}>
          {bottomRow.map((t, i) => (
            <Pill key={`${t}-${i}`} label={t} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
