import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Fraunces serves both display (headings) and body now.
// Loading a range of weights so headings can be bold and body regular.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Prachaurja — Full-Stack Developer",
  description:
    "Portfolio of Prachaurja: full-stack engineering, backend, and data/AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={fraunces.variable}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}