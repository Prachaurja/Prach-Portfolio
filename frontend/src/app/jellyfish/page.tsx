import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import JellyfishExperience from "@/components/three/jellyfish/JellyfishExperience";

export const metadata: Metadata = {
  title: "Jellyfish — Prachaurja Sarker",
  description:
    "An interactive, physics-driven jellyfish simulation: jet-propulsion swimming, verlet tentacles, and a bioluminescent glow — built with React Three Fiber.",
};

export default function JellyfishPage() {
  return (
    <>
      <JellyfishExperience />
      <Link
        href="/"
        className="glass fixed left-4 top-20 z-40 flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-white/70 transition-colors hover:text-white sm:top-28"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Portfolio
      </Link>
    </>
  );
}
