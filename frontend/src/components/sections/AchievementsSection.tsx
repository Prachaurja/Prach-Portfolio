import { achievements } from "@/data/profile";

export default function AchievementsSection() {
  return (
    <section id="achievements" className="relative z-10 mx-auto max-w-4xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="font-display mb-3 text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
          Milestones
        </p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          <span className="text-gradient">Achievements</span>
        </h2>
      </div>

      <div className="flex flex-col gap-5">
        {achievements.map((a, i) => (
          <div
            key={i}
            className="glass glass-glow flex flex-col gap-2 px-7 py-6 sm:flex-row sm:items-start sm:gap-6"
          >
            {a.year && (
              <span className="font-display shrink-0 text-lg font-bold text-[var(--teal)]">
                {a.year}
              </span>
            )}
            <div>
              <h3 className="font-display text-xl font-semibold text-[var(--text)]">
                {a.title}
              </h3>
              <p className="mt-2 leading-relaxed text-[var(--text-dim)]">
                {a.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}