// ============================================================
//  SITE CONTENT — single source of truth for the whole site.
//
//  Everything visible on the portfolio is described here. The
//  Dev Tool (/dev) edits this exact shape and persists it, so
//  you never have to touch code to change copy, photos, or items.
//
//  At runtime the ContentProvider loads content in this order:
//    1. backend  (GET /api/content)      — live for every visitor
//    2. localStorage  (your last edits)  — instant, offline
//    3. this file  (DEFAULT_CONTENT)      — guaranteed fallback
// ============================================================

export type ImageRef = string; // URL or data-URL ("" = empty placeholder)

export interface SocialLink {
  label: string;
  href: string;
  /** icon key understood by <SocialIcon> */
  icon:
    | "github"
    | "linkedin"
    | "twitter"
    | "instagram"
    | "facebook"
    | "email"
    | "link";
}

export interface Stat {
  value: string; // e.g. "500+"
  label: string; // e.g. "GitHub Commits"
}

export interface Skill {
  name: string;
  level: number; // 0–100
}
export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  featured?: boolean;
  year?: string;
  image?: ImageRef; // optional showcase image
}

export interface Achievement {
  title: string;
  description: string;
  year?: string;
  tag?: string;
  image?: ImageRef;
}

/** Generic LinkedIn-style "experience" entry with one or more roles. */
export interface ExperienceRole {
  title: string;
  meta?: string; // "Part-time · Feb 2026 – Present · 5 mos"
  description?: string;
  bullets?: string[];
  skills?: string[];
}
export interface Experience {
  org: string;
  logo?: ImageRef;
  meta?: string; // "2 yrs 10 mos"
  location?: string;
  roles: ExperienceRole[];
  mediaTitle?: string;
  mediaCaption?: string;
  mediaImage?: ImageRef;
}

export interface EducationItem {
  school: string;
  logo?: ImageRef;
  degree: string;
  period: string;
  grade?: string;
  activities?: string;
  description?: string;
  skills?: string[];
  tag?: string; // "EDUCATION" | "CAPSTONE" ...
  mediaTitle?: string;
  mediaCaption?: string;
  mediaImage?: ImageRef;
}

export interface HonorItem {
  title: string;
  issuer?: string;
  associated?: string;
  description?: string;
  image?: ImageRef;
}

export interface OrganizationItem {
  name: string;
  role?: string;
  description?: string;
}

export interface PlacementItem {
  company: string;
  logo?: ImageRef;
  role: string;
  period: string;
  location?: string;
  description?: string;
  projects?: { title: string; description: string }[];
  skills?: string[];
}

