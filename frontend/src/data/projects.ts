// ============================================================
//  YOUR PROJECTS
//  To add a project: copy a block below, change the fields,
//  and paste it inside the `projects` array.
//  `slug` must be unique (lowercase-with-hyphens, no spaces).
//  Optional fields (github_url, live_url, featured, longDescription)
//  can be removed if you don't need them.
// ============================================================

export interface Project {
    slug: string;
    title: string;
    description: string;        // short, shown in the list
    longDescription?: string;   // longer, shown in the big detail card
    tech_stack: string[];
    github_url?: string;
    live_url?: string;
    featured?: boolean;
  }
  
  export const projects: Project[] = [
    {
      slug: "war-room",
      title: "War Room — Bid Intelligence Dashboard",
      description:
        "A real-time bid intelligence dashboard built for Promptcorp as a capstone project.",
      longDescription:
        "War Room aggregates tenders and bids into a single situational-awareness interface. Built with the Team Mavericks crew, it surfaces the signals that matter for competitive bidding in real time, turning scattered data into a clear operational picture.",
      tech_stack: ["TypeScript", "React", "FastAPI", "Supabase"],
      github_url:
        "https://github.com/Prachaurja/War-Room-Bid-Intelligence-Dashboard-_Team-Mavericks",
      featured: true,
    },
    {
      slug: "flexikitch-chatbot",
      title: "Flexikitch Dashboard ChatBot",
      description:
        "A conversational interface layered over operational dashboard data.",
      longDescription:
        "Flexikitch ChatBot lets users query their dashboard in plain language instead of clicking through menus — a natural-language layer over operational data.",
      tech_stack: ["Python"],
      github_url: "https://github.com/Prachaurja/Flexikitch-Dashboard-ChatBot",
      featured: true,
    },
  
    // ----- ADD A NEW PROJECT: copy this block, fill it in, remove the comment lines -----
    // {
    //   slug: "my-project",
    //   title: "My Project",
    //   description: "One-line summary for the list.",
    //   longDescription: "Longer paragraph for the detail card.",
    //   tech_stack: ["Next.js", "PostgreSQL"],
    //   github_url: "https://github.com/Prachaurja/my-project",
    //   live_url: "https://my-project.com",
    //   featured: false,
    // },
  ];
  
  // Featured projects sort to the top of the list
  export const sortedProjects = [...projects].sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
  );
  
  export const getProjectBySlug = (slug: string) =>
    projects.find((p) => p.slug === slug);