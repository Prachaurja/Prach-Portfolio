"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Save,
  LogOut,
  Download,
  Upload as UploadIcon,
  RotateCcw,
  Eye,
  Lock,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useContent } from "@/context/ContentProvider";
import {
  DEFAULT_CONTENT,
  type SiteContent,
  type SocialLink,
  type EducationItem,
  type PlacementItem,
  type Experience,
  type ExperienceRole,
  type HonorItem,
  type OrganizationItem,
  type Achievement,
} from "@/lib/content";
import {
  AUTH_KEY,
  DEV_PASSWORD,
  downloadJson,
  mergeContent,
  pushRemoteContent,
} from "@/lib/storage";
import {
  TextField,
  TextArea,
  NumberField,
  ImageField,
  StringList,
  ArrayEditor,
  Labeled,
} from "@/components/dev/fields";

const TABS = [
  "Hero",
  "Quotes",
  "About",
  "Socials",
  "Tech",
  "Skills",
  "Projects",
  "GitHub",
  "Education",
  "Placements",
  "Clubs",
  "Honors",
  "Orgs",
  "Work",
  "Achievements",
  "Contact",
  "Raw JSON",
] as const;
type Tab = (typeof TABS)[number];

export default function DevPage() {
  const { content, setContent } = useContent();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [tab, setTab] = useState<Tab>("Hero");
  const [draft, setDraft] = useState<SiteContent>(content);
  const [savedAt, setSavedAt] = useState<string>("");
  const [syncMsg, setSyncMsg] = useState<string>("");

  useEffect(() => {
    // read auth flag from sessionStorage (unavailable during SSR/render)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (sessionStorage.getItem(AUTH_KEY) === "1") setAuthed(true);
  }, []);

  // keep the draft fresh if the provider's content loads in after mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(content);
  }, [content]);

  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === DEV_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      setAuthed(true);
      setPwErr(false);
    } else {
      setPwErr(true);
    }
  };

  const save = async () => {
    setContent(draft); // persists to localStorage immediately
    setSavedAt(new Date().toLocaleTimeString());
    setSyncMsg("Syncing to backend…");
    const ok = await pushRemoteContent(draft, DEV_PASSWORD);
    setSyncMsg(
      ok
        ? "Saved & live for everyone (backend synced)."
        : "Saved locally. Backend not reachable — use Export to publish."
    );
  };

  const onImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        setDraft(mergeContent(DEFAULT_CONTENT, parsed));
        setSyncMsg("Imported JSON into the editor. Review, then Save.");
      } catch {
        setSyncMsg("That file wasn't valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  if (!authed) {
    return (
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <form onSubmit={login} className="card w-full max-w-sm px-8 py-10">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--glass-border)] text-[var(--teal)]">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl font-bold">Dev Tool</h1>
              <p className="text-xs text-[var(--text-dim)]">Private — author access only</p>
            </div>
          </div>
          <Labeled label="Password">
            <input
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-lg border border-[var(--glass-border)] bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-[var(--teal)]"
              placeholder="Enter password"
            />
          </Labeled>
          {pwErr && (
            <p className="mt-3 flex items-center gap-2 text-sm text-[#f87171]">
              <AlertTriangle className="h-4 w-4" /> Incorrect password.
            </p>
          )}
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-[var(--teal)] px-6 py-3 font-medium text-black"
          >
            Unlock
          </button>
          <Link href="/" className="mt-4 block text-center text-xs text-[var(--text-dim)] hover:text-[var(--text)]">
            ← Back to site
          </Link>
        </form>
      </main>
    );
  }

  return (
    <main className="relative z-10 min-h-screen px-4 pt-24 pb-20">
      <div className="container-x">
        {/* toolbar */}
        <div className="card mb-6 flex flex-wrap items-center gap-3 px-5 py-4">
          <div className="mr-auto">
            <h1 className="font-display text-lg font-bold">Dev Tool</h1>
            <p className="text-xs text-[var(--text-dim)]">
              Edit everything. Changes save to your browser instantly; Save also
              pushes to the backend when it&apos;s running.
            </p>
          </div>
          <Link href="/" target="_blank" className="flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] px-3 py-2 text-xs hover:border-[var(--teal)]">
            <Eye className="h-3.5 w-3.5" /> Preview
          </Link>
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--glass-border)] px-3 py-2 text-xs hover:border-[var(--teal)]">
            <UploadIcon className="h-3.5 w-3.5" /> Import
            <input type="file" accept="application/json" className="hidden" onChange={onImport} />
          </label>
          <button onClick={() => downloadJson(draft)} className="flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] px-3 py-2 text-xs hover:border-[var(--teal)]">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button
            onClick={() => { if (confirm("Reset the editor to default content? Unsaved edits in the editor are lost.")) setDraft(DEFAULT_CONTENT); }}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] px-3 py-2 text-xs text-[var(--text-dim)] hover:text-[#f87171]"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <button onClick={save} className="flex items-center gap-1.5 rounded-lg bg-[var(--teal)] px-4 py-2 text-xs font-semibold text-black">
            <Save className="h-3.5 w-3.5" /> Save
          </button>
          <button
            onClick={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false); }}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--glass-border)] px-3 py-2 text-xs text-[var(--text-dim)] hover:text-[var(--text)]"
          >
            <LogOut className="h-3.5 w-3.5" /> Lock
          </button>
        </div>

        {(savedAt || syncMsg) && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-black/30 px-4 py-3 text-sm text-[var(--text-dim)]">
            <Check className="h-4 w-4 text-[var(--teal)]" />
            {syncMsg}{savedAt && ` · last saved ${savedAt}`}
          </div>
        )}

        {/* tabs */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                tab === t
                  ? "bg-[var(--teal)] text-black"
                  : "border border-[var(--glass-border)] text-[var(--text-dim)] hover:text-[var(--text)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* editor body */}
        <div className="card flex flex-col gap-5 px-5 py-6 sm:px-7">
          {tab === "Hero" && (
            <>
              <TextField label="Eyebrow" value={draft.hero.eyebrow} onChange={(v) => set("hero", { ...draft.hero, eyebrow: v })} />
              <StringList
                label="Headline lines (wrap a word in *asterisks* for the silver gradient)"
                items={draft.hero.headlineLines}
                onChange={(v) => set("hero", { ...draft.hero, headlineLines: v })}
                placeholder="e.g. Building *Ambitious*"
              />
              <TextArea label="Subtitle" value={draft.hero.subtitle} onChange={(v) => set("hero", { ...draft.hero, subtitle: v })} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField label="Primary CTA label" value={draft.hero.primaryCta.label} onChange={(v) => set("hero", { ...draft.hero, primaryCta: { ...draft.hero.primaryCta, label: v } })} />
                <TextField label="Primary CTA link" value={draft.hero.primaryCta.href} onChange={(v) => set("hero", { ...draft.hero, primaryCta: { ...draft.hero.primaryCta, href: v } })} />
                <TextField label="Secondary CTA label" value={draft.hero.secondaryCta.label} onChange={(v) => set("hero", { ...draft.hero, secondaryCta: { ...draft.hero.secondaryCta, label: v } })} />
                <TextField label="Secondary CTA link" value={draft.hero.secondaryCta.href} onChange={(v) => set("hero", { ...draft.hero, secondaryCta: { ...draft.hero.secondaryCta, href: v } })} />
              </div>
              <ArrayEditor
                label="Stats"
                items={draft.hero.stats}
                onChange={(v) => set("hero", { ...draft.hero, stats: v })}
                create={() => ({ value: "0", label: "New stat" })}
                titleOf={(s) => `${s.value} ${s.label}`}
                render={(s, update) => (
                  <div className="grid grid-cols-2 gap-4">
                    <TextField label="Value" value={s.value} onChange={(v) => update({ value: v })} />
                    <TextField label="Label" value={s.label} onChange={(v) => update({ label: v })} />
                  </div>
                )}
              />
            </>
          )}

          {tab === "Quotes" && (
            <ArrayEditor
              label="Famous quotes (rotate every 15s, italic serif)"
              items={draft.quotes}
              onChange={(v) => set("quotes", v)}
              create={() => ({ text: "New quote", author: "Author" })}
              titleOf={(q) => q.text}
              render={(q, update) => (
                <>
                  <TextArea label="Quote" rows={2} value={q.text} onChange={(v) => update({ text: v })} />
                  <TextField label="Author" value={q.author} onChange={(v) => update({ author: v })} />
                </>
              )}
            />
          )}

          {tab === "About" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField label="Name" value={draft.about.name} onChange={(v) => set("about", { ...draft.about, name: v })} />
                <TextField label="Role line" value={draft.about.role} onChange={(v) => set("about", { ...draft.about, role: v })} />
              </div>
              <ImageField label="Profile photo" value={draft.about.profilePhoto} onChange={(v) => set("about", { ...draft.about, profilePhoto: v })} />
              <ArrayEditor
                label="Paragraphs"
                items={draft.about.paragraphs.map((text) => ({ text }))}
                onChange={(v) => set("about", { ...draft.about, paragraphs: v.map((p) => p.text) })}
                create={() => ({ text: "New paragraph" })}
                titleOf={(p) => p.text}
                render={(p, update) => (
                  <TextArea label="Paragraph" value={p.text} onChange={(v) => update({ text: v })} />
                )}
              />
              <ArrayEditor
                label="Quick facts"
                items={draft.about.quickFacts}
                onChange={(v) => set("about", { ...draft.about, quickFacts: v })}
                create={() => ({ label: "Label", value: "Value" })}
                titleOf={(f) => `${f.label}: ${f.value}`}
                render={(f, update) => (
                  <div className="grid grid-cols-2 gap-4">
                    <TextField label="Label" value={f.label} onChange={(v) => update({ label: v })} />
                    <TextField label="Value" value={f.value} onChange={(v) => update({ value: v })} />
                  </div>
                )}
              />
            </>
          )}

          {tab === "Socials" && (
            <ArrayEditor
              label="Social links"
              items={draft.socials}
              onChange={(v) => set("socials", v)}
              create={() => ({ label: "New", href: "https://", icon: "link" }) as SocialLink}
              titleOf={(s) => s.label}
              render={(s, update) => (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <TextField label="Label" value={s.label} onChange={(v) => update({ label: v })} />
                    <Labeled label="Icon">
                      <select
                        className="w-full rounded-lg border border-[var(--glass-border)] bg-black/40 px-3 py-2 text-sm outline-none focus:border-[var(--teal)]"
                        value={s.icon}
                        onChange={(e) => update({ icon: e.target.value as SocialLink["icon"] })}
                      >
                        {["github", "linkedin", "twitter", "instagram", "facebook", "email", "link"].map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </Labeled>
                  </div>
                  <TextField label="URL" value={s.href} onChange={(v) => update({ href: v })} />
                </>
              )}
            />
          )}

          {tab === "Tech" && (
            <>
              <StringList label="Top row (scrolls left)" items={draft.technologies.topRow} onChange={(v) => set("technologies", { ...draft.technologies, topRow: v })} />
              <StringList label="Bottom row (scrolls right)" items={draft.technologies.bottomRow} onChange={(v) => set("technologies", { ...draft.technologies, bottomRow: v })} />
            </>
          )}

          {tab === "Skills" && (
            <ArrayEditor
              label="Skill groups"
              items={draft.skillGroups}
              onChange={(v) => set("skillGroups", v)}
              create={() => ({ category: "New group", skills: [] })}
              titleOf={(g) => g.category}
              render={(g, update) => (
                <>
                  <TextField label="Category" value={g.category} onChange={(v) => update({ category: v })} />
                  <ArrayEditor
                    label="Skills"
                    items={g.skills}
                    onChange={(v) => update({ skills: v })}
                    create={() => ({ name: "New skill", level: 70 })}
                    titleOf={(s) => `${s.name} · ${s.level}%`}
                    render={(s, u) => (
                      <div className="grid grid-cols-2 gap-4">
                        <TextField label="Name" value={s.name} onChange={(v) => u({ name: v })} />
                        <NumberField label="Level %" value={s.level} onChange={(v) => u({ level: v })} />
                      </div>
                    )}
                  />
                </>
              )}
            />
          )}

          {tab === "Projects" && (
            <ArrayEditor
              label="Projects"
              items={draft.projects}
              onChange={(v) => set("projects", v)}
              create={() => ({ slug: `project-${Date.now()}`, title: "New Project", description: "", tech_stack: [] })}
              titleOf={(p) => p.title}
              render={(p, update) => (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField label="Title" value={p.title} onChange={(v) => update({ title: v })} />
                    <TextField label="Slug (unique)" value={p.slug} onChange={(v) => update({ slug: v })} />
                  </div>
                  <TextField label="Short description" value={p.description} onChange={(v) => update({ description: v })} />
                  <TextArea label="Long description" value={p.longDescription ?? ""} onChange={(v) => update({ longDescription: v })} />
                  <StringList label="Tech stack" items={p.tech_stack} onChange={(v) => update({ tech_stack: v })} />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <TextField label="GitHub URL" value={p.github_url ?? ""} onChange={(v) => update({ github_url: v })} />
                    <TextField label="Live URL" value={p.live_url ?? ""} onChange={(v) => update({ live_url: v })} />
                    <TextField label="Year" value={p.year ?? ""} onChange={(v) => update({ year: v })} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-[var(--text-dim)]">
                    <input type="checkbox" checked={!!p.featured} onChange={(e) => update({ featured: e.target.checked })} />
                    Featured
                  </label>
                  <ImageField label="Showcase image" value={p.image} onChange={(v) => update({ image: v })} />
                </>
              )}
            />
          )}

          {tab === "GitHub" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField label="Username" value={draft.github.username} onChange={(v) => set("github", { ...draft.github, username: v })} />
              <TextField label="Profile URL" value={draft.github.profileUrl} onChange={(v) => set("github", { ...draft.github, profileUrl: v })} />
            </div>
          )}

          {tab === "Education" && (
            <ArrayEditor<EducationItem>
              label="My Uni Story (education)"
              items={draft.uniStory}
              onChange={(v) => set("uniStory", v)}
              create={() => ({ school: "New School", degree: "", period: "" })}
              titleOf={(e) => e.school}
              render={(e, update) => (
                <>
                  <ImageField label="Logo" value={e.logo} onChange={(v) => update({ logo: v })} />
                  <TextField label="School" value={e.school} onChange={(v) => update({ school: v })} />
                  <TextField label="Degree" value={e.degree} onChange={(v) => update({ degree: v })} />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <TextField label="Period" value={e.period} onChange={(v) => update({ period: v })} />
                    <TextField label="Grade" value={e.grade ?? ""} onChange={(v) => update({ grade: v })} />
                    <TextField label="Tag" value={e.tag ?? ""} onChange={(v) => update({ tag: v })} />
                  </div>
                  <TextField label="Activities" value={e.activities ?? ""} onChange={(v) => update({ activities: v })} />
                  <TextArea label="Description" value={e.description ?? ""} onChange={(v) => update({ description: v })} />
                  <StringList label="Skills" items={e.skills ?? []} onChange={(v) => update({ skills: v })} />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField label="Media title" value={e.mediaTitle ?? ""} onChange={(v) => update({ mediaTitle: v })} />
                    <TextField label="Media caption" value={e.mediaCaption ?? ""} onChange={(v) => update({ mediaCaption: v })} />
                  </div>
                  <ImageField label="Media image" value={e.mediaImage} onChange={(v) => update({ mediaImage: v })} />
                </>
              )}
            />
          )}

          {tab === "Placements" && (
            <ArrayEditor<PlacementItem>
              label="Placements"
              items={draft.placements}
              onChange={(v) => set("placements", v)}
              create={() => ({ company: "New Company", role: "", period: "", projects: [], skills: [] })}
              titleOf={(p) => p.company}
              render={(p, update) => (
                <>
                  <ImageField label="Logo" value={p.logo} onChange={(v) => update({ logo: v })} />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField label="Company" value={p.company} onChange={(v) => update({ company: v })} />
                    <TextField label="Role" value={p.role} onChange={(v) => update({ role: v })} />
                    <TextField label="Period" value={p.period} onChange={(v) => update({ period: v })} />
                    <TextField label="Location" value={p.location ?? ""} onChange={(v) => update({ location: v })} />
                  </div>
                  <TextArea label="Description" value={p.description ?? ""} onChange={(v) => update({ description: v })} />
                  <ArrayEditor
                    label="Projects"
                    items={p.projects ?? []}
                    onChange={(v) => update({ projects: v })}
                    create={() => ({ title: "New project", description: "" })}
                    titleOf={(pr) => pr.title}
                    render={(pr, u) => (
                      <>
                        <TextField label="Title" value={pr.title} onChange={(v) => u({ title: v })} />
                        <TextArea label="Description" value={pr.description} onChange={(v) => u({ description: v })} />
                      </>
                    )}
                  />
                  <StringList label="Skills" items={p.skills ?? []} onChange={(v) => update({ skills: v })} />
                </>
              )}
            />
          )}

          {(tab === "Clubs" || tab === "Work") && (
            <ArrayEditor<Experience>
              label={tab === "Clubs" ? "Clubs & societies" : "Working story (jobs)"}
              items={tab === "Clubs" ? draft.clubs : draft.workingStory}
              onChange={(v) => (tab === "Clubs" ? set("clubs", v) : set("workingStory", v))}
              create={() => ({ org: "New Organisation", roles: [{ title: "Role" }] })}
              titleOf={(x) => x.org}
              render={(x, update) => (
                <>
                  <ImageField label="Logo" value={x.logo} onChange={(v) => update({ logo: v })} />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField label="Organisation" value={x.org} onChange={(v) => update({ org: v })} />
                    <TextField label="Meta (e.g. 2 yrs 10 mos)" value={x.meta ?? ""} onChange={(v) => update({ meta: v })} />
                  </div>
                  <TextField label="Location" value={x.location ?? ""} onChange={(v) => update({ location: v })} />
                  <ArrayEditor<ExperienceRole>
                    label="Roles"
                    items={x.roles}
                    onChange={(v) => update({ roles: v })}
                    create={() => ({ title: "New role" })}
                    titleOf={(r) => r.title}
                    render={(r, u) => (
                      <>
                        <TextField label="Title" value={r.title} onChange={(v) => u({ title: v })} />
                        <TextField label="Meta" value={r.meta ?? ""} onChange={(v) => u({ meta: v })} />
                        <TextArea label="Description" value={r.description ?? ""} onChange={(v) => u({ description: v })} />
                        <StringList label="Bullets" items={r.bullets ?? []} onChange={(v) => u({ bullets: v })} />
                        <StringList label="Skills" items={r.skills ?? []} onChange={(v) => u({ skills: v })} />
                      </>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField label="Media title" value={x.mediaTitle ?? ""} onChange={(v) => update({ mediaTitle: v })} />
                    <TextField label="Media caption" value={x.mediaCaption ?? ""} onChange={(v) => update({ mediaCaption: v })} />
                  </div>
                  <ImageField label="Media image" value={x.mediaImage} onChange={(v) => update({ mediaImage: v })} />
                </>
              )}
            />
          )}

          {tab === "Honors" && (
            <ArrayEditor<HonorItem>
              label="Honors & awards"
              items={draft.honors}
              onChange={(v) => set("honors", v)}
              create={() => ({ title: "New honor" })}
              titleOf={(h) => h.title}
              render={(h, update) => (
                <>
                  <TextField label="Title" value={h.title} onChange={(v) => update({ title: v })} />
                  <TextField label="Issuer" value={h.issuer ?? ""} onChange={(v) => update({ issuer: v })} />
                  <TextField label="Associated with" value={h.associated ?? ""} onChange={(v) => update({ associated: v })} />
                  <TextArea label="Description" value={h.description ?? ""} onChange={(v) => update({ description: v })} />
                  <ImageField label="Image" value={h.image} onChange={(v) => update({ image: v })} />
                </>
              )}
            />
          )}

          {tab === "Orgs" && (
            <ArrayEditor<OrganizationItem>
              label="Organizations"
              items={draft.organizations}
              onChange={(v) => set("organizations", v)}
              create={() => ({ name: "New organization" })}
              titleOf={(o) => o.name}
              render={(o, update) => (
                <>
                  <TextField label="Name" value={o.name} onChange={(v) => update({ name: v })} />
                  <TextField label="Role" value={o.role ?? ""} onChange={(v) => update({ role: v })} />
                  <TextArea label="Description" value={o.description ?? ""} onChange={(v) => update({ description: v })} />
                </>
              )}
            />
          )}

          {tab === "Achievements" && (
            <ArrayEditor<Achievement>
              label="Achievements"
              items={draft.achievements}
              onChange={(v) => set("achievements", v)}
              create={() => ({ title: "New achievement", description: "" })}
              titleOf={(a) => a.title}
              render={(a, update) => (
                <>
                  <TextField label="Title" value={a.title} onChange={(v) => update({ title: v })} />
                  <TextArea label="Description" value={a.description} onChange={(v) => update({ description: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <TextField label="Year" value={a.year ?? ""} onChange={(v) => update({ year: v })} />
                    <TextField label="Tag" value={a.tag ?? ""} onChange={(v) => update({ tag: v })} />
                  </div>
                  <ImageField label="Image" value={a.image} onChange={(v) => update({ image: v })} />
                </>
              )}
            />
          )}

          {tab === "Contact" && (
            <>
              <TextArea label="Blurb" value={draft.contact.blurb} onChange={(v) => set("contact", { ...draft.contact, blurb: v })} />
              <TextField label="Email" value={draft.contact.email} onChange={(v) => set("contact", { ...draft.contact, email: v })} />
            </>
          )}

          {tab === "Raw JSON" && <RawJsonEditor draft={draft} setDraft={setDraft} />}
        </div>
      </div>
    </main>
  );
}

function RawJsonEditor({
  draft,
  setDraft,
}: {
  draft: SiteContent;
  setDraft: (c: SiteContent) => void;
}) {
  const initial = useMemo(() => JSON.stringify(draft, null, 2), [draft]);
  const [text, setText] = useState(initial);
  const [err, setErr] = useState("");

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[var(--text-dim)]">
        Power editor — the entire content tree. Apply to load it back into the
        structured editors, then Save.
      </p>
      <textarea
        className="h-[60vh] w-full rounded-lg border border-[var(--glass-border)] bg-black/50 p-3 font-mono text-xs text-[var(--text)] outline-none focus:border-[var(--teal)]"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
      {err && <p className="text-sm text-[#f87171]">{err}</p>}
      <button
        onClick={() => {
          try {
            setDraft(JSON.parse(text));
            setErr("");
          } catch (e) {
            setErr("Invalid JSON: " + (e as Error).message);
          }
        }}
        className="self-start rounded-lg bg-[var(--teal)] px-4 py-2 text-xs font-semibold text-black"
      >
        Apply to editor
      </button>
    </div>
  );
}