export interface SiteContent {
  hero: {
    eyebrow: string;
    headlineLines: string[]; // each line; words wrapped in *asterisks* render in the silver gradient
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    resumeCta: { label: string; href: string };
    stats: Stat[];
  };
  quotes: { text: string; author: string }[];
  about: {
    name: string;
    role: string;
    paragraphs: string[];
    profilePhoto: ImageRef;
    quickFacts: { label: string; value: string }[];
  };
  socials: SocialLink[];
  technologies: { topRow: string[]; bottomRow: string[] };
  skillGroups: SkillGroup[];
  projects: Project[];
  github: {
    username: string;
    profileUrl: string;
  };
  uniStory: EducationItem[];
  placements: PlacementItem[];
  clubs: Experience[];
  honors: HonorItem[];
  organizations: OrganizationItem[];
  workingStory: Experience[];
  achievements: Achievement[];
  contact: {
    blurb: string;
    email: string;
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: "Data Science Enthusiast · Full-Stack Developer · Backend & AI",
    headlineLines: ["Building *Ambitious*", "Systems for the *Web*"],
    subtitle:
      "I design and ship full-stack products — from real-time dashboards to AI-powered tools. Currently turning ideas into things people use.",
    primaryCta: { label: "View Projects", href: "#projects" },
    secondaryCta: { label: "Get in Touch", href: "#contact" },
    resumeCta: { label: "Resume", href: "/resume" },
    stats: [
      { value: "5+", label: "Projects Built" },
      { value: "500+", label: "GitHub Commits" },
      { value: "4", label: "Core Languages" },
      { value: "2", label: "Capstone Awards" },
    ],
  },
  quotes: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
    { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
    { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  ],
  about: {
    name: "Prachaurja Sarker",
    role: "Full-Stack Developer · Backend & Data/AI",
    paragraphs: [
      "I'm someone who likes turning messy, scattered information into clear, usable systems. Most of what I build lives at the intersection of full-stack web, backend APIs, and data — dashboards that pull signals together, tools that make complex things feel simple.",
      "I'm a Computer Science student majoring in Data Science at La Trobe University, genuinely curious across the stack — from shaping a clean API to wiring up a frontend to experimenting with AI. I learn fastest by building real things, which is most of what you'll find here.",
      "Right now I'm actively looking for opportunities — graduate roles, internships, or freelance work — where I can keep building and keep growing.",
    ],
    profilePhoto: "",
    quickFacts: [
      { label: "Location", value: "Melbourne, Australia" },
      { label: "Status", value: "Open to Work" },
      { label: "Focus", value: "Backend & AI" },
    ],
  },
  socials: [
    { label: "GitHub", href: "https://github.com/Prachaurja", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
    { label: "Twitter/X", href: "https://twitter.com/", icon: "twitter" },
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
    { label: "Facebook", href: "https://facebook.com/", icon: "facebook" },
    { label: "Email", href: "mailto:prachaurja@gmail.com", icon: "email" },
  ],
  technologies: {
    topRow: [
      "Python",
      "R",
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "FastAPI",
      "Node.js",
      "TailwindCSS",
    ],
    bottomRow: [
      "PostgreSQL",
      "Supabase",
      "Docker",
      "Pandas",
      "SQLAlchemy",
      "Pydantic",
      "LLM Integration",
      "RAG Pipelines",
      "Git & GitHub",
      "REST APIs",
    ],
  },
  skillGroups: [
    {
      category: "Languages",
      skills: [
        { name: "Python", level: 85 },
        { name: "TypeScript", level: 80 },
        { name: "JavaScript", level: 80 },
        { name: "SQL", level: 70 },
      ],
    },
    {
      category: "Frontend",
      skills: [
        { name: "React", level: 80 },
        { name: "Tailwind CSS", level: 80 },
        { name: "Next.js", level: 75 },
      ],
    },
    {
      category: "Backend & Data",
      skills: [
        { name: "FastAPI", level: 80 },
        { name: "Supabase", level: 75 },
        { name: "PostgreSQL", level: 70 },
      ],
    },
    {
      category: "AI / Tools",
      skills: [
        { name: "Git & GitHub", level: 85 },
        { name: "LLM Integration", level: 72 },
        { name: "Docker", level: 60 },
      ],
    },
  ],
  projects: [
    {
      slug: "war-room",
      title: "War Room — Bid Intelligence Dashboard",
      description:
        "A real-time bid intelligence dashboard built for Promptcorp as a capstone project.",
      longDescription:
        "War Room aggregates tenders and bids into a single situational-awareness interface. Built with the Team Mavericks crew, it surfaces the signals that matter for competitive bidding in real time — turning scattered data into a clear operational picture.",
      tech_stack: ["TypeScript", "React", "FastAPI", "Supabase"],
      github_url:
        "https://github.com/Prachaurja/War-Room-Bid-Intelligence-Dashboard-_Team-Mavericks",
      featured: true,
      year: "2026",
      image: "",
    },
    {
      slug: "flexikitch-chatbot",
      title: "Flexikitch — Dashboard ChatBot",
      description:
        "A conversational interface layered over operational dashboard data.",
      longDescription:
        "Flexikitch ChatBot lets users query a kitchen operations dashboard in plain language instead of clicking through menus — a natural-language layer over operational data, replacing clicks with conversation.",
      tech_stack: ["Python", "LLM", "FastAPI"],
      github_url: "https://github.com/Prachaurja/Flexikitch-Dashboard-ChatBot",
      featured: true,
      year: "2025",
      image: "",
    },
    {
      slug: "worldmonitor",
      title: "WorldMonitor — Global Intelligence",
      description:
        "Real-time global intelligence dashboard with AI-powered news aggregation.",
      longDescription:
        "A unified situational-awareness interface: AI-powered news aggregation, geopolitical monitoring, and infrastructure tracking, all in one place.",
      tech_stack: ["Python", "AI", "Dashboards"],
      github_url: "https://github.com/Prachaurja/worldmonitor",
      year: "2025",
      image: "",
    },
  ],
  github: {
    username: "Prachaurja",
    profileUrl: "https://github.com/Prachaurja",
  },
  uniStory: [
    {
      school: "La Trobe University",
      logo: "",
      degree: "Bachelor's degree, Computer Science (Major in Data Science)",
      period: "Aug 2023 – Present",
      grade: "Current WAM 71.25%",
      tag: "EDUCATION",
      activities:
        "Organiser and Treasurer at Google Developer Group (GDG) La Trobe University.",
      description:
        "A journey that everyone wish to witness but somewhat I was quite lucky enough to get this opportunity. Can't thank enough to my Mom and Dad for their tremendous mental, physical and financial support. I don't know, will I ever be able to pay them off or not but I'll try my best to be a GOOD HUMAN BEING as my parents always wanted me to become.",
      skills: ["Python", "R", "Data Science", "Machine Learning", "Statistics"],
      mediaTitle: "CSE3CI Class Time",
      mediaCaption: "It's in the lecture class of Computational Intelligence.",
      mediaImage: "",
    },
    {
      school: "BRAC University",
      logo: "",
      degree: "Bachelor's degree, Computer Science",
      period: "May 2021 – Jul 2023",
      grade: "CGPA 3.41 out of 4.00",
      tag: "EDUCATION",
      activities: "Brac University Computer Club (BUCC)",
      description:
        "Somewhat turning point of my life and later prove myself wrong.",
      skills: ["Python", "Debate"],
      mediaTitle: "BracU New Campus",
      mediaCaption: "The ultimate New Campus of Brac University.",
      mediaImage: "",
    },
    {
      school: "Dhaka City College",
      logo: "",
      degree: "12th Grade, Science",
      period: "Jul 2018 – Oct 2020",
      grade: "GPA 5.00 out of 5.00",
      tag: "HIGHER SECONDARY",
      activities: "Section: L · Code: 45 · Roll: 1803",
      description:
        "The place where everything was started — more precisely, where my life begins and made me a NEW ME.",
      skills: [],
      mediaImage: "",
    },
  ],
  placements: [
    {
      company: "Flexikitch PTY LTD",
      logo: "",
      role: "Software Developer (Industry Placement)",
      period: "[Add start] – [Add end]",
      location: "Melbourne, Victoria, Australia",
      description:
        "Industry placement at Flexikitch PTY LTD, working across the product to ship real features for kitchen operations. (Placeholder — update the exact dates, team, and impact from the Dev Tool.)",
      projects: [
        {
          title: "Flexikitch Dashboard ChatBot",
          description:
            "Built a natural-language interface over the operations dashboard so staff could query data in plain English instead of clicking through menus.",
        },
        {
          title: "[Project 2 — add title]",
          description:
            "[Describe what you built, the stack you used, and the outcome. Edit from the Dev Tool.]",
        },
        {
          title: "[Project 3 — add title]",
          description:
            "[Another placement project placeholder — add details anytime.]",
        },
      ],
      skills: ["Python", "FastAPI", "LLM Integration", "Dashboards"],
    },
  ],
  clubs: [
    {
      org: "Google Developer Group on Campus — La Trobe University",
      logo: "",
      meta: "Apprenticeship · 2 yrs 11 mos",
      location: "Bundoora, Victoria, Australia · Hybrid",
      roles: [
        {
          title: "Organiser and Treasurer",
          meta: "Jul 2024 – Present · 2 yrs",
          description:
            "As an Organiser and Treasurer of GDG On Campus La Trobe University, I'm responsible for leading operations, managing finances, and coordinating community-driven events that empower students to learn and innovate with Google technologies. The role requires strong leadership, organisation, and communication skills to successfully manage a fast-growing student tech community.",
          bullets: [
            "Financial Management: Handled budgeting, sponsorship allocation, and expense tracking to ensure efficient use of funds for events and workshops.",
            "Event Coordination: Organised workshops, hackathons, coding competitions, and speaker sessions covering web development, AI/ML, cloud computing and more.",
            "Leadership & Mentorship: Guided new members, collaborated with fellow organisers, and supported teams in project development and event participation.",
            "Community Engagement: Built partnerships with students, faculty, and industry professionals to expand the club's reach and visibility.",
            "Strategic Planning: Worked with the organising team to plan the yearly roadmap of events aligned with GDG's mission and La Trobe University's student engagement goals.",
          ],
          skills: [
            "Financial Analysis & Reporting",
            "Organisational Skills",
            "Leadership & Team Management",
            "Event Management",
            "Public Speaking",
            "Community Building",
          ],
        },
        {
          title: "Club Member",
          meta: "Aug 2023 – Jul 2024 · 1 yr",
          description:
            "As a member of Google Developer Group On Campus — La Trobe University, I actively engaged in a global developer community supported by Google, getting access to free and paid Google technologies, workshops, and events.",
          skills: [
            "Technical Skills (Google Cloud, Firebase, etc.)",
            "Communication",
            "Collaboration & Teamwork",
            "Networking",
            "Continuous Learning",
          ],
        },
      ],
      mediaTitle: "gdgINIT2024",
      mediaCaption: "GDG On Campus La Trobe University — INIT 2024.",
      mediaImage: "",
    },
  ],
  honors: [
    {
      title: "La Trobe University Excellence Scholarship (CE30)",
      issuer: "Issued by La Trobe University · Jul 2023",
      associated: "Associated with La Trobe University",
      description:
        "Kinda turning point of my life which I had NEVER expected will happen. :)",
      image: "",
    },
  ],
  organizations: [
    {
      name: "The Australasian Council for Undergraduate Research (ACUR)",
      role: "Undergraduate Research Fellow · Aug 2023 – Aug 2024",
      description: "LITERALLY ZERO OUTCOMES.",
    },
  ],
  workingStory: [
    {
      org: "Woolworths Supermarkets",
      logo: "",
      meta: "2 yrs 10 mos",
      location: "Greensborough, Victoria, Australia · On-site",
      roles: [
        {
          title: "Night Fill Team Member",
          meta: "Contract · Feb 2026 – Present · 5 mos",
          description:
            "Long waited \"Casual Team Member\" era has turned into the \"Contracted Part Time\" one. So happy and passionate to keep growing with the team.",
          skills: ["Stock Management", "Communication", "Collaboration & Teamwork"],
        },
        {
          title: "Night Fill Team Member",
          meta: "Part-time · Sep 2023 – Feb 2026 · 2 yrs 6 mos",
          description:
            "Restock, refilling shelves with products, cleanliness, ready for fill, efficient working, hitting daily restocking targets.",
          skills: ["Stock Management", "Communication", "Time Management"],
        },
      ],
    },
    {
      org: "Ecowize ANZ",
      logo: "",
      location: "Thomastown, Victoria, Australia · On-site",
      roles: [
        {
          title: "Hygiene Operator",
          meta: "Part-time · Mar 2025 – Present · 1 yr 4 mos",
          description:
            "Specialized cleaning processes at INGHAMS with executed deep cleaning and CIP procedures, enhancing operational hygiene and food safety standards.",
          skills: ["Hygiene Operations", "Deep Cleaning", "CIP Procedures"],
        },
      ],
      mediaTitle: "Inghams",
      mediaCaption: "On-site hygiene operations at Inghams.",
      mediaImage: "",
    },
    {
      org: "AHS Hospitality",
      logo: "",
      location: "Melbourne, Victoria, Australia · On-site",
      roles: [
        {
          title: "Room Attendant",
          meta: "Part-time · Mar 2024 – Oct 2024 · 8 mos",
          description:
            "This was one of my 1st jobs I worked after coming to Australia. I worked as a Room Attendant at AHS Hospitality, keeping rooms guest-ready under tight turnaround times.",
          skills: [
            "Housekeeping",
            "Cleaning & Room Preparation",
            "Time Management & Efficiency",
            "Attention to Detail",
          ],
        },
      ],
    },
  ],
  achievements: [
    {
      title: "Capstone Excellence Award — War Room",
      description:
        "Recognized for delivering a production-grade bid intelligence dashboard as a final-year capstone project in partnership with Promptcorp.",
      year: "2026",
      tag: "AWARD",
      image: "",
    },
    {
      title: "La Trobe University Excellence Scholarship (CE30)",
      description:
        "Awarded the CE30 Excellence Scholarship by La Trobe University — a genuine turning point.",
      year: "2023",
      tag: "SCHOLARSHIP",
      image: "",
    },
    {
      title: "Full-Stack Independent Project — Flexikitch",
      description:
        "Conceived, designed, and shipped a natural-language dashboard interface — backend, AI layer, and deployment.",
      year: "2025",
      tag: "PROJECT",
      image: "",
    },
  ],
  contact: {
    blurb:
      "Open to roles, freelance, or just a good conversation. Drop me a line and I'll reply within a day.",
    email: "prachaurja@gmail.com",
  },
};
