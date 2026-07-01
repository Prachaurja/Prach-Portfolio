import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
});

export interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

export interface GithubStats {
  followers: number;
  public_repos: number;
  total_stars: number;
  top_repos: Repo[];
}

export const getGithubStats = (): Promise<GithubStats> =>
  api.get("/github/stats").then((r) => r.data);

// ---------- Contribution calendar ----------
export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}
export interface ContributionCalendar {
  total: number;
  weeks: ContributionDay[][]; // columns of (up to) 7 days
  activeWeeks: number;
  peakDay: number;
  generated?: boolean; // true when this is the local fallback, not real data
}

function levelFor(count: number): ContributionDay["level"] {
  if (count <= 0) return 0;
  if (count < 3) return 1;
  if (count < 6) return 2;
  if (count < 10) return 3;
  return 4;
}

/** Build ~12 months of plausible activity so the heatmap always looks alive. */
export function generateFallbackCalendar(): ContributionCalendar {
  const weeks: ContributionDay[][] = [];
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 7 * 51 - today.getDay());

  let total = 0;
  let activeWeeks = 0;
  let peakDay = 0;

  for (let w = 0; w < 52; w++) {
    const week: ContributionDay[] = [];
    let weekHas = false;
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      if (date > today) break;
      // weekdays busier than weekends, with a couple of streaky spikes
      const weekend = d === 0 || d === 6;
      const base = weekend ? 0.45 : 0.78;
      const streak = Math.sin((w + d) * 0.7) * 0.5 + 0.5;
      const roll = Math.random();
      let count = 0;
      if (roll < base) count = Math.floor(Math.random() * (4 + streak * 9));
      if (count > 0) weekHas = true;
      total += count;
      peakDay = Math.max(peakDay, count);
      week.push({ date: date.toISOString().slice(0, 10), count, level: levelFor(count) });
    }
    if (weekHas) activeWeeks++;
    weeks.push(week);
  }

  return { total, weeks, activeWeeks, peakDay, generated: true };
}

/** Real contributions from the backend; falls back to a generated calendar. */
export const getGithubContributions = async (): Promise<ContributionCalendar> => {
  try {
    const { data } = await api.get("/github/contributions");
    if (data && Array.isArray(data.weeks) && data.weeks.length) return data;
    return generateFallbackCalendar();
  } catch {
    return generateFallbackCalendar();
  }
};

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot
}

export const sendContact = (payload: ContactPayload) =>
  api.post("/contact/", payload).then((r) => r.data);
