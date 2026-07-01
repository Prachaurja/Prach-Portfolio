"use client";

import { useContent } from "@/context/ContentProvider";
import { type EducationItem } from "@/lib/content";
import SectionHeader from "@/components/motion/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Photo from "@/components/system/Photo";

function EduCard({ item, index }: { item: EducationItem; index: number }) {
  return (
    <Reveal delay={index * 0.06} className="relative">
      <span className="ln-node" aria-hidden style={{ top: "1.9rem" }} />
      <div className="card sheen px-6 py-7 sm:px-8">
        <div className="flex items-start gap-4">
          <Photo src={item.logo} label="Logo" className="h-12 w-12 shrink-0" rounded="rounded-xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-xl font-bold text-[var(--text)]">{item.school}</h3>
              {item.tag && (
                <span className="chip text-[0.65rem] uppercase tracking-wider text-[var(--text-dim)]">
                  {item.tag}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[var(--text-dim)]">{item.degree}</p>
            <p className="text-sm text-[var(--text-dim)]">{item.period}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {item.grade && (
            <p className="text-sm">
              <span className="text-[var(--text-dim)]">Grade: </span>
              <span className="font-display font-semibold text-[var(--text)]">{item.grade}</span>
            </p>
          )}
          {item.activities && (
            <p className="text-sm">
              <span className="text-[var(--text-dim)]">Activities & societies: </span>
              <span className="text-[var(--text)]">{item.activities}</span>
            </p>
          )}
          {item.description && (
            <p className="leading-relaxed text-[var(--text-dim)]">{item.description}</p>
          )}
          {item.skills && item.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {item.skills.map((s) => (
                <span key={s} className="chip text-xs">{s}</span>
              ))}
            </div>
          )}
        </div>

        {(item.mediaTitle || item.mediaImage) && (
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-[var(--glass-border)] bg-white/[0.02] p-3">
            <Photo src={item.mediaImage} label="Photo" className="h-16 w-24 shrink-0" rounded="rounded-lg" />
            <div className="min-w-0">
              {item.mediaTitle && (
                <p className="font-display font-semibold text-[var(--text)]">{item.mediaTitle}</p>
              )}
              {item.mediaCaption && (
                <p className="text-sm text-[var(--text-dim)]">{item.mediaCaption}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default function UniStorySection() {
  const { content } = useContent();
  if (!content.uniStory.length) return null;

  return (
    <section id="uni-story" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Journey" title="My Uni *Story*" />
      <div className="ln-rail mt-12 flex flex-col gap-6">
        {content.uniStory.map((item, i) => (
          <EduCard key={item.school} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
