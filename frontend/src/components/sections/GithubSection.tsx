"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, GitFork, ArrowUpRight } from "lucide-react";
import {
  getGithubStats,
  getGithubContributions,
  type GithubStats,
  type Repo,
  type ContributionCalendar,
} from "@/lib/api";
import { useContent } from "@/context/ContentProvider";
import SectionHeader from "@/components/motion/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import CountUp from "./CountUp";
import GithubHeatmap from "./GithubHeatmap";

function RepoCard({ repo }: { repo: Repo }) {
  const reduce = useReducedMotion();
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      whileHover={reduce ? undefined : { y: -5 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="card sheen group flex flex-col gap-3 px-6 py-5"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-[var(--text)] transition-colors group-hover:text-[var(--teal)]">
          {repo.name}
        </h3>
        <ArrowUpRight className="h-4 w-4 text-[var(--text-dim)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <p className="line-clamp-2 text-sm text-[var(--text-dim)]">
        {repo.description ?? "No description yet."}
      </p>
      <div className="mt-auto flex items-center gap-4 pt-2 text-xs text-[var(--text-dim)]">
        {repo.language && <span>{repo.language}</span>}
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" /> {repo.stargazers_count}
        </span>
        {repo.forks_count > 0 && (
          <span className="flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" /> {repo.forks_count}
          </span>
        )}
      </div>
    </motion.a>
  );
}

export default function GithubSection() {
  const { content } = useContent();
  const [stats, setStats] = useState<GithubStats | null>(null);
  const [cal, setCal] = useState<ContributionCalendar | null>(null);

  useEffect(() => {
    getGithubStats().then(setStats).catch(() => setStats(null));
    getGithubContributions().then(setCal);
  }, []);

  return (
    <section id="github" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Live from GitHub" title="What I've been *building*" />

      {/* Contribution heatmap */}
      <Reveal className="card mt-12 px-6 py-8 sm:px-8">
        {cal ? (
          <>
            <div className="mb-7 grid grid-cols-3 gap-4">
              <div>
                <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                  <CountUp end={cal.total} />
                </div>
                <div className="label-mark mt-1">Contributions this year</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                  <CountUp end={cal.activeWeeks} />
                </div>
                <div className="label-mark mt-1">Active weeks</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold text-gradient sm:text-4xl">
                  <CountUp end={cal.peakDay} />
                </div>
                <div className="label-mark mt-1">Peak day</div>
              </div>
            </div>
            <GithubHeatmap data={cal} />
            {cal.generated && (
              <p className="mt-4 text-center text-[0.7rem] text-[var(--text-dim)]">
                Showing a representative activity graph — connect a GitHub token
                in the backend to display your exact daily contributions.
              </p>
            )}
          </>
        ) : (
          <div className="py-10 text-center text-[var(--text-dim)]">
            Loading contribution graph…
          </div>
        )}
      </Reveal>

      {/* Stat cards */}
      {stats && (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            { label: "Followers", value: stats.followers },
            { label: "Public Repos", value: stats.public_repos },
            { label: "Total Stars", value: stats.total_stars },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="card flex flex-col items-center px-8 py-8">
              <span className="font-display text-5xl font-bold text-gradient">
                <CountUp end={s.value} />
              </span>
              <span className="label-mark mt-2">{s.label}</span>
            </Reveal>
          ))}
        </div>
      )}

      {/* Top repos */}
      {stats && stats.top_repos?.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stats.top_repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <a
          href={content.github.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-2xl border border-[var(--glass-border)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--teal)]"
        >
          View GitHub Profile <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
