"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useContent } from "@/context/ContentProvider";
import { type Project } from "@/lib/content";
import SectionHeader from "@/components/motion/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Photo from "@/components/system/Photo";
import SocialIcon from "@/components/system/SocialIcon";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduce = useReducedMotion();
  return (
    <Reveal delay={index * 0.05}>
      <motion.article
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="card sheen group grid grid-cols-1 gap-6 overflow-hidden px-7 py-8 sm:px-9 md:grid-cols-[1fr_240px] md:items-center"
      >
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="font-display text-2xl font-bold sm:text-3xl">
              <span className="text-gradient">{project.title}</span>
            </h3>
            {project.featured && (
              <span className="chip border-[var(--teal)]/30 bg-[var(--teal)]/10 text-xs uppercase tracking-wider text-[var(--teal)]">
                Featured
              </span>
            )}
            {project.year && (
              <span className="font-display text-sm text-[var(--text-dim)]">{project.year}</span>
            )}
          </div>

          <p className="mt-5 text-lg leading-relaxed text-[var(--text-dim)]">
            {project.longDescription ?? project.description}
          </p>

          {project.tech_stack.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech_stack.map((t) => (
                <span key={t} className="chip text-sm">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--teal)]"
              >
                <SocialIcon icon="github" className="h-4 w-4" /> View on GitHub
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] px-5 py-2.5 text-sm font-medium text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
              >
                <ExternalLink className="h-4 w-4" /> Live Site
              </a>
            )}
          </div>
        </div>

        <Photo
          src={project.image}
          label="Project Showcase"
          className="aspect-[4/3] w-full md:aspect-square"
        />
      </motion.article>
    </Reveal>
  );
}

export default function ProjectsSection() {
  const { content } = useContent();
  const sorted = [...content.projects].sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
  );

  return (
    <section id="projects" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Projects" title="Things I've *Shipped*" />
      <div className="mt-12 flex flex-col gap-8">
        {sorted.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
