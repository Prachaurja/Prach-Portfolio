import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "@/context/ContentProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/system/LoadingScreen";
import ScrollProgress from "@/components/motion/ScrollProgress";

// Body sans-serif (also carries the single italic used by the quote ribbon).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Display sans-serif for headings.
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

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
      <body className={`${inter.variable} ${plusJakarta.variable}`}>
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
