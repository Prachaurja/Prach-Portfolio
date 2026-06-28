"use client";

import { useState } from "react";
import { sendContact } from "@/lib/api";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");

  const update = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

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
    <section id="contact" className="relative z-10 mx-auto max-w-2xl px-6 py-24">
      <div className="mb-12 text-center">
        <p className="font-display mb-3 text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
          Get in Touch
        </p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">
          Let&apos;s <span className="text-gradient">Talk</span>
        </h2>
        <p className="mt-4 text-[var(--text-dim)]">
          Open to roles, freelance, or just a good conversation. Drop me a line.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass glass-glow flex flex-col gap-5 px-8 py-10">
        {/* Honeypot — hidden from humans, catches bots */}
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
            rows={5}
            value={form.message}
            onChange={update("message")}
            className="resize-none rounded-xl border border-[var(--glass-border)] bg-white/5 px-4 py-3 text-[var(--text)] outline-none transition-colors focus:border-[var(--teal)]"
            placeholder="What's on your mind?"
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-xl border border-[var(--teal)] bg-[var(--teal)]/10 px-6 py-3 font-medium text-[var(--teal)] transition-colors hover:bg-[var(--teal)]/20 disabled:opacity-50"
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
            Something went wrong sending that. Please try again, or email me directly.
          </p>
        )}
      </form>
    </section>
  );
}