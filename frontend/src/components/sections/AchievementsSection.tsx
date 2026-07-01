"use client";

import { Trophy } from "lucide-react";
import { useContent } from "@/context/ContentProvider";
import SectionHeader from "@/components/motion/SectionHeader";
import { StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import Photo from "@/components/system/Photo";

export default function AchievementsSection() {
  const { content } = useContent();
  if (!content.achievements.length) return null;

  return (
    <section id="achievements" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Milestones" title="*Achievements*" />

      <StaggerGroup className="mt-12 flex flex-col gap-5" stagger={0.09}>
        {content.achievements.map((a, i) => (
          <StaggerItem key={i}>
            <div className="card sheen flex flex-col gap-4 px-7 py-6 sm:flex-row sm:items-center sm:gap-7">
              <div className="flex items-center gap-4 sm:w-44 sm:shrink-0 sm:flex-col sm:items-start sm:gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-[var(--teal)]">
                  <Trophy className="h-[18px] w-[18px]" />
                </span>
                <div className="flex items-center gap-2">
                  {a.year && (
                    <span className="font-display text-lg font-bold text-[var(--teal)]">{a.year}</span>
                  )}
                  {a.tag && (
                    <span className="chip text-[0.6rem] uppercase tracking-wider text-[var(--text-dim)]">
                      {a.tag}
                    </span>
                  )}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl font-semibold text-[var(--text)]">{a.title}</h3>
                <p className="mt-2 leading-relaxed text-[var(--text-dim)]">{a.description}</p>
              </div>
              {a.image && (
                <Photo src={a.image} label="Photo" className="h-20 w-32 shrink-0" rounded="rounded-lg" />
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
