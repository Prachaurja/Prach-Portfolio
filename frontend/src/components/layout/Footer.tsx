export default function Footer() {
    return (
      <footer className="relative z-10 px-6 py-12 mt-20">
        <div
          className="glass mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-8 py-6"
          style={{ maxWidth: "1100px" }}
        >
          <div className="flex items-center gap-3">
            <span className="pixel-sprite" aria-hidden="true" />
            <span className="font-display font-bold text-gradient">PRACHAURJA</span>
          </div>
          <p className="text-sm text-[var(--text-dim)]">
            Built with Next.js, FastAPI &amp; Three.js · {new Date().getFullYear()}
          </p>
          <div className="flex gap-4 text-sm">
            <a
              href="https://github.com/Prachaurja"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--text-dim)] hover:text-[var(--teal)] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    );
  }