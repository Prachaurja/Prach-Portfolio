"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Achievements", href: "#achievements" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`glass glass-glow flex items-center gap-4 px-5 py-3 transition-all duration-300 ${
          scrolled ? "scale-[0.98] opacity-95" : ""
        }`}
        style={{ maxWidth: "min(1000px, 100%)", width: "100%" }}
      >
        <a href="#top" className="flex items-center gap-3 shrink-0" aria-label="Home">
          <span className="pixel-sprite" aria-hidden="true" />
          <span className="font-display font-bold tracking-tight text-gradient hidden sm:inline">
            PRACHAURJA
          </span>
        </a>

        <div className="flex-1" />

        <ul className="flex items-center gap-0.5 sm:gap-1">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="px-2.5 py-2 text-sm text-[var(--text-dim)] hover:text-[var(--text)] transition-colors rounded-lg whitespace-nowrap"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}