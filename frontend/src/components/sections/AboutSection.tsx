"use client";

import { useContent } from "@/context/ContentProvider";
import SectionHeader from "@/components/motion/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Photo from "@/components/system/Photo";
import SocialIcon from "@/components/system/SocialIcon";

export default function AboutSection() {
  const { content } = useContent();
  const { about, socials } = content;

  return (
    <section id="about" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="About" title={`Hi, I'm ${about.name.split(" ")[0]} *${about.name.split(" ").slice(1).join(" ")}*`} />
      <p className="label-mark mt-4 normal-case tracking-[0.04em] text-[var(--text-dim)]">
        {about.role}
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Story + profile photo */}
        <Reveal className="card sheen flex flex-col gap-8 px-7 py-9 sm:flex-row sm:px-9">
          <div className="shrink-0">
            <Photo
              src={about.profilePhoto}
              label="Profile Photo"
              className="mx-auto aspect-square w-36 sm:w-40"
              rounded="rounded-2xl"
            />
          </div>
          <div className="flex flex-col gap-5">
            {about.paragraphs.map((p, i) => (
              <p key={i} className="text-lg leading-relaxed text-[var(--text-dim)]">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Connect + quick facts */}
        <div className="flex flex-col gap-6">
          <Reveal delay={0.1} className="card px-7 py-7">
            <h3 className="label-mark mb-5">Connect</h3>
            <div className="grid grid-cols-3 gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-white/[0.02] px-2 py-4 text-[var(--text-dim)] transition-all hover:-translate-y-0.5 hover:text-[var(--text)]"
                >
                  <SocialIcon icon={s.icon} />
                  <span className="text-[0.7rem]">{s.label}</span>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2} className="card px-7 py-7">
            <h3 className="label-mark mb-5">Quick Facts</h3>
            <dl className="flex flex-col gap-3">
              {about.quickFacts.map((f) => (
                <div key={f.label} className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-[var(--text-dim)]">{f.label}</dt>
                  <dd className="font-display text-sm font-semibold text-[var(--text)]">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
