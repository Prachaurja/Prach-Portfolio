"use client";

import Link from "next/link";
import { useContent } from "@/context/ContentProvider";
import { Download, ArrowLeft } from "lucide-react";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="resume-section">
      <h2 className="resume-h2">{title}</h2>
      {children}
    </section>
  );
}

export default function ResumePage() {
  const { content } = useContent();
  const { about, contact, github, skillGroups, projects, uniStory, placements, clubs, workingStory, honors, organizations, achievements } = content;

  const print = () => window.print();
  const generated = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="resume-root">
      {/* toolbar — hidden when printing */}
      <div className="no-print mx-auto mb-6 flex max-w-[820px] items-center justify-between px-4 pt-28">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] px-4 py-2 text-sm text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-[var(--text-dim)] sm:inline">
            Generated live from your portfolio · {generated}
          </span>
          <button
            onClick={print}
            className="flex items-center gap-2 rounded-xl bg-[var(--teal)] px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-[1.02]"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
        </div>
      </div>

      {/* the paper */}
      <article className="resume-paper">
        <header className="resume-header">
          <h1 className="resume-name">{about.name}</h1>
          <p className="resume-role">{about.role}</p>
          <p className="resume-contact">
            {contact.email}
            {about.quickFacts.find((f) => f.label.toLowerCase() === "location") &&
              ` · ${about.quickFacts.find((f) => f.label.toLowerCase() === "location")!.value}`}
            {` · `}
            <a href={github.profileUrl}>{github.profileUrl.replace("https://", "")}</a>
          </p>
        </header>

        <Section title="Summary">
          <p className="resume-p">{about.paragraphs[0]}</p>
        </Section>

        <Section title="Skills">
          <div className="resume-skills">
            {skillGroups.map((g) => (
              <p key={g.category} className="resume-p">
                <strong>{g.category}: </strong>
                {g.skills.map((s) => s.name).join(", ")}
              </p>
            ))}
          </div>
        </Section>

        {placements.length > 0 && (
          <Section title="Industry Placements">
            {placements.map((p) => (
              <div key={p.company} className="resume-entry">
                <div className="resume-entry-head">
                  <span className="resume-entry-title">{p.role} — {p.company}</span>
                  <span className="resume-entry-meta">{p.period}</span>
                </div>
                {p.description && <p className="resume-p">{p.description}</p>}
                {p.projects && p.projects.length > 0 && (
                  <ul className="resume-ul">
                    {p.projects.map((proj, i) => (
                      <li key={i}>
                        <strong>{proj.title}:</strong> {proj.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Selected Projects">
            {projects.map((p) => (
              <div key={p.slug} className="resume-entry">
                <div className="resume-entry-head">
                  <span className="resume-entry-title">{p.title}</span>
                  <span className="resume-entry-meta">{p.year ?? ""}</span>
                </div>
                <p className="resume-p">{p.longDescription ?? p.description}</p>
                {p.tech_stack.length > 0 && (
                  <p className="resume-tags">{p.tech_stack.join(" · ")}</p>
                )}
              </div>
            ))}
          </Section>
        )}

        {uniStory.length > 0 && (
          <Section title="Education">
            {uniStory.map((e) => (
              <div key={e.school} className="resume-entry">
                <div className="resume-entry-head">
                  <span className="resume-entry-title">{e.school}</span>
                  <span className="resume-entry-meta">{e.period}</span>
                </div>
                <p className="resume-p">
                  {e.degree}
                  {e.grade ? ` · ${e.grade}` : ""}
                </p>
              </div>
            ))}
          </Section>
        )}

        {workingStory.length > 0 && (
          <Section title="Work Experience">
            {workingStory.map((w) => (
              <div key={w.org} className="resume-entry">
                {w.roles.map((r, i) => (
                  <div key={i} className="resume-entry-head">
                    <span className="resume-entry-title">
                      {r.title} — {w.org}
                    </span>
                    <span className="resume-entry-meta">{r.meta}</span>
                  </div>
                ))}
                {w.location && <p className="resume-tags">{w.location}</p>}
              </div>
            ))}
          </Section>
        )}

        {clubs.length > 0 && (
          <Section title="Leadership & Community">
            {clubs.map((c) => (
              <div key={c.org} className="resume-entry">
                <div className="resume-entry-head">
                  <span className="resume-entry-title">{c.org}</span>
                  <span className="resume-entry-meta">{c.meta}</span>
                </div>
                {c.roles.map((r, i) => (
                  <p key={i} className="resume-p">
                    <strong>{r.title}</strong>
                    {r.meta ? ` · ${r.meta}` : ""}
                  </p>
                ))}
              </div>
            ))}
          </Section>
        )}

        {(honors.length > 0 || achievements.length > 0) && (
          <Section title="Honors & Awards">
            <ul className="resume-ul">
              {honors.map((h) => (
                <li key={h.title}>
                  <strong>{h.title}</strong>
                  {h.issuer ? ` — ${h.issuer}` : ""}
                </li>
              ))}
              {achievements.map((a, i) => (
                <li key={`a-${i}`}>
                  <strong>{a.title}</strong>
                  {a.year ? ` (${a.year})` : ""}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {organizations.length > 0 && (
          <Section title="Organizations">
            <ul className="resume-ul">
              {organizations.map((o) => (
                <li key={o.name}>
                  <strong>{o.name}</strong>
                  {o.role ? ` — ${o.role}` : ""}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <footer className="resume-footer">
          Generated from prachaurja.dev · {generated}
        </footer>
      </article>
    </div>
  );
}
