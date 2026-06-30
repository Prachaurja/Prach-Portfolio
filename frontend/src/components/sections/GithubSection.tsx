"use client";

import { useEffect, useState } from "react";
import { getGithubStats, type GithubStats, type Repo } from "@/lib/api";
import CountUp from "./CountUp";

// Small palette of glow colors keyed loosely by language
const LANG_COLOR: Record<string, string> = {
  TypeScript: "#5eead4",
  Python: "#a78bfa",
  JavaScript: "#fbbf24",
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass glass-glow flex flex-col items-center px-8 py-8">
      <span className="font-display text-5xl font-bold text-gradient">
        <CountUp end={value} />
      </span>
      <span className="mt-2 text-sm uppercase tracking-[0.2em] text-[var(--text-dim)]">
        {label}
      </span>
    </div>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  const dot = repo.language ? LANG_COLOR[repo.language] ?? "#9b9bb0" : "#9b9bb0";
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="glass group flex flex-col gap-3 px-6 py-5 transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-[var(--text)] group-hover:text-[var(--teal)] transition-colors">
          {repo.name}
        </h3>
        <span className="text-sm text-[var(--text-dim)]">★ {repo.stargazers_count}</span>
      </div>
      <p className="line-clamp-2 text-sm text-[var(--text-dim)]">
        {repo.description ?? "No description yet."}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-[var(--text-dim)]">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: dot }}
            />
            {repo.language}
          </span>
        )}
        {repo.forks_count > 0 && <span>· {repo.forks_count} forks</span>}
      </div>
    </a>
  );
}

export default function GithubSection() {
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getGithubStats()
      .then(setStats)
      .catch(() => setError(true));
  }, []);

  return (
    <section
      id="github"
      className="container-x relative z-10 py-24"
    >
      <div className="mb-12 text-center">
        <p className="font-display mb-3 text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
          Live from GitHub
        </p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          What I&apos;ve been <span className="text-gradient">building</span>
        </h2>
      </div>

      {error && (
        <div className="glass mx-auto max-w-md px-6 py-8 text-center text-[var(--text-dim)]">
          Couldn&apos;t reach the GitHub stats service. Make sure the backend is
          running on port 8000.
        </div>
      )}

      {!error && !stats && (
        <div className="text-center text-[var(--text-dim)]">Loading live stats…</div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <StatCard label="Followers" value={stats.followers} />
            <StatCard label="Public Repos" value={stats.public_repos} />
            <StatCard label="Total Stars" value={stats.total_stars} />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stats.top_repos.map((repo) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}