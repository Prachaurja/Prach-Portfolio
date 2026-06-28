import { about } from "@/data/profile";

export default function AboutSection() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-4xl px-6 py-24">
      <div className="mb-10 text-center">
        <p className="font-display mb-3 text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
          About
        </p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          Hi, I&apos;m <span className="text-gradient">{about.name} Sarker </span>
        </h2>
        <p className="mt-3 text-[var(--text-dim)]">{about.role}</p>
        {about.location && (
          <p className="mt-1 text-sm text-[var(--text-dim)]">{about.location}</p>
        )}
      </div>

      <div className="glass glass-glow px-8 py-10 sm:px-12 sm:py-12">
        <div className="flex flex-col gap-5">
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-lg leading-relaxed text-[var(--text-dim)]"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}