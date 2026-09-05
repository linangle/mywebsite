import { ExperienceSection } from "@/components/ExperienceSection";
import { LandingScene } from "@/components/LandingScene";
import { ProjectsSection } from "@/components/ProjectsSection";
import { LANDING_ONLY } from "@/site";

export default function Home() {
  return (
    <main className="home">
      <LandingScene />
      {!LANDING_ONLY && (
        <>
          <ExperienceSection />
          <ProjectsSection />
        </>
      )}
    </main>
  );
}
