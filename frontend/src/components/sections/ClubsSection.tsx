"use client";

import { useContent } from "@/context/ContentProvider";
import SectionHeader from "@/components/motion/SectionHeader";
import ExperienceCard from "./ExperienceCard";

export default function ClubsSection() {
  const { content } = useContent();
  if (!content.clubs.length) return null;

  return (
    <section id="clubs" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Community" title="Clubs & *Societies*" />
      <div className="mt-12 flex flex-col gap-6">
        {content.clubs.map((exp, i) => (
          <ExperienceCard key={exp.org} exp={exp} index={i} />
        ))}
      </div>
    </section>
  );
}
