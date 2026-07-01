import Hero3D from "@/components/three/Hero3D";
import QuoteBar from "@/components/system/QuoteBar";
import Hero from "@/components/sections/Hero";
import AboutSection from "@/components/sections/AboutSection";
import TechMarquee from "@/components/sections/TechMarquee";
import SkillsSection from "@/components/sections/SkillsSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import GithubSection from "@/components/sections/GithubSection";
import UniStorySection from "@/components/sections/UniStorySection";
import PlacementsSection from "@/components/sections/PlacementsSection";
import ClubsSection from "@/components/sections/ClubsSection";
import HonorsSection from "@/components/sections/HonorsSection";
import OrganizationsSection from "@/components/sections/OrganizationsSection";
import WorkingStorySection from "@/components/sections/WorkingStorySection";
import AchievementsSection from "@/components/sections/AchievementsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      {/* fixed star-field background — kept exactly as-is */}
      <Hero3D />
      <QuoteBar />
      <main>
        <Hero />
        <AboutSection />
        <TechMarquee />
        <SkillsSection />
        <ProjectsSection />
        <GithubSection />
        <UniStorySection />
        <PlacementsSection />
        <ClubsSection />
        <HonorsSection />
        <OrganizationsSection />
        <WorkingStorySection />
        <AchievementsSection />
        <ContactSection />
      </main>
    </>
  );
}
