"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "GitHub", href: "#github" },
  { label: "Uni", href: "#uni-story" },
  { label: "Placements", href: "#placements" },
  { label: "Clubs", href: "#clubs" },
  { label: "Work", href: "#working-story" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`glass glass-glow flex items-center gap-3 px-5 py-3 transition-all duration-300 ${
          scrolled ? "scale-[0.99] opacity-98" : ""
        }`}
        style={{ maxWidth: "min(1040px, 100%)", width: "100%" }}
      >
        <a href="#top" className="flex shrink-0 items-center gap-3" aria-label="Home">
          <span className="pixel-sprite" aria-hidden="true" />
          <span className="font-display hidden font-bold tracking-tight text-gradient sm:inline">
            PRACHAURJA
          </span>
        </a>

        <div className="flex-1" />

        <ul className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-lg px-2.5 py-2 text-sm text-[var(--text-dim)] transition-colors hover:text-[var(--text)]"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/resume"
          className="hidden rounded-xl border border-[var(--glass-border)] px-4 py-2 text-sm text-[var(--text)] transition-colors hover:border-[var(--teal)] sm:inline-block"
        >
          Resume
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-[var(--text)] lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="glass glass-glow absolute top-[4.7rem] left-4 right-4 z-50 grid grid-cols-2 gap-1 p-3 lg:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-[var(--text-dim)] transition-colors hover:bg-white/5 hover:text-[var(--text)]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/resume"
              onClick={() => setOpen(false)}
              className="col-span-2 rounded-lg border border-[var(--glass-border)] px-3 py-2.5 text-center text-sm text-[var(--text)]"
            >
              Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
