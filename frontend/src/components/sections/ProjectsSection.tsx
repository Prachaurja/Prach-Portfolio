import { sortedProjects, type Project } from "@/data/projects";

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="glass glass-glow flex flex-col px-8 py-10 sm:px-12 sm:py-12">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-display text-2xl font-bold sm:text-3xl">
          <span className="text-gradient">{project.title}</span>
        </h3>
        {project.featured && (
          <span className="rounded-full bg-[var(--teal)]/15 px-3 py-1 text-xs text-[var(--teal)]">
            Featured
          </span>
        )}
      </div>

      <p className="mt-6 text-lg leading-relaxed text-[var(--text-dim)]">
        {project.longDescription ?? project.description}
      </p>

      {project.tech_stack.length > 0 && (
        <div className="mt-8">
          <h4 className="mb-3 text-sm uppercase tracking-[0.2em] text-[var(--text-dim)]">
            Built with
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--glass-border)] px-3 py-1.5 text-sm text-[var(--text)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[var(--teal)] bg-[var(--teal)]/10 px-6 py-3 font-medium text-[var(--teal)] transition-colors hover:bg-[var(--teal)]/20"
          >
            View on GitHub
          </a>
        )}
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-[var(--glass-border)] px-6 py-3 font-medium text-[var(--text)] transition-colors hover:border-[var(--violet)]"
          >
            Live Site
          </a>
        )}
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="container-x relative z-10 py-24">
      <div className="mb-12 text-center">
        <p className="font-display mb-3 text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
          Projects
        </p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          Things I&apos;ve <span className="text-gradient">Shipped</span>
        </h2>
      </div>

      {/* Every project, stacked one after another */}
      <div className="flex flex-col gap-12 sm:gap-8">
        {sortedProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}