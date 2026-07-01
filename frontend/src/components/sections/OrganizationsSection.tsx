"use client";

import { Building2 } from "lucide-react";
import { useContent } from "@/context/ContentProvider";
import SectionHeader from "@/components/motion/SectionHeader";
import Reveal from "@/components/motion/Reveal";

export default function OrganizationsSection() {
  const { content } = useContent();
  if (!content.organizations.length) return null;

  return (
    <section id="organizations" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Affiliations" title="*Organizations*" />
      <div className="mt-12 flex flex-col gap-6">
        {content.organizations.map((o, i) => (
          <Reveal key={o.name} delay={i * 0.06} className="card sheen flex flex-col gap-3 px-7 py-7 sm:flex-row sm:items-start sm:gap-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--glass-border)] bg-white/[0.03] text-[var(--teal)]">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-[var(--text)]">{o.name}</h3>
              {o.role && <p className="mt-0.5 text-sm text-[var(--text-dim)]">{o.role}</p>}
              {o.description && (
                <p className="mt-3 leading-relaxed text-[var(--text-dim)]">{o.description}</p>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
