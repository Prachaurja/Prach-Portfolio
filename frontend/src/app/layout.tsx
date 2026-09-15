import type { Metadata } from "next";
// Self-hosted fonts (fontsource) — works offline / in sandboxes where
// Google Fonts is unreachable. Variables match the ones globals.css expects.
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "./globals.css";
import { ContentProvider } from "@/context/ContentProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/system/LoadingScreen";
import ScrollProgress from "@/components/motion/ScrollProgress";



export const metadata: Metadata = {
  title: "Prachaurja Sarker — Full-Stack Developer & Data Science",
  description:
    "Portfolio of Prachaurja Sarker: full-stack engineering, backend APIs, and data/AI. Building ambitious systems for the web.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LoadingScreen />
        <ScrollProgress />
        <ContentProvider>
          <Navbar />
          {children}
          <Footer />
        </ContentProvider>
      </body>
    </html>
  );
}
