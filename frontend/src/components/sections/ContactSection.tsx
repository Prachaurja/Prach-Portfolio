"use client";

import { useState } from "react";
import { Mail, Download, ArrowUpRight } from "lucide-react";
import { sendContact } from "@/lib/api";
import { useContent } from "@/context/ContentProvider";
import SectionHeader from "@/components/motion/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import SocialIcon from "@/components/system/SocialIcon";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactSection() {
  const { content } = useContent();
  const { contact, socials, github } = content;
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");

  const update =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await sendContact(form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="container-x relative z-10 py-24 md:py-32">
      <SectionHeader eyebrow="Get in Touch" title="Let's *Talk*" />
      <p className="mt-4 max-w-xl text-[var(--text-dim)]">{contact.blurb}</p>

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
        {/* quick actions + socials */}
        <Reveal className="card flex flex-col px-7 py-8 sm:px-9">
          <div className="flex flex-wrap gap-3">
            <Magnetic>
              <a
                href={`mailto:${contact.email}`}
                className="sheen flex items-center gap-2 rounded-2xl bg-[var(--teal)] px-6 py-3 font-medium text-black"
              >
                <Mail className="h-4 w-4" /> Send an Email
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={github.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-2xl border border-[var(--glass-border)] px-6 py-3 font-medium text-[var(--text)] transition-colors hover:border-[var(--teal)]"
              >
                GitHub Profile <ArrowUpRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="/resume"
                className="flex items-center gap-2 rounded-2xl border border-[var(--glass-border)] px-6 py-3 font-medium text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
              >
                <Download className="h-4 w-4" /> Download Resume
              </a>
            </Magnetic>
          </div>

          <div className="hairline my-7" />

          <h3 className="label-mark mb-4">Socials</h3>
          <div className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[var(--glass-border)] px-4 py-2.5 text-sm text-[var(--text-dim)] transition-all hover:-translate-y-0.5 hover:text-[var(--text)]"
              >
                <SocialIcon icon={s.icon} className="h-4 w-4" />
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>

        {/* message form */}
        <Reveal delay={0.1} className="card glass-glow flex flex-col gap-4 px-7 py-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={update("website")}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm text-[var(--text-dim)]">Name</label>
              <input
                id="name"
                required
                value={form.name}
                onChange={update("name")}
                className="rounded-xl border border-[var(--glass-border)] bg-white/5 px-4 py-3 text-[var(--text)] outline-none transition-colors focus:border-[var(--teal)]"
                placeholder="Your name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm text-[var(--text-dim)]">Email</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                className="rounded-xl border border-[var(--glass-border)] bg-white/5 px-4 py-3 text-[var(--text)] outline-none transition-colors focus:border-[var(--teal)]"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm text-[var(--text-dim)]">Message</label>
              <textarea
                id="message"
                required
                rows={4}
                value={form.message}
                onChange={update("message")}
                className="resize-none rounded-xl border border-[var(--glass-border)] bg-white/5 px-4 py-3 text-[var(--text)] outline-none transition-colors focus:border-[var(--teal)]"
                placeholder="What's on your mind?"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="sheen rounded-xl bg-[var(--teal)] px-6 py-3 font-medium text-black transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "sent" && (
              <p className="text-center text-sm text-[var(--teal)]">
                Thanks — your message is on its way. I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-sm text-[#f87171]">
                Something went wrong. Please try again, or email me directly.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}
