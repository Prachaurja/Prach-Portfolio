"use client";

import Hero3D from "@/components/three/Hero3D";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center px-6"
    >
      {/* 3D particle field fills the background */}
      <Hero3D />

      {/* Glass headline panel floats on top */}
      <div className="glass glass-glow relative z-10 max-w-3xl px-8 py-12 text-center sm:px-14 sm:py-16">
        <p className="font-display mb-4 text-sm uppercase tracking-[0.3em] text-[var(--teal)]">
          <b> Data Science Enthusiast & Full-Stack Developer based on Python and Javascript Frameworks </b>
        </p>
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
          Building <span className="text-gradient">Ambitious</span>
          <br />
          Systems for the Web
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[var(--text-dim)]">
          I design and ship full-stack products — from real-time dashboards to
          AI-powered tools. Currently turning ideas into things people use.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="rounded-xl border border-[var(--teal)] bg-[var(--teal)]/10 px-6 py-3 font-medium text-[var(--teal)] transition-colors hover:bg-[var(--teal)]/20"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-[var(--glass-border)] px-6 py-3 font-medium text-[var(--text)] transition-colors hover:border-[var(--violet)]"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}