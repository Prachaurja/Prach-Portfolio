"use client";

import { useContent } from "@/context/ContentProvider";
import SocialIcon from "@/components/system/SocialIcon";

export default function Footer() {
  const { content } = useContent();
  return (
    <footer className="relative z-10 mt-20 px-6 py-12">
      <div className="container-x">
        <div className="card flex flex-col items-center justify-between gap-5 px-8 py-7 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="pixel-sprite" aria-hidden="true" />
            <span className="font-display font-bold text-gradient">PRACHAURJA SARKER</span>
          </div>
          <p className="text-sm text-[var(--text-dim)]">
            Built with Next.js, FastAPI &amp; Three.js · {new Date().getFullYear()}
          </p>
          <div className="flex gap-3">
            {content.socials
              .filter((s) => s.icon !== "link")
              .map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="text-[var(--text-dim)] transition-colors hover:text-[var(--teal)]"
                >
                  <SocialIcon icon={s.icon} className="h-[18px] w-[18px]" />
                </a>
              ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
