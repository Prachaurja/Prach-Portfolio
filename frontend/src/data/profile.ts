// ============================================================
//  YOUR PROFILE — edit this file to fill in your real details.
//  Everything below is placeholder/inferred. Replace the text,
//  numbers, and lists with your own. No code knowledge needed —
//  just change what's inside the quotes and brackets.
// ============================================================

// ---------- ABOUT ----------
export const about = {
    name: "Prachaurja",
    // A short role line shown under your name
    role: "Full-Stack Developer · Backend & Data/AI",
    // Optional location — set to "" to hide it
    location: "",
    // 2–3 short paragraphs, warm and personable. Rewrite in your voice.
    paragraphs: [
      "I'm someone who likes turning messy, scattered information into clear, usable systems. Most of what I build lives at the intersection of full-stack web, backend APIs, and data — dashboards that pull signals together, tools that make complex things feel simple.",
      "I'm a recent graduate, still exploring where I fit best, and genuinely curious across the stack — from shaping a clean API to wiring up a frontend to experimenting with AI. I learn fastest by building real things, which is most of what you'll find here.",
      "Right now I'm actively looking for opportunities — full-time roles, internships, or freelance work — where I can keep building and keep growing.",
    ],
  };
  
  // ---------- SKILLS ----------
  // `level` is a percentage (0–100) that fills the bar.
  // Be honest — it's fine to have a mix. Group however you like.
  export interface Skill {
    name: string;
    level: number;
  }
  export interface SkillGroup {
    category: string;
    skills: Skill[];
  }
  
  export const skillGroups: SkillGroup[] = [
    {
      category: "Languages",
      skills: [
        { name: "TypeScript", level: 80 },
        { name: "Python", level: 85 },
        { name: "JavaScript", level: 80 },
        { name: "SQL", level: 70 },
      ],
    },
    {
      category: "Frontend",
      skills: [
        { name: "React", level: 80 },
        { name: "Next.js", level: 75 },
        { name: "Tailwind CSS", level: 80 },
      ],
    },
    {
      category: "Backend & Data",
      skills: [
        { name: "FastAPI", level: 80 },
        { name: "PostgreSQL", level: 70 },
        { name: "Supabase", level: 75 },
      ],
    },
    {
      category: "AI / Tools",
      skills: [
        { name: "AI / LLM integration", level: 70 },
        { name: "Git & GitHub", level: 85 },
        { name: "Docker", level: 60 },
      ],
    },
  ];
  
  // ---------- ACHIEVEMENTS ----------
  // Add, remove, or edit freely. `year` is optional.
  export interface Achievement {
    title: string;
    description: string;
    year?: string;
  }
  
  export const achievements: Achievement[] = [
    {
      title: "Capstone — War Room Bid Intelligence Dashboard",
      description:
        "Built a real-time bid intelligence dashboard for Promptcorp with Team Mavericks as a capstone project.",
      year: "2026",
    },
    {
      title: "Add your achievement here",
      description:
        "Hackathons, awards, certifications, leadership, competitions — anything you're proud of. Edit this in data/profile.ts.",
    },
  ];