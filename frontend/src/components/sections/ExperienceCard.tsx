"use client";

import { type Experience } from "@/lib/content";
import Reveal from "@/components/motion/Reveal";
import Photo from "@/components/system/Photo";

/** LinkedIn-style entry: org header → vertical rail of roles → optional media. */
export default function ExperienceCard({
  exp,
  index = 0,
}: {
  exp: Experience;
  index?: number;
}) {
  const multi = exp.roles.length > 1;

  return (
    <Reveal delay={index * 0.06} className="card sheen px-6 py-7 sm:px-8 sm:py-8">
      {/* org header */}
      <div className="flex items-start gap-4">
        <Photo
          src={exp.logo}
          label="Logo"
          className="h-12 w-12 shrink-0"
          rounded="rounded-xl"
        />
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold text-[var(--text)]">{exp.org}</h3>
          {exp.meta && <p className="text-sm text-[var(--text-dim)]">{exp.meta}</p>}
          {exp.location && (
            <p className="text-sm text-[var(--text-dim)]">{exp.location}</p>
          )}
        </div>
      </div>

      {/* roles */}
      <div className={`mt-6 ${multi ? "ln-rail" : "pl-0"}`}>
        {exp.roles.map((role, i) => (
          <div key={i} className={`relative ${i > 0 ? "mt-7" : ""}`}>
            {multi && <span className="ln-node" aria-hidden />}
            <h4 className="font-display text-lg font-semibold text-[var(--text)]">
              {role.title}
            </h4>
            {role.meta && (
              <p className="mt-0.5 text-sm text-[var(--text-dim)]">{role.meta}</p>
            )}
            {role.description && (
              <p className="mt-3 leading-relaxed text-[var(--text-dim)]">
                {role.description}
              </p>
            )}
            {role.bullets && role.bullets.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {role.bullets.map((b, bi) => (
                  <li key={bi} className="flex gap-2.5 text-[var(--text-dim)]">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--chrome-mid)]" />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
            )}
            {role.skills && role.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {role.skills.map((s) => (
                  <span key={s} className="chip text-xs">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* media */}
      {(exp.mediaTitle || exp.mediaImage) && (
        <div className="mt-6 flex items-center gap-4 rounded-xl border border-[var(--glass-border)] bg-white/[0.02] p-3">
          <Photo
            src={exp.mediaImage}
            label="Photo"
            className="h-16 w-24 shrink-0"
            rounded="rounded-lg"
          />
          <div className="min-w-0">
            {exp.mediaTitle && (
              <p className="font-display font-semibold text-[var(--text)]">
                {exp.mediaTitle}
              </p>
            )}
            {exp.mediaCaption && (
              <p className="text-sm text-[var(--text-dim)]">{exp.mediaCaption}</p>
            )}
          </div>
        </div>
      )}
    </Reveal>
  );
}
