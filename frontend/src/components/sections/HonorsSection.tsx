"use client";

import { Award } from "lucide-react";
import { useContent } from "@/context/ContentProvider";
import SectionHeader from "@/components/motion/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Photo from "@/components/system/Photo";

export default function HonorsSection() {
  const { content } = useContent();
  if (!content.honors.length) return null;

  return (
    <section id="honors" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Recognition" title="Honors & *Awards*" />
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {content.honors.map((h, i) => (
          <Reveal key={h.title} delay={i * 0.06} className="card sheen flex flex-col px-7 py-7">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-[var(--teal)]">
                <Award className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-[var(--text)]">{h.title}</h3>
                {h.issuer && <p className="mt-0.5 text-sm text-[var(--text-dim)]">{h.issuer}</p>}
                {h.associated && (
                  <p className="text-sm text-[var(--text-dim)]">{h.associated}</p>
                )}
              </div>
            </div>
            {h.description && (
              <p className="mt-4 leading-relaxed text-[var(--text-dim)]">{h.description}</p>
            )}
            {h.image && (
              <Photo src={h.image} label="Photo" className="mt-5 aspect-video w-full" />
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
