# Prachaurja Sarker — Portfolio

A heavily animated, Apple-style personal portfolio. Black starfield background,
serif typography throughout, Framer-Motion everywhere, and a built-in **Dev
Tool** that lets me edit every word, photo, and section without touching code.

- **Frontend:** Next.js 16 (App Router) · React 19 · Framer Motion · Three.js · Tailwind v4
- **Backend:** FastAPI · GitHub API (stats + contribution calendar) · contact form · content store

---

## Quick start

```bash
# frontend
cd frontend
pnpm install
pnpm dev          # http://localhost:3000

# backend (optional — the site works without it)
cd backend
pip install -r requirements.txt
cp .env.example .env   # fill in your values
uvicorn app.main:app --reload --port 8000
```

The frontend is fully self-sufficient: if the backend is offline it falls back
to bundled default content and a representative GitHub graph, so the site always
looks complete.

### Frontend env (`frontend/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api   # backend base URL
NEXT_PUBLIC_DEV_PASSWORD=change-me               # Dev Tool password
```

---

## ✨ The Dev Tool  (`/dev`)

Everything on the site is data-driven. Open **`/dev`**, enter the password, and
edit any section live — no code, no redeploy needed for local viewing.

- **Password:** set `NEXT_PUBLIC_DEV_PASSWORD` (frontend) and `ADMIN_PASSWORD`
  (backend) to the same value. Default while unset: `prachaurja`.
- **Edit anything:** hero, rotating quotes, about, socials, the tech marquee,
  skills, projects, GitHub, education (Uni Story), placements, clubs, honors,
  organizations, working story, achievements, contact — plus a **Raw JSON** tab.
- **Photos:** every photo slot (profile, project showcases, school/club logos,
  media images) has an **Upload** button. Images are auto-downscaled and stored
  with the content, so they show up immediately.
- **Save:** writes to your browser instantly **and** pushes to the backend
  (`PUT /api/content`) so the change goes live for every visitor when the backend
  is running.
- **Export / Import:** download the whole site as `content.json` (commit it to
  publish on a static host) or load one back in.

### How content loads (priority)
1. Backend `GET /api/content` — live for everyone
2. `localStorage` — your most recent local edits
3. Bundled `DEFAULT_CONTENT` in `frontend/src/lib/content.ts`

---

## 📄 Live resume  (`/resume`)

A clean, print-ready resume **generated from the current site content** — change
a project or skill in the Dev Tool and the resume updates to match. Click
**Download PDF** (browser print → Save as PDF).

---

## 🧩 Sections

Hero · rotating Quote ribbon · About (+ profile photo) · Technologies marquee
(two rows, opposite directions) · Skills · Projects · GitHub (real contribution
heatmap) · **My Uni Story** · **Placements** · **Clubs** · **Honors & Awards** ·
**Organizations** · **My Working Story** · Achievements · Contact.

---

## 🎞️ Motion

Reusable primitives in `frontend/src/components/motion/`: scroll reveals (fade +
blur + stagger), word-by-word heading reveals, magnetic buttons, parallax,
infinite marquee, a top scroll-progress bar, plus an animated **loading screen**
on first visit. Everything honours `prefers-reduced-motion`.

---

## 🔌 Backend API

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/github/stats` | followers, repos, stars, top repos |
| GET | `/api/github/contributions` | real contribution calendar (GraphQL, needs token) |
| GET | `/api/content` | the saved site content |
| PUT | `/api/content` | save site content (header `X-Admin-Password`) |
| POST | `/api/contact/` | contact form (rate-limited, honeypot) |

See `backend/.env.example` for configuration.
