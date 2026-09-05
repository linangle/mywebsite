import { ProjectsArt } from "./art/ProjectsArt";
import { SCREEN_VIEWBOX } from "./art/projectsPaths";

function Pending() {
  return <p className="desk-pending">forthcoming.</p>;
}

/**
 * Follows the desk — same background, so it reads as the next stretch of one
 * continuous page. Wide screens get the whole setup with the text sitting on
 * the laptop screen; narrow screens keep just the screen, stretched to fit the
 * text.
 */
export function ProjectsSection() {
  return (
    <section id="projects" className="setup" aria-label="projects">
      <div className="setup-scene">
        <ProjectsArt className="art" />
        <h2 className="desk-heading">projects</h2>
        <Pending />
      </div>

      <div className="setup-narrow">
        <h2 className="desk-heading">projects</h2>
        <div className="setup-screen">
          {/* screen only — the laptop shell distorts once stretched */}
          <ProjectsArt
            className="art"
            viewBox={SCREEN_VIEWBOX}
            preserveAspectRatio="none"
            parts={["screen"]}
          />
          <Pending />
        </div>
      </div>
    </section>
  );
}
