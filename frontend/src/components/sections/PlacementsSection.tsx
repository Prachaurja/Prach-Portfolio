"use client";

import { useContent } from "@/context/ContentProvider";
import SectionHeader from "@/components/motion/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Photo from "@/components/system/Photo";

export default function PlacementsSection() {
  const { content } = useContent();
  if (!content.placements.length) return null;

  return (
    <section id="placements" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Industry" title="*Placements*" />
      <div className="mt-12 flex flex-col gap-6">
        {content.placements.map((p, i) => (
          <Reveal key={p.company} delay={i * 0.06} className="card sheen px-6 py-7 sm:px-8 sm:py-9">
            <div className="flex items-start gap-4">
              <Photo src={p.logo} label="Logo" className="h-14 w-14 shrink-0" rounded="rounded-xl" />
              <div className="min-w-0">
                <h3 className="font-display text-2xl font-bold text-gradient">{p.company}</h3>
                <p className="mt-0.5 text-[var(--text)]">{p.role}</p>
                <p className="text-sm text-[var(--text-dim)]">{p.period}</p>
                {p.location && <p className="text-sm text-[var(--text-dim)]">{p.location}</p>}
              </div>
            </div>

            {p.description && (
              <p className="mt-5 leading-relaxed text-[var(--text-dim)]">{p.description}</p>
            )}

            {p.projects && p.projects.length > 0 && (
              <div className="mt-6">
                <h4 className="label-mark mb-4">Projects delivered</h4>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {p.projects.map((proj, pi) => (
                    <div
                      key={pi}
                      className="rounded-xl border border-[var(--glass-border)] bg-white/[0.02] px-5 py-4"
                    >
                      <p className="font-display font-semibold text-[var(--text)]">{proj.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-dim)]">
                        {proj.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {p.skills && p.skills.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {p.skills.map((s) => (
                  <span key={s} className="chip text-xs">{s}</span>
                ))}
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
