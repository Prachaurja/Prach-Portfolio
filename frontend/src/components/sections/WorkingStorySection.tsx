"use client";

import { useContent } from "@/context/ContentProvider";
import SectionHeader from "@/components/motion/SectionHeader";
import ExperienceCard from "./ExperienceCard";

export default function WorkingStorySection() {
  const { content } = useContent();
  if (!content.workingStory.length) return null;

  return (
    <section id="working-story" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader
        eyebrow="As an International Student in Australia"
        title="My Working *Story*"
      />
      <p className="mt-4 max-w-2xl text-[var(--text-dim)]">
        Studying full-time while working on-site — the jobs that kept me going
        and taught me how Australia really works.
      </p>
      <div className="mt-12 flex flex-col gap-6">
        {content.workingStory.map((exp, i) => (
          <ExperienceCard key={exp.org} exp={exp} index={i} />
        ))}
      </div>
    </section>
  );
}
